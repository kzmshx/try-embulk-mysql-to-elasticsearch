#FROM ibmjava:8-jre-alpine
#
#RUN apk update \
#    && apk add --no-cache curl
#
#RUN curl -o /usr/bin/embulk --create-dirs -L "https://dl.embulk.org/embulk-latest.jar" \
#    && chmod +x /usr/bin/embulk
#
#RUN embulk gem install embulk-input-mysql
#RUN embulk gem install embulk-output-elasticsearch
#
#RUN mkdir /root/config
#
#WORKDIR /root/config

#FROM arm64v8/openjdk:8-jre-alpine
FROM jruby:9.3.4.0-jre8

RUN apt update -y \
    && apt install -y curl

RUN curl -o /usr/bin/embulk --create-dirs -L "https://dl.embulk.org/embulk-latest.jar" \
    && chmod +x /usr/bin/embulk

RUN embulk selfupdate \
    && embulk gem install embulk-input-mysql \
    && embulk gem install embulk-output-elasticsearch
