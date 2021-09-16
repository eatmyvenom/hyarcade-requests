const https = require("https");
const logger = require("hyarcade-logger");
const cfg = require("hyarcade-config").fromJSON();
const keys = cfg.altkeys;

let currentKey = 0;

/**
 * 
 * @returns {string}
 */
function getAPIKey () {
  logger.debug(`Using key : ${currentKey + 1} of ${keys.length}`);
  const key = keys[currentKey];
  currentKey += 1;
  if(currentKey == keys.length) {
    currentKey = 0;
  }

  return key;
}

class Response {
  key = {};
  data = [];
}

/**
 * 
 * @param {string[]} accs 
 * @returns {Promise<Response>}
 */
async function HyarcadeWorkerRequest (accs) {
  return new Promise((resolve, reject) => {

    const url = `https://hyarcade-worker.vnmm.workers.dev?pass=${cfg.dbPass}`;

    const reqOptions = {
      family: 4,
      port: 443,
      protocol: "https:",
      headers: {
        apikey: getAPIKey(),
        accs,
      }
    };

    try {
      https.get(url, reqOptions, (res) => {
        let reply = "";
        res.on("data", (d) => {
          reply += d;
        });
        res.on("end", () => {
          let response;

          try {
            response = JSON.parse(reply);
          } catch (e) {
            reject(e);
          }

          resolve(response);
        });
        res.on("error", (err) => {
          reject(err);
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = HyarcadeWorkerRequest;