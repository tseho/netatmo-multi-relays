# netatmo-multi-relays

When you have multiple Netatmo Relays in the same home, they are not talking to each other through the feature
"COMFORT Priority mode" where additional Smart Radiator Valves can ask for heating.
Only Smart Radiator Valves on the same Relay as the Thermostat are allowed to do this.
This application check regularly if Smart Radiator Valves on other Relays are requesting heating and will force
the main Thermostat to start the boiler.

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


## Publish for docker

```
make publish
RELEASE=X.X.X make publish
```

note: If `linux/arm/v7` is not available, [you can build on a raspberry pi](https://github.com/docker/buildx/issues/151).

```
docker context create --docker "host=ssh://<user>@<ip>" raspberrypi
docker buildx create --name builder --platform linux/arm/v7 --append raspberrypi
docker buildx create --name builder --platform linux/amd64 --append default
docker buildx use builder
```
