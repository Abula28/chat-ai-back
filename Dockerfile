# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Start your server
CMD ["node", "api/index.js"]
