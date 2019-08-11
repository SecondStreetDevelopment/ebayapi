import axios from 'axios';
// import base64js = require("base64-js");
import base64 = require('base-64');

('use strict');

export class Fulfillment {
  accessToken: string = '';

  constructor(public clientID: string, public clientSecret: string) {
    // this.clientID = clientID;
    // this.clientSecret = clientSecret;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getOrder(accessToken: string, orderID: string): any {
    this.accessToken = accessToken;
    return axios
      .get('https://api.ebay.com/sell/fulfillment/v1/order/' + orderID, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + this.accessToken,
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log('TCL: Fulfillment -> error', error);
        return error;
      });
  }

  getOrders(accessToken: string, filter?: string, limit: string = '200', offset: string = '0'): any {
    this.accessToken = accessToken;
    return axios
      .get(`https://api.ebay.com/sell/fulfillment/v1/order?limit=${limit}&offset=${offset}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + this.accessToken,
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log('TCL: Fulfillment -> error', error);
        return error;
      });
  }
}

// module.exports = Fulfillment;
