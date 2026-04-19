FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy pre-built artifacts from the current directory (dist/)
COPY . /usr/share/nginx/html

# Use envsubst to inject the $PORT variable at runtime and start nginx
CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
