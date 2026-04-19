# Stage 1: Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy build artifacts from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Use envsubst to inject the $PORT variable at runtime and start nginx
CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
