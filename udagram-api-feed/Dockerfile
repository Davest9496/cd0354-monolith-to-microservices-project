FROM node:18-alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm ci
# Bundle app source
COPY . .
# Expose port 8080
EXPOSE 8080
# Start the application
CMD [ "npm", "run", "prod" ]