import io from 'socket.io-client';
import { SOCKET_URL, SOCKET_OPTIONS } from './constants';

// Create a socket connection directly to the root namespace
// This approach works better with the NestJS backend
const socket = SOCKET_URL 
  ? io(SOCKET_URL, SOCKET_OPTIONS) 
  : io(SOCKET_OPTIONS);

// Add connection event handlers
socket.on('connect', () => {
  console.log('Socket connected with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export default socket; 