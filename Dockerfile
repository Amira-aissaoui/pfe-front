# Use official nginx image as the base image
FROM nginx:1.21

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to replace the default nginx contents.
COPY  /dist/front-monitoring /usr/share/nginx/html

# Expose port 80
EXPOSE 80
