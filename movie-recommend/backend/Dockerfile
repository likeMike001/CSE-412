FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install pandas scikit-learn

EXPOSE 3001
CMD ["npm", "start"]
