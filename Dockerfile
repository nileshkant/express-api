FROM node:12

ENV HOME /express-api

WORKDIR ${HOME}
ADD . $HOME

RUN yarn install

EXPOSE 3000
