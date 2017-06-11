```
Title   : HEIG-VD RES Lab HTTP Infrastructure
Author  : Guillaume Milani
Date    : June 11 2017
```
# Introduction
This repository contains a solution to the Lab "HTTP Infrastructure" taking place in the course RES at HEIG-VD.

The three objectives are the following :
1. Get familiar with software tools allowing to build a complete web infrastructure. The goal is to serve static and dynamic content to web browsers, using a reverse proxy to route data from an apache httpd server (static content) and fetch dynamic content from an express.js script.

2. Implement a simple web app that provide dynamic content in order to display it inside a static HTML webpage. Javascript allows us to fetch asynchronously new data from the dynamic server and display it inside a (previously) static webpage thanks to AJAX.

3. Practice the usage of Docker. The reverse proxy as well as the dynamic and static servers will be packaged in 3 different custom Docker images.

# Step 1 : Static HTTP server with Apache
In this step (present in the `fb-apache-static` branch) an Apache HTTP web server is set up to provide static web content.

The web server is packaged inside the Docker image you can find in the `docker-images/apache-php-image` folder. This image is based on the official Apache2 + PHP5.6 image you can find [on DockerHub](https://hub.docker.com/_/php/).

At image building, the content is copied from the subfolder `content/` to the container's folder `/var/www/html/`. Then the containers run from this image will provide an HTTP server on port 80 and display a copy of the "Stylish Portfolio" template you can find on [startbootstrap.com](https://startbootstrap.com/template-overviews/stylish-portfolio/)

## Instructions
1. Build the docker image `docker build -t res/apache_php docker-images/apache-php-image/`
2. Run a container from this image `docker run res/apache_php`
3. You can now access to the webpages provided by the server at the container's IP address (use `docker inspect <container name> | grep -i ipaddress` to find the IP address)
