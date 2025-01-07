# Backend
FROM node:22-alpine3.18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Set environment variable for the port
# ENV BACKEND_PORT=3000

# Expose the port
# EXPOSE $PORT 8080

CMD ["npm", "run", "start"]
