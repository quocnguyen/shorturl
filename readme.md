
# shorturl

![shorturl](http://i.imgur.com/QL8denI.jpg)

shorturl is simple web application. It can help shorten your url. Writen in nodejs, backed by leveldb and can easy deploy using docker.

## Installation

shorturl only requires nodejs.

```
$ git clone git://github.com/quocnguyen/shorturl.git
$ cd shorturl
$ cp .env-sample .env
$ npm install
```

## Config

you can config your app using the environment variables in `.env` file.

| KEY  | MEAN |
| ------------- | ------------- |
| PORT  | the port shorturl will listen on  |
| DB  | folder where shorturl store database  |
| DOMAIN | your domain |


Start the application with
```
npm start
```

## Quick Start: Running shorturl in a Docker Container

To quickly tryout shorturl on your machine with Docker, I have a Docker image that includes everything you need to get started. Simply run:

```
sudo docker run \
  -e DB=./db \
  -e PORT=6969 \
  -e DOMAIN=http://localhost:6969 \
  --volume=/my/own/datadir:/usr/src/app/db:rw \
  --publish=3000:6969 \
  --detach=true \
  --name=shorturl \
  quocnguyen/shorturl:latest
```

The `--volume /my/own/datadir:/usr/src/app/db` part of the command mounts the /my/own/datadir directory from the underlying host system as /usr/src/app/db inside the container, where shorturl by default will write its data files.

Note that users on host systems with SELinux enabled may see issues with this. The current workaround is to assign the relevant SELinux policy type to the new data directory so that the container will be allowed to access it:

```
$ chcon -Rt svirt_sandbox_file_t /my/own/datadir
```

# License

MIT

