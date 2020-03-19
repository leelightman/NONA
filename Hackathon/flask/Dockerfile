FROM ubuntu:18.04

#RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
#    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

#ENV LANG en_US.utf8

ENV LANG C.UTF-8
ENV PORT 7070
EXPOSE 7070

RUN apt-get update && apt-get install -y && \
    apt install -y git python3 python3-pip python3-venv

WORKDIR /home/NONA/

COPY ./ ./

RUN pip3 install -r requirements.txt && \
    flask init-db

CMD flask run -p 7070 --host=0.0.0.0