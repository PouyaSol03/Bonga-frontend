FROM node:22-alpine AS build

WORKDIR /app

RUN npm config set registry https://mirror2.chabokan.net/npm/
RUN npm config set replace-registry-host always

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_WEBSOCKET_BASE_URL
ARG VITE_SITE_URL
ARG SEO_API_BASE_URL
ARG SEO_SITE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_WEBSOCKET_BASE_URL=${VITE_WEBSOCKET_BASE_URL}
ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV SEO_API_BASE_URL=${SEO_API_BASE_URL}
ENV SEO_SITE_URL=${SEO_SITE_URL}

RUN npm run build

FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
