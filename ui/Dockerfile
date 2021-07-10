# pull official base image
FROM python:3.8.3-alpine
#3.7-alpine

# set work directory
WORKDIR /usr/src/sumviz

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update
RUN apk add --update alpine-sdk
RUN apk add build-base
RUN pip install --upgrade pip
RUN apk add bash postgresql-dev gcc libffi libffi-dev python3-dev musl-dev  py3-setuptools zeromq-dev && \
pip install -U  cffi pip setuptools

# install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.prod.sh .

# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/sumviz/entrypoint.prod.sh"]