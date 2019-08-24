#!/bin/bash

apt-get -y --no-install-recommends install sed
sed -i s/^max_execution_time.*/max_execution_time\ =\ 300/g /opt/bitnami/php/etc/php.ini


if [ -d "storage" ]; then
	chmod -Rf 777 storage/
fi

if [ -d "bootstrap/cache" ]; then
	chmod -Rf 777 bootstrap/cache/
fi

composer_file="composer.json"
if [ -f "$composer_file" ]; then
	if [ ! -d "vendor" ]; then
		composer update
	fi
fi

npm_file="package.json"
if [ -f "$npm_file" ]; then
	if [ ! -d "node_modules" ]; then
		npm install
	fi
fi

php-fpm -F --pid /opt/bitnami/php/tmp/php-fpm.pid -y /opt/bitnami/php/etc/php-fpm.conf &
nginx -c /etc/nginx/nginx.conf -g "daemon off;"
