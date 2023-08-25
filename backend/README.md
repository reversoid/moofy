# moofy-backend
## Миграции
- Перед запуском команд `yarn migration:create, generate, run, down` необходимо выполнить `yarn build`
- Для создания или генерации миграции необходимо написать путь *src/db/migrations/migration-name*
- Для упрощенного создания/генерации миграции можно запускать `yarn generate-migration name` `yarn create-migration name`

## WSL
Если используется WSL, то необходимо
- Установить Docker на WSL
- Запустить Docker `sudo service docker start`
- Если возникает ошибка с *Permission Denied*, нужно ввести `sudo chmod 666 /var/run/docker.sock`