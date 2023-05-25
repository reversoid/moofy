FROM nginx:1.23.4

# Копируем MIME-типы
COPY mime.types /etc/nginx/mime.types
# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx

# Указываем порт, на котором будет работать nginx
EXPOSE 4444

# Команда для запуска nginx при запуске контейнера
CMD ["nginx", "-g", "daemon off;"]
