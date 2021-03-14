FROM node:v14.16.0
COPY . /app/
WORKDIR /app/
EXPOSE 3000


CMD [ "npm", "test" ]
