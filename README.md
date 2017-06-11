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

At image building, the content is copied from the subfolder `content/` to the `/var/www/html/` container's folder. Then the containers run from this image will provide an HTTP server on port 80 and display a copy of the "Stylish Portfolio" template you can find on [startbootstrap.com](https://startbootstrap.com/template-overviews/stylish-portfolio/)

## Instructions
1. Build the Docker image `docker build -t res/apache_php docker-images/apache-php-image/`
2. Run a container from this image `docker run -d res/apache_php` (the `-d` option runs the container in background mode)
3. You can now access to the webpages provided by the server at the container's IP address (use `docker inspect <container name> | grep -i ipaddress` to find the IP address)

# Step 2: Dynamic HTTP server with express.js
In this second step (`fb-express-dynamic` branch) a simple Javascript application using the Express.js framework is packaged in a new Docker image. Listening on port 3000, it returns a JSON array of 0-10 random locations.

The new image is available in the `docker-images/express-image/` folder and is built from the official Node.js 4.4 image you can find [on DockerHub](https://hub.docker.com/_/node/).

At image building, the script (and its dependancies) are copied from the `src/` to the `/opt/app/` container's folder. When the container is run, the commande `node /opt/app/index.js` is executed.

The code in `index.js` is quite simple, the script listens on port 3000 and returns a random number [0,10] of random US cities and states in JSON format.

## Instructions
1. Build the Docker image `docker build -t res/express_dynamic docker-images/express-image/`
2. Run a container from this image `docker run -d res/express_dynamic` (the `-d` option runs the container in background mode)
3. You can now access to the webpages provided by the server at the container's IP address on port 3000 (use `docker inspect <container name> | grep -i ipaddress` to find the IP address) [http://<container's ip>:3000/](http://<container's ip>:3000/)

# Step 3: Reverse proxy with apache (static configuration)
In this step we add a reverse proxy to route the traffic to ither the static Apache server or the dynamic Node.js server, depending on the URL provided on port 80 (`/` will route to apache and `/api/students/` to the Node.js server). This organization is mandatory to execute some AJAX requests (in future steps). Indeed, for safety reasons, an AJAX request can be executed exclusively to a same domain location. The reverse proxy will then act as the single domain and shadow the fact that two different server are communicating. This step is available on the branch `fb-apache-reverse-proxy`.

Many applications can act as a reverse proxy, here Apache is used. Once again, the server is packaged in a Docker image, based as previously on the official Apache2 + PHP5.6 image and located in the `docker-images/apache-reverse-proxy/` folder. At image building, the content of the `conf/` subfolder is copied to the `/etc/apache2` folder.

This subfolder contains the configuration for the apache default site `000-default.conf` used to block connections made directly to the server without using the domain `demo.res.ch`. A second site, `001-reverse-proxy.conf` will redirect the traffic coming along via `demo.res.ch` either on the __hardcoded__ `http://172.17.0.2:80/` url (when `/` is asked) or `http://172.17.0.3:3000/` (when `/api/students/` asked).

## Instructions
1. Be sure the static server runs under `172.17.0.2` and the dynamic under `172.17.0.3` IPs.
1. Build the Docker image `docker build -t res/apache_rp  docker-images/apache-reverse-proxy/`
2. Run a container from this image `docker run -d res/apache_rp` (the `-d` option runs the container in background mode)
3. Add the following line to your hosts file (location depend on the OS) : `<reverse proxy container's ip> demo.res.ch` to access the reverse proxy through the domain
3. You can now access to [http://demo.res.ch/](http://demo.res.ch/) for static content and [http://demo.res.ch/api/students/](http://demo.res.ch/api/students/) for dynamic content.

# Step 4: AJAX requests with JQuery
In this step (on branch `fb-ajax-jquery`) a line of dynamic content is added to the webpage displayed on the Apache server. The content is fetched from the dynamic server using AJAX.

To reach the goal, a script called `location.js` has been created in `docker-images/apache-php-image/content/js/` and the file `docker-images/apache-php-image/content/index.html` has been modified to add a `h2` HTML markup.

## Instructions
Follow instructions from the precedent steps to rebuilt Docker images from the Step 4 branch and run the containers.

Tip : use `docker rm $(docker ps -a -q)` to remove the previously built images.
