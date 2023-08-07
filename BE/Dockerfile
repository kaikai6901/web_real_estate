# Use a Node.js base image
FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Node.js app files
COPY . .

# Expose Node.js app port
EXPOSE 5555

# Start the Node.js app
CMD ["node", "server.js"]