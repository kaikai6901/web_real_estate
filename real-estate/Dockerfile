# Use a Node.js base image
FROM node:18-alpine

WORKDIR /app

# Install dependencies
# COPY package*.json ./
# RUN npm install

# Copy ReactJS app files
COPY . .

# Build React app
# RUN npm run build
RUN npm install -g serve

# Expose React app port
EXPOSE 3000

# Start the React app
CMD ["serve","-s", "build"]
