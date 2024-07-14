# Local Nginx

## Description
A simple tool to run a local nginx server with a custom configuration file.

## Usage
- Build the local-nginx binary
```shell
yarn build
```

- Run the new nginx configuration
```shell
local-nginx ./nginx.conf
```

- Stop the nginx server
```shell
local-nginx stop
```

- Start the nginx server
```shell
local-nginx start
```

## How it works?
This tool copies the Nginx configuration, adjusts some routes for the local system, and simulates the configuration on local ports. It creates a fully functional Nginx server that works similarly to a regular Nginx server, handling as many ports as specified in the configuration. However, it operates with external ports instead of running inside a Docker container. Additionally, it modifies certain parameters, such as SSH and configurations requiring encryption keys, to ensure they are disabled for proper functionality in a testing environment.