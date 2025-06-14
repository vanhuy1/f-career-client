import { Server } from 'socket.io';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
  TUser,
  TAcceptCallEventData,
  TCallUserEventData,
  TNewMeetNameEventData,
  TSendMessageEventData,
  TUpdateScreenSharingEventData,
  TUpdateUserAudioEventData,
  TUpdateUserVideoEventData,
} from '../../utils/types';

// Extend the Node.js HTTP Server interface to include io
declare module 'http' {
  interface Server {
    io?: Server;
  }
}

// Store users in memory (consider using a database for production)
const users: Record<string, TUser> = {};

export async function GET(req: NextRequest, { params }: { params: Record<string, string> }) {
  try {
    // Get the underlying HTTP server from the request context
    const { server } = req as any; // Note: This is a workaround; type safety is limited due to Next.js internals

    if (!server.io) {
      const io = new Server(server, {
        path: '/api/socket',
        cors: {
          origin: '*', // Adjust for production to specific origins
          methods: ['GET', 'POST'],
        },
      });

      server.io = io;

      io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Generic events
        socket.on('save-user-data', (user: TUser) => {
          users[socket.id] = user;
          console.log(`Saved user data for socket ${socket.id}:`, user);
        });

        socket.on('check-meet-link', (id: string) => {
          if (!users[id]) {
            socket.emit('link-not-available');
          }
        });

        socket.on('send-message', (data: TSendMessageEventData) => {
          const { to, message } = data;
          io.to(to).emit('received-message', message);
        });

        socket.on('meet-new-name', (data: TNewMeetNameEventData) => {
          const { to, newMeetName } = data;
          io.to(to).emit('update-meet-name', newMeetName);
        });

        // Disconnection events
        socket.on('disconnect', () => {
          socket.broadcast.emit('user-left', socket.id);
          delete users[socket.id];
          console.log(`Socket disconnected: ${socket.id}`);
        });

        socket.on('remove-from-meet', (userToRemove: string) => {
          io.to(userToRemove).emit('removed-from-meet');
        });

        socket.on('left-meet', (to: string) => {
          io.to(to).emit('other-user-left-meet');
        });

        // Meet stream events
        socket.on('update-user-audio', (data: TUpdateUserAudioEventData) => {
          const { to, shouldMute } = data;
          io.to(to).emit('update-other-user-audio', shouldMute);
        });

        socket.on('update-user-video', (data: TUpdateUserVideoEventData) => {
          const { to, shouldStop } = data;
          io.to(to).emit('update-other-user-video', shouldStop);
        });

        socket.on('update-screen-sharing', (data: TUpdateScreenSharingEventData) => {
          const { to, isSharing } = data;
          io.to(to).emit('update-other-user-screen-sharing', isSharing);
        });

        // Meet initiation events
        socket.on('call-user', (data: TCallUserEventData) => {
          const { to, from, signal } = data;
          io.to(to).emit('request-meet-connection', { from, signal });
        });

        socket.on('accept-call', (data: TAcceptCallEventData) => {
          const { to, from, signal, meetName } = data;
          io.to(to).emit('call-accepted', { from, signal, meetName });
        });

        socket.on('reject-call', (to: string) => {
          io.to(to).emit('call-rejected');
        });

        socket.on('cancel-meet-request', (to: string) => {
          io.to(to).emit('call-canceled');
        });

        socket.on('already-in-meet', (to: string) => {
          io.to(to).emit('other-user-already-in-meet');
        });
      });
    }

    return NextResponse.json({ message: 'Socket.IO server initialized' }, { status: 200 });
  } catch (error) {
    console.error('Error initializing Socket.IO:', error);
    return NextResponse.json({ error: 'Failed to initialize Socket.IO' }, { status: 500 });
  }
}