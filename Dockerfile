FROM node:20.10.0

WORKDIR /usr/src/app

RUN rm -rf node_modules

COPY package.json /usr/src/app

RUN npm install bcrypt

RUN npm install

COPY . /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]
