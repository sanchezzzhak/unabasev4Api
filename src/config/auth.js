// import mainConfig from './main';

import dotenv from "dotenv";
dotenv.config();

export default {
  googleAuth: {
    clientID: process.env.google_client_id,
    clientSecret: process.env.google_client_secret,
    callbackURL: process.env.google_callback_url,
    endpoint: process.env.google_endpoint
  }
};
