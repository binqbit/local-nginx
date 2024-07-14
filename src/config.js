const fs = require("fs");
const { exec } = require('child_process');
const path = require("path");


const CONFIG_NGINX = "nginx.conf";
const CONFIG_DOCKERFILE = "Dockerfile.nginx";
const CONFIG_DOCKERCOMPOSE = "docker-compose.yml";

const CONTAINER_PATH = path.resolve(process.argv[0], "..", "local-nginx");

function stopNginxContainer() {
    exec(`docker compose -f "${path.resolve(CONTAINER_PATH, CONFIG_DOCKERCOMPOSE)}" down`, (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log("Stopped existing nginx container.");
    });
}

function startNginxContainer() {
    exec(`docker compose -f "${path.resolve(CONTAINER_PATH, CONFIG_DOCKERCOMPOSE)}" up -d --build`, (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log('Started nginx container.');
    });
}

function writeNginxConfig(name, content) {
    fs.writeFileSync(path.resolve(CONTAINER_PATH, name), content);
}

function setNginxConfig(nginx, ports) {
    if (!fs.existsSync(CONTAINER_PATH)) {
        fs.mkdirSync(CONTAINER_PATH);
    }

    writeNginxConfig(CONFIG_NGINX, nginx);
    
    writeNginxConfig(CONFIG_DOCKERFILE, `
FROM ubuntu:latest

RUN apt-get update && apt-get install -y nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE ${ports.join(" ")}

CMD ["nginx", "-g", "daemon off;"]
    `);

    writeNginxConfig(CONFIG_DOCKERCOMPOSE, `
version: "3"

services:
  nginx:
    container_name: nginx
    build:
      context: ./
      dockerfile: Dockerfile.nginx
    ports:
      - ${ports.map(p => `${p}:${p}`).join("\n      - ")}
`);
}

module.exports = {
    CONFIG_NGINX,
    CONFIG_DOCKERFILE,
    CONFIG_DOCKERCOMPOSE,
    stopNginxContainer,
    startNginxContainer,
    writeNginxConfig,
    setNginxConfig,
};