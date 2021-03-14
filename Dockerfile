FROM node:14.16
COPY . /app/
WORKDIR /app/
EXPOSE 3000


CMD [ "npm", "test" ]
