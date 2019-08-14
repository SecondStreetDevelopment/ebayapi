import { Fulfillment } from './sell/fulfillment';
import axios from 'axios';
import base64 = require('base-64');
const { encode } = require('url-encode-decode');

// Temp comment

export class EbayAPI {
  protected redirectURI = '';
  protected scope = '';
  protected accessToken = '';
  protected refreshToken = '';

  public fulfillment: Fulfillment;

  constructor(public clientID: string, public clientSecret: string) {
    this.fulfillment = new Fulfillment(clientID, clientSecret);
  }

  generateAccessToken(code: string, redirectURI: string, scope: string) {
    this.redirectURI = redirectURI;
    this.scope = scope;

    console.log('clientID ', this.clientID);
    console.log('clientSecret ', this.clientSecret);
    console.log('base64 encoded auth ' + base64.encode(this.clientID + ':' + this.clientSecret));
    axios
      .post(
        'https://api.ebay.com/identity/v1/oauth2/token',
        {},
        {
          params: {
            grant_type: 'authorization_code',
            redirect_uri: redirectURI,
            code: code,
            scope: scope,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + base64.encode(this.clientID + ':' + this.clientSecret),
          },
        },
      )
      .then((response: any) => {
        console.log('response ', response);

        //Save values
        this.accessToken = response.accessToken;
        console.log('TCL: EbayAPI -> generateAccessToken -> this.accessToken', this.accessToken);
        this.refreshToken = response.refresh_token;
        console.log('TCL: EbayAPI -> generateAccessToken -> this.refreshToken', this.refreshToken);
      })
      .catch(function(error) {
        console.log('error ', error);
      });
  }

  renewAccessToken(refreshToken: string): Promise<string> {
    this.refreshToken = refreshToken;

    return axios
      .post(
        'https://api.ebay.com/identity/v1/oauth2/token',
        {},
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + base64.encode(this.clientID + ':' + this.clientSecret),
          },
        },
      )
      .then((response: any) => {
        console.log('response ', response);

        //Save values
        this.accessToken = response.data.access_token;
        console.log('TCL: EbayAPI -> renewAccessToken -> this.accessToken', this.accessToken);
        return this.accessToken;
      })
      .catch(function(this: any, error) {
        console.log('error ', error);
        return this.accessToken;
      });
  }

  async validAccessToken(accessToken: string): Promise<boolean> {
    this.accessToken = accessToken;
    return await axios
      .get(`https://api.ebay.com/sell/fulfillment/v1/order?limit=1`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + this.accessToken,
        },
      })
      .then(response => {
        return true;
      })
      .catch(error => {
        // console.log('TCL: error', error);
        return false;
      });
  }

  getAccessToken(): string {
    return this.accessToken;
  }
}
