# ------------------------
# BUILD STAGE
# ------------------------
    FROM node:22-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Install pnpm
    RUN npm install -g pnpm
    
    # Copy package files for dependency installation
    COPY package.json ./
    
    # Install dependencies
    RUN pnpm install
    
    # Copy rest of the application code
    COPY . .
    
    # Build the application
    RUN pnpm build
    
    # ------------------------
    # PRODUCTION STAGE
    # ------------------------
    FROM node:22-alpine AS runner
    
    # Set environment variables
    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1
    
    # Working directory
    WORKDIR /app
    
    # Install necessary production packages
    RUN apk add --no-cache dumb-init
    
    # Create a non-root user and group
    RUN addgroup --system --gid 1001 nodejs && \
        adduser --system --uid 1001 nextjs
    
    # Copy necessary files from builder stage
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    COPY --from=builder --chown=nextjs:nodejs /app/public ./public
    
    # Set user
    USER nextjs
    
    # Expose the listening port
    EXPOSE 3000
    
    # Set default environment variables
    ENV PORT=3000
    ENV HOSTNAME="0.0.0.0"
    
    
    # Start the application with dumb-init as PID 1
    ENTRYPOINT ["dumb-init", "--"]
    CMD ["node", "server.js"] 