FROM node:22

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5000

CMD ["npm", "run", "start"]
