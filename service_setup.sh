#!/bin/sh

if [ ! $(docker ps --filter "name=dev-PA-webapps" --format "{{.ID}}") ];
then
    if [ ! $(docker ps -a --filter "name=dev-PA-webapps" --format "{{.ID}}") ];
    then
        echo "no dev-PA-webapps image/container, creating...\n"
        docker build --build-arg APP_ENV=staging -t skydu/paytrenacademy-webapps:httpd-2.4 .
        docker container run -d --rm --name dev-PA-webapps -p 80:80 -v $1:/usr/local/apache2/htdocs skydu/paytrenacademy-webapps:httpd-2.4
    else
        echo "dev-PA-webapps image/container is there but stopped, starting...\n"
        docker container start dev-PA-webapps
    fi
else
    echo "dev-PA-webapps is already running...\n"
fi