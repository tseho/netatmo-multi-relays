# netatmo-multi-relays

## How to use

Create an account and a Netatmo App on [https://dev.netatmo.com/](https://dev.netatmo.com/).

Then, configure your environment variables with the Netatmo credentials.

#### Run with docker:
```
docker run --rm -t -e NMR_CLIENT_ID -e NMR_CLIENT_SECRET -e NMR_USERNAME -e NMR_PASSWORD tseho/netatmo-multi-relays
```

#### Run directly:
```
npm install
npm run build
npm run start
```

#### Environment variables

- NMR_CLIENT_ID: Netatmo App client ID
- NMR_CLIENT_SECRET: Netatmo App client secret
- NMR_USERNAME: Netatmo username
- NMR_PASSWORD: Netatmo password
- NMR_UPDATE_INTERVAL: Interval between updates, in seconds. (default: 600)
- NMR_DIFF_THRESHOLD: Temp difference tolerated before starting the boiler, in C°. (defaut: 0.5)


## Build for docker

```
DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --platform linux/amd64,linux/arm/v7 -t tseho/netatmo-multi-relays:latest . --push
DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --platform linux/amd64,linux/arm/v7 -t tseho/netatmo-multi-relays:X.X.X . --push
```
note: If `linux/arm/v7` is not available, [you can build on a raspberry pi](https://github.com/docker/buildx/issues/151).
