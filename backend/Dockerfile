# Use the official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the backend server listens on
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "dev"]
