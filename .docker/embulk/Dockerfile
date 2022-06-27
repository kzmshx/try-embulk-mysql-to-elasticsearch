FROM arm64v8/openjdk:8-jre-bullseye

RUN apt update -y \
    && apt install -y curl

RUN curl -o /usr/bin/embulk --create-dirs -L "https://dl.embulk.org/embulk-latest.jar" \
    && chmod +x /usr/bin/embulk

RUN embulk selfupdate \
    && embulk gem install embulk-input-mysql \
    && embulk gem install embulk-output-elasticsearch
