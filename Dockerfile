FROM node:16
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./build/ /usr/share/nginx/html
