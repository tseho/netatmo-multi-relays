import logger from "./logger";
import { requestNewAccessTokens } from "./providers/oauth";

const express = require('express');
const app = express();
const PORT: number = 3000;
const REDIRECT_URI: string = process.env.NMR_REDIRECT_URI || 'http://localhost:3000/callback';
const STATE: string = 'bring_back_client_credentials';

const REQUIRED_ENV_VARIABLES = [
  'NMR_CLIENT_ID',
  'NMR_CLIENT_SECRET',
];

for (let key of REQUIRED_ENV_VARIABLES) {
  if (process.env[key] === undefined) {
    logger.error('The env variable ' + key + ' is required');
  }
}

const CLIENT_ID = process.env.NMR_CLIENT_ID;
const CLIENT_SECRET = process.env.NMR_CLIENT_SECRET;

app.get('/', (req, res) => {
  res.redirect(`https://api.netatmo.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read_thermostat write_thermostat&state=${STATE}`);
});

app.get('/callback', async (req, res) => {
  if (req.query.state !== STATE) {
    res.send('Invalid state');
    return;
  }

  await requestNewAccessTokens({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }, req.query.code);

  res.send('Token stored!');
});

app.listen(PORT, () => {
  logger.info(`Netatmo OAuth client listening on port ${PORT}`);
});
