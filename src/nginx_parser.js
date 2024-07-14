
function getAllExternalPorts(nginxConfig) {
  const ports = [];
  const regex = /listen\s+([0-9]+)\s*;/g;
  let match;
  while ((match = regex.exec(nginxConfig)) !== null) {
    ports.push(parseInt(match[1]));
  }
  return [...new Set(ports)];
}

function replaceLocalhostToDockerHost(nginxConfig) {
    return nginxConfig.replace(/proxy_pass\s+http:\/\/localhost:/g, `proxy_pass http://host.docker.internal:`);
}

function removeSSL(nginxConfig) {
  return nginxConfig
    .replace(/ssl_.*;/g, "")
    .replace(/listen\s+443\s+ssl;/g, "listen 443;")
    .replace(/listen\s+\[::\]:443\s+ssl;/g, "listen [::]:443;")
    .replace(/return\s+301\s+https:\/\/\$host\$request_uri;/g, "return 301 http://$host:443$request_uri;");
}

function normalizeNginxConfig(nginxConfig) {
  return removeSSL(replaceLocalhostToDockerHost(nginxConfig))
    .replace(/listen\s+80;/g, "listen 8080;")
    .replace(/listen\s+\[::\]:80;/g, "listen [::]:8080;")
    .replace(/(\s*\n){3,}/g, "\n\n");
}

module.exports = {
  getAllExternalPorts,
  replaceLocalhostToDockerHost,
  removeSSL,
  normalizeNginxConfig,
};