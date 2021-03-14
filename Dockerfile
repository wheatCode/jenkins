FROM node:latest
COPY . /app/
WORKDIR /app/
RUN npm install -g npm@latest
RUN npm install 
RUN node node_modules/puppeteer/install.js
EXPOSE 3000


CMD [ "npm", "test" ]
