# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npx ng build --configuration production

# Replace hardcoded localhost API URLs with relative paths for Docker
RUN find /app/dist/student-data-processor-frontend/browser -name '*.js' \
    -exec sed -i 's|http://localhost:9090/api|/api|g' {} +

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/student-data-processor-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
