import axios from "axios";
// import base64js = require("base64-js");
import base64 = require("base-64");

("use strict");

export class Fulfillment {
  accessToken: string = "";

  constructor(public clientID: string, public clientSecret: string) {
    // this.clientID = clientID;
    // this.clientSecret = clientSecret;
  }

  setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
  }

  getOrder(orderID: string) {}

  getOrders(filter: string, limit: string, offset: string) {}
}

// module.exports = Fulfillment;
