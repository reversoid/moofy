FROM jwilder/nginx-proxy
RUN { \
    echo 'client_max_body_size 10m;'; \
    echo 'proxy_busy_buffers_size   512k;'; \
    echo 'proxy_buffers   4 512k;'; \
    echo 'proxy_buffer_size   256k;'; \
    } > /etc/nginx/conf.d/my_proxy.conf