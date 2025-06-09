# Use Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Serve using Vite preview
EXPOSE 4173
CMD ["npm", "run", "preview"]