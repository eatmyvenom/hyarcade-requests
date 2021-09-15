const https = require("https");
const cfg = require("hyarcade-config").fromJSON();
const keys = cfg.altkeys;

/**
 * 
 * @returns {string}
 */
function getAPIKey () {
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * 
 * @param {string[]} accs 
 * @returns {Promise<object[]>}
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