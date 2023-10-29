# Stage 1: Build the application
FROM node:18 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application source code
COPY dist/ ./dist/
COPY config.json ./

# Stage 2: Create the production image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Create a new user 'appuser' and set up the necessary permissions
RUN useradd -m appuser && \
    chown -R appuser:appuser /app

# Expose the port your application will run on
EXPOSE 8080

# Copy necessary files from the builder stage
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/config.json ./config.json

# Switch to 'appuser'
USER appuser

# Define the command to start your Node.js application
CMD ["node", "dist/app.js"]
