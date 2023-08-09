#!/bin/bash

if [ -z "$1" ]; then
  echo "Ошибка: имя миграции не указано!"
  exit 1
fi

yarn migration:generate src/db/migrations/$1