FROM node:latest
COPY . /app/
WORKDIR /app/
EXPOSE 3000


CMD [ "npm", "test" ]
