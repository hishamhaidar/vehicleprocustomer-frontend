# Specify the base image
FROM node

# Set a working directory
WORKDIR /app

# Add package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . . 

# Build the app
RUN npm run build 

# Expose the port your app runs on
EXPOSE 3001

# Start the app
CMD [ "npm", "start" ]
