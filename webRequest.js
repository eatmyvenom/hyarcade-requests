const https = require("https");
const http = require("http");
const Logger = require("hyarcade-logger");

class webResponse {
    data = "";
    headers = [];
    status = 200;
    /**
     * Creates an instance of webResponse.
     *
     * @param {string} data the raw data recived from the server
     * @param {object[]} headers the http response headers
     * @param {number} status the status code
     * @memberof webResponse
     */
    constructor (data, headers, status) {
      this.data = data;
      this.headers = headers;
      this.status = status;
    }
}

/**
 * Send a get request and return response as a promise
 *
 * @param {string} url The url to send the request to
 * @returns {webResponse} The webresponse object
 */
function sendRequest (url) {
  return new Promise((resolve, reject) => {
    let protocolObj = http;
    let method = "http:";
    if(url.startsWith("https")) {
      protocolObj = https;
      method = "https:";
    }

    const reqOptions = {
      family: 4,
      port: method == "http:" ? 80 : 443,
      protocol: method,
    };

    try {
      const requester = protocolObj.get(url, reqOptions, (res) => {
        let reply = "";
        res.on("data", (d) => {
          reply += d;
        });
        res.on("end", () => {
          resolve(new webResponse(reply, res.headers, res.statusCode));
        });
        res.on("error", (err) => {
          Logger.err(err);
          reject(err);
        });
      });

      requester.socket.on("error", Logger.err);
      requester.on("error", Logger.err);
    } catch (e) {
      Logger.err(e);
      Logger.err(`Web request to ${url} caused an error, resending!`);
      return sendRequest(url);
    }
  });
}

module.exports = async function webRequest (url) {
  try {
    return await sendRequest(url);
  } catch (e) {
    Logger.err(e);
    Logger.err(`Web request to ${url} caused an error, resending!`);
  }
};
