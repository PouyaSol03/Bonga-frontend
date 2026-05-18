FROM node:22-alpine

WORKDIR /app

RUN npm config set registry https://mirror2.chabokan.net/npm/
RUN npm config set replace-registry-host always

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]