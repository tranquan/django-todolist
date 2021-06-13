# Stage 1 - build react app
FROM node:14.17-alpine as build-deps

# Install dependencies here so docker can cache it
COPY ./frontend/webapp/package.json ./frontend/webapp/yarn.lock ./
RUN yarn install

COPY ./frontend/webapp ./
RUN yarn build

# Stage 2 - install & run webserver
FROM nginx:1.21-alpine
COPY --from=build-deps /build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


WORKDIR /react