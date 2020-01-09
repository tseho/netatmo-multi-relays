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
npm run build
npm run start
```

#### Environment variables

- NMR_CLIENT_ID: Netatmo App client ID
- NMR_CLIENT_SECRET: Netatmo App client secret
- NMR_USERNAME: Netatmo username
- NMR_PASSWORD: Netatmo password
- NMR_UPDATE_INTERVAL: Interval between updates, in seconds. (default: 600)
