const Config = require("hyarcade-config");
const cfg = Config.fromJSON();
const { parseChunked, stringifyStream } = require("@discoveryjs/json-ext");
const Logger = require("hyarcade-logger");
const http = require("http");
const https = require("https");
const webRequest = require("./webRequest");
const { default: fetch } = require("node-fetch");

/**
 * Read JSON data as a stream from a url
 * This is used as a stream due to the the string length limitations of nodejs/v8
 * 
 * 
 * @param {URL} url 
 */
function readJSONStream (url) {
  let reqModule;
  if(url.protocol == "https:") {
    reqModule = https;
  } else {
    reqModule = http;
  }

  return new Promise((resolve, rejects) => {
    reqModule.get(url, { headers: { Authorization: cfg.dbPass } }, (res) => {
      parseChunked(res)
        .then(resolve)
        .catch(rejects);
    });
  });
}

/**
 * Write JSON data as a stream to a url
 * This is used as a stream due to the the string length limitations of nodejs/v8
 * 
 * 
 * @param {URL} url 
 * @param {*} obj
 * @returns {Promise<any>}
 */
function writeJSONStream (url, obj) {
  let reqModule;
  if(url.protocol == "https:") {
    reqModule = https;
  } else {
    reqModule = http;
  }

  return new Promise((resolve, reject) => {
    const req = reqModule.request(url, { headers: { Authorization: cfg.dbPass }, method: "POST" });
    
    stringifyStream(obj)
      .on("error", reject)
      .pipe(req)
      .on("error", reject)
      .on("finish", resolve);
  });
}

module.exports = class Database {
  static async readDB (file, fields) {
    let fileData;
    const url = new URL("db", cfg.dbUrl);
    const path = `${file}`;
    url.searchParams.set("path", path);

    if(fields != undefined) {
      url.searchParams.set("fields", fields.join(","));
    }

    Logger.debug(`Fetching ${url.searchParams.toString()} from database`);

    try {
      fileData = await readJSONStream(url);
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      return {};
    }
    Logger.debug("Data fetched!");
    return fileData;
  }

  static async writeDB (path, json) {
    const url = new URL("db", cfg.dbUrl);
    url.searchParams.set("path", path);
    Logger.debug(`Writing to ${path} in database`);

    await writeJSONStream(url, json);
  }

  static async account (text, discordID) {
    const url = new URL("account", cfg.dbUrl);

    if(text != undefined && text != "" && text != "!") {
      if(text.length < 17) {
        url.searchParams.set("ign", text);
      } else {
        url.searchParams.set("uuid", text.replace(/-/g, ""));
      }
    }

    if (discordID != undefined && discordID != "") {
      url.searchParams.set("discid", discordID);
    }

    let acc;
    try {
      Logger.debug(`Fetching ${url.searchParams} from database!`);
      acc = await JSON.parse((await webRequest(url)).data);
    } catch (e) {
      Logger.err("Error fetching data from database");
      Logger.err(e.stack);
      Logger.err(acc);
      return {};
    }

    return acc;
  }

  static async timedAccount (text, discordID, time) {
    const url = new URL("timeacc", cfg.dbUrl);

    if(text != undefined && text != "" && text != "!") {
      if(text.length < 17) {
        url.searchParams.set("ign", text);
      } else {
        url.searchParams.set("uuid", text.replace(/-/g, ""));
      }
    } 

    if(discordID != undefined && discordID != "") {
      url.searchParams.set("discid", discordID);
    }

    if(time != undefined && time != "lifetime" && time != "life") {
      url.searchParams.set("time", time);
    }

    let acc;
    try {
      Logger.debug(`Fetching ${url.searchParams} from database!`);
      acc = await JSON.parse((await webRequest(url)).data);
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(acc);
      return {};
    }

    return acc;
  }

  static async info () {
    const url = new URL("info", cfg.dbUrl);

    let info;
    try {
      info = await JSON.parse((await webRequest(url)).data);
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(info);
      return {};
    }

    return info;
  }

  static async addAccount (json) {
    const data = JSON.stringify(json);
    const url = new URL("account", cfg.dbUrl);
    Logger.info(`Adding ${data.name} to accounts in database`);

    try {
      await fetch(url.toString(), {
        method: "post",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.dbPass
        }
      });
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      return {};
    }
  }

  static async getLeaderboard (path, category, time, min, reverse, max) {
    Logger.verbose("Reading database");

    const url = new URL("lb", cfg.dbUrl);
    url.searchParams.set("path", path) ;
    
    if(category != undefined && category != "undefined") {
      url.searchParams.set("category", category);
    }

    if(time != undefined) {
      url.searchParams.set("time", time);
    }

    if(max != undefined) {
      url.searchParams.set("max", max);
    }

    if(min) {
      url.searchParams.set("min", "");
    }

    if(reverse) {
      url.searchParams.set("reverse", "");
    }

    let lb;

    Logger.debug(`Fetching ${time ?? "lifetime"} ${category ?? ""} ${path} leaderboard`);
    try {
      lb = await JSON.parse((await webRequest(url)).data);
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(lb);
      return {};
    }

    return lb;
  }

  static async getMWLeaderboard (stat, time) {
    Logger.info(`Fetching miniwalls ${stat} leaderboard from!`);

    const url = new URL("mwlb", cfg.dbUrl);
    url.searchParams.set("stat", stat);

    if(time != undefined) {
      url.searchParams.set("time", time);
    }

    let lb;

    try {
      lb = await JSON.parse((await webRequest(url)).data);
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(lb);
      return {};
    }

    return lb;
  }
};