# netatmo-multi-relays

When you have multiple Netatmo Relays in the same home, they are not talking to each other through the feature
"COMFORT Priority mode" where additional Smart Radiator Valves can ask for heating.
Only Smart Radiator Valves on the same Relay as the Thermostat are allowed to do this.
This application check regularly if Smart Radiator Valves on other Relays are requesting heating and will force
the main Thermostat to start the boiler.

## How to use

1) Create an account and a Netatmo App on [https://dev.netatmo.com/](https://dev.netatmo.com/).
2) Configure the environment variables with your Netatmo credentials.
   ```
   export NMR_CLIENT_ID=xxx
   export NMR_CLIENT_SECRET=xxx
   ```
3) Launch the application
   - with docker:
   ```
   docker run --rm -t -e NMR_CLIENT_ID -e NMR_CLIENT_SECRET -p 3000:3000 tseho/netatmo-multi-relays
   ```
   - with npm:
   ```
   npm install
   npm run build
   npm run start
   ```
4) Open http://localhost:3000 to authorize the application.
5) Check the logs.

#### Environment variables

The following environment variables are used by the application, you can override their default values if needed.

- NMR_CLIENT_ID: Netatmo App client ID
- NMR_CLIENT_SECRET: Netatmo App client secret
- NMR_REDIRECT_URI: URL used during OAuth redirection (default: http://localhost:3000/callback)
- NMR_UPDATE_INTERVAL: Interval between updates, in seconds. (default: 600)
- NMR_DIFF_THRESHOLD: Temp difference tolerated before starting the boiler, in C°. (defaut: 0.5)

## Publish on dockerhub

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
