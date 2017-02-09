FROM node:7.5-alpine

MAINTAINER quocnguyen <quocnguyen@clgt.vn>

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# need python to build leveldb
RUN apk add --no-cache make gcc g++ python
# Install NPM
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 6969

CMD ["npm","start"]