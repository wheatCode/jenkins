FROM node:latest
COPY . /app/
RUN npm install -g npm@latest
RUN npm install 
RUN node node_modules/puppeteer/install.js
WORKDIR /app/
EXPOSE 3000


CMD [ "npm", "test" ]
