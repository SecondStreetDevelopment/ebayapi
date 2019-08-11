// import { Fulfillment } from './sell/fulfillment';
import axios from 'axios';
// import axios = require('axios');
// import base64js = require("base64-js");
import base64 = require('base-64');
import encodeUrl = require('encodeurl');

// ('use strict');

class EbayAPI {
  protected redirectURI = '';
  protected scope = '';
  protected accessToken = '';
  protected refreshToken = '';

  // public fulfillment: Fulfillment;

  constructor(public clientID: string, public clientSecret: string) {
    // this.fulfillment = new Fulfillment(clientID, clientSecret);

    // this.clientID = clientID;
    // this.clientSecret = clientSecret;
  }

  generateAccessToken(code: string, redirectURI: string, scope: string) {
    this.redirectURI = redirectURI;
    this.scope = scope;

    //TODO:API Call
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
      .then(function(this: EbayAPI, response: any) {
        console.log('response ', response);

        //TODO:Save values
        this.accessToken = response.accessToken;
        console.log('TCL: EbayAPI -> generateAccessToken -> this.accessToken', this.accessToken);
        this.refreshToken = response.refresh_token;
        console.log('TCL: EbayAPI -> generateAccessToken -> this.refreshToken', this.refreshToken);
      })
      .catch(function(error) {
        console.log('error ', error);
      });
  }

  renewAccessToken() {
    axios
      .post(
        'https://api.ebay.com/identity/v1/oauth2/token',
        {},
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: encodeUrl(this.refreshToken), //TODO: Add url encoding
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + base64.encode(this.clientID + ':' + this.clientSecret),
          },
        },
      )
      .then(function(this:EbayAPI, response: any) {
        console.log('response ', response);

        //TODO:Save values
        this.accessToken = response.access_token;
        console.log('TCL: EbayAPI -> renewAccessToken -> this.accessToken', this.accessToken);
      })
      .catch(function(error) {
        console.log('error ', error);
      });
  }

  // get fulfillment() {
  //   this.fulfillment.setAccessToken(this.accessToken);
  //   return this.fulfillment;
  // }
}

// module.exports = EbayAPI;
