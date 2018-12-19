FROM node:10
WORKDIR /reservation-system
COPY package.json ./
RUN npm install 
COPY . /reservation-system
EXPOSE 3000
CMD ["npm", "start"]
