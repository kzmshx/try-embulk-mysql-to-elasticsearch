FROM ibmjava:8-jre-alpine

RUN apk update \
    && apk add --no-cache curl

RUN curl -o /usr/bin/embulk --create-dirs -L "https://dl.embulk.org/embulk-latest.jar" \
    && chmod +x /usr/bin/embulk

RUN embulk gem install embulk-input-mysql
RUN embulk gem install embulk-output-elasticsearch

RUN mkdir /root/config

WORKDIR /root/config
