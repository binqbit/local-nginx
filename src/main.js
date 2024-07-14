const fs = require("fs");
const { getAllExternalPorts, normalizeNginxConfig } = require("./nginx_parser");
const { stopNginxContainer, startNginxContainer, setNginxConfig } = require("./config");

const NGINX_PATH = process.argv[2];

if (!NGINX_PATH) {
    console.error("Please provide path to nginx config");
    process.exit(1);
}

const nginx = normalizeNginxConfig(fs.readFileSync(NGINX_PATH, "utf8"));
const ports = getAllExternalPorts(nginx);

setNginxConfig(nginx, ports);
stopNginxContainer();
startNginxContainer();