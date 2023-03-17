#!/usr/bin/env bash

pip install --user -U -r requirements.txt || exit 1

python3 manage.py collectstatic --no-input || exit 1

if [ -n "$SQL_HOST" ]; then
  SQL_PORT=${SQL_PORT-5432}
  echo "Waiting for database..."

  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done

  echo "database started"
fi

gunicorn SumViz.wsgi:application --bind 0.0.0.0:5000 --reload
