FROM node:12

ENV HOME /home/ubuntu/development/express-api

WORKDIR ${HOME}
ADD . $HOME

RUN yarn install

EXPOSE 3000
