FROM node:v14
COPY . /app/
WORKDIR /app/
EXPOSE 3000


CMD [ "npm", "test" ]
