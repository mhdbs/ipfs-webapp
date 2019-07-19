FROM node:alpine

ADD . /code

WORKDIR /code

ADD package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]