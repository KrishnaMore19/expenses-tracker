# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Expose port for the frontend app (Vite default)
EXPOSE 5173

# Start the frontend app
CMD ["npm", "run", "dev"]
