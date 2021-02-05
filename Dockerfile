# open docker with node version
FROM node:15.5.1-alpine3.10

# cd 
WORKDIR /usr/src/app/frontend

# install dependencies
COPY frontend/package*.json ./
RUN npm ci --only=production --verbose
COPY frontend/ ./

RUN npm run build
WORKDIR /usr/src/app/

# mv --> inside app
RUN mv frontend/build . && rm -r frontend

COPY backend/package*.json ./
RUN npm ci --only=production --verbose

# copy app === backend
COPY backend/ ./