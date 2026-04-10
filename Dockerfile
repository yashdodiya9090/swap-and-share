# Use Node.js 18 environment for building the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Use Node.js 18 environment for the runtime
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from the builder stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Create uploads directory (if not exists)
RUN mkdir -p uploads

# Hugging Face Spaces expects the application to listen on port 7860
EXPOSE 7860

# Specify environment variable for port
ENV PORT=7860

# Run the server
CMD ["node", "server.js"]
