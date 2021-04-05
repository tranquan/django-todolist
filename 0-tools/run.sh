#!/bin/bash
echo "running" $1

if [ "$1" = "local" ]; then
  echo "--- run mailhog..."
  eval "./MailHog &"
  echo "--- run django..."
  eval "python manage.py runserver"

elif [ "$1" = "docker" ]; then
  eval "docker-compose -f local.yml up"

fi