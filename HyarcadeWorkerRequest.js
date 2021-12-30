const logger = require("hyarcade-logger");
const webRequest = require("./webRequest");
const cfg = require("hyarcade-config").fromJSON();
const keys = cfg.altkeys.concat([cfg.clusters[cfg.cluster].key]);

let currentKey = 0;

/**
 * 
 * @returns {string}
 */
function getAPIKey () {
  const key = keys[currentKey];
  currentKey += 1;
  if(currentKey == keys.length) {
    currentKey = 0;
  }

  logger.verbose(`Using key : ${currentKey + 1} of ${keys.length} (${currentKey.toString().slice(0, 16)})`);

  return key;
}

class Response {
  key = {};
  data = [];
}

/**
 * 
 * @param {string} uuids 
 * @returns {Promise<Response>}
 */
async function HyarcadeWorkerRequest (uuids) {

  const accs = {};
  
  let acc;

  for(let i = 0;i < uuids.length;i += 1) {
    const uuid = uuids[i];
    acc = await webRequest(`https://api.hypixel.net/player?key=${getAPIKey()}&uuid=${uuid.trim()}`);

    try {
      accs[uuid.trim()] = JSON.parse(acc.data);
    } catch (e) {
      console.log(acc.data);
      console.log(acc.headers);
      i -= 1;
    }
  }

  return { data: accs, key: { limit: acc.headers["ratelimit-limit"], remaining: acc.headers["ratelimit-remaining"], reset: acc.headers["ratelimit-reset"] } };
}

module.exports = HyarcadeWorkerRequest;