/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable unicorn/no-array-method-this-argument */
const os = require("node:os");
const Config = require("hyarcade-config");
const Logger = require("hyarcade-logger");
const Guild = require("hyarcade-structures/Guild");
const { MongoClient, Collection } = require("mongodb");
const Account = require("./types/Account");

class DiscordObject {
  uuid = "";
  discordID = "";
}

class HackerObject {
  uuid = "";
}

class BannedObject {
  uuid = "";
}

class MongoConnector {
  /**
   * @type {MongoClient}
   */
  client;

  /**
   * @type {Collection<Account>}
   */
  accounts;

  /**
   * @type {Collection<Account>}
   */
  dailyAccounts;

  /**
   * @type {Collection<Account>}
   */
  weeklyAccounts;

  /**
   * @type {Collection<Account>}
   */
  monthlyAccounts;

  /**
   * @type {Collection<DiscordObject>}
   */
  discordList;

  /**
   * @type {Collection<Guild>}
   */
  guilds;

  /**
   * @type {Collection<HackerObject>}
   */
  hackerList;

  /**
   * @type {Collection<BannedObject>}
   */
  bannedList;

  /**
   * Creates an instance of MongoConnector.
   *
   * @param {*} url
   * @memberof MongoConnector
   */
  constructor(url) {
    this.client = new MongoClient(url);
  }

  async connect(index = true) {
    await this.client.connect();

    this.database = this.client.db("hyarcade");

    this.accounts = this.database.collection("accounts");

    this.dailyAccounts = this.database.collection("dailyAccounts");

    this.weeklyAccounts = this.database.collection("weeklyAccounts");

    this.monthlyAccounts = this.database.collection("monthlyAccounts");

    this.discordList = this.database.collection("discordList");

    this.hackerList = this.database.collection("hackerlist");
    this.bannedList = this.database.collection("banlist");

    this.guilds = this.database.collection("guilds");

    if (index) {
      await this.accounts.createIndex({ uuid: 1 });
      await this.dailyAccounts.createIndex({ uuid: 1 });
      await this.weeklyAccounts.createIndex({ uuid: 1 });
      await this.monthlyAccounts.createIndex({ uuid: 1 });
      await this.discordList.createIndex({ discordID: 1 });
    }
  }

  async readCollection(collection) {
    if (this[collection] == undefined) {
      // Exit if query will throw an error
      return;
    }

    return await this[collection].find().toArray();
  }

  async snapshotAccounts(time) {
    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return;
    }

    Logger.info(`Snapshotting to "${realTime}Accounts" collection`);

    const cursor = this.accounts.find();

    /** @type {Collection} */
    const newCollection = this[`${realTime}Accounts`];

    await cursor.forEach(async account => {
      await newCollection.replaceOne({ uuid: account.uuid }, account, { upsert: true });
    });

    Logger.info("Snapshot process completed");
  }

  async getAccount(input) {
    if (input.length == 32 || input.length == 36) {
      return await this.accounts.findOne({ uuid: input });
    } else if (input.length == 18) {
      const resolvedDiscord = await this.discordList.findOne({ discordID: input });
      return await this.accounts.findOne({ uuid: resolvedDiscord.uuid });
    } else {
      return await this.accounts.findOne({ name_lower: input.toLowerCase() });
    }
  }

  async getTimedAccount(uuid, time) {
    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return;
    }

    return await this[`${realTime}Accounts`].findOne({ uuid });
  }

  async getGuild(guildID) {
    return await this.guilds.findOne({ uuid: guildID });
  }

  async getGuildByMember(memberUUID) {
    return await this.guilds.findOne({ memberUUIDs: { $elemMatch: memberUUID } });
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateAccounts(accs) {
    for (const acc of accs) {
      await this.accounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateDaily(accs) {
    for (const acc of accs) {
      await this.dailyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateWeekly(accs) {
    for (const acc of accs) {
      await this.weeklyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateMonthly(accs) {
    for (const acc of accs) {
      await this.monthlyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  async updateAccount(acc) {
    await this.accounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
  }

  async getLeaderboard(stat, reverse = false, limit = 10) {
    const options = {
      sort: {
        [stat]: reverse ? 1 : -1,
      },
      projection: {
        _id: 0,
        uuid: 1,
        name: 1,
        rank: 1,
        plusColor: 1,
        banned: 1,
        hacker: 1,
        importance: 1,
        mvpColor: 1,
        [stat]: 1,
      },
      limit,
    };

    return await this.accounts.find({}, options).toArray();
  }

  async getHistoricalLeaderboard(stat, time, reverse = false, limit = 10) {
    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return [];
    }

    const pipeline = [];

    const lookup = {
      from: this[`${realTime}Accounts`].collectionName,
      let: { uuid: "$uuid" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$uuid", "$$uuid"] },
          },
        },
        { $project: { [stat]: 1, _id: 0, uuid: 1 } },
      ],
      as: "historicalData",
    };
    pipeline.push({ $lookup: lookup });

    const match = {
      $match: { historicalData: { $size: 1 } },
    };

    pipeline.push(match);

    const project = {
      _id: 0,
      uuid: 1,
      name: 1,
      rank: 1,
      banned: 1,
      hacker: 1,
      importance: 1,
      plusColor: 1,
      mvpColor: 1,
      historicalData: 1,
      [stat]: 1,
      lbProp: {
        $subtract: [
          `$${stat}`,
          {
            $reduce: {
              input: "$historicalData",
              initialValue: 0,
              in: { $max: ["$$value", `$$this.${stat}`] },
            },
          },
        ],
      },
    };
    pipeline.push({ $project: project });

    const sort = { lbProp: reverse ? 1 : -1 };
    pipeline.push({ $sort: sort }, { $limit: limit });

    const historical = await this.accounts.aggregate(pipeline).toArray();

    return historical;
  }

  async getMiniWallsLeaderboard(stat, limit) {
    const options = {
      sort: {
        [stat]: -1,
      },
      projection: {
        _id: 0,
        uuid: 1,
        name: 1,
        rank: 1,
        plusColor: 1,
        banned: 1,
        hacker: 1,
        importance: 1,
        mvpColor: 1,
        [stat]: 1,
        miniWalls: 1,
      },
      limit,
    };

    const hackerArr = await this.hackerList.find().toArray();
    let hackers = hackerArr.map(h => h.uuid);

    const query = { uuid: { $nin: hackers } };

    return await this.accounts.find(query, options).toArray();
  }

  async getHistoricalMiniWallsLeaderboard(stat, time, limit = 10) {
    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    const hackerArr = await this.hackerList.find().toArray();
    let hackers = hackerArr.map(h => h.uuid);

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return [];
    }

    const pipeline = [];

    const lookup = {
      from: this[`${realTime}Accounts`].collectionName,
      let: { uuid: "$uuid" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$uuid", "$$uuid"] },
          },
        },
        { $project: { [stat]: 1, _id: 0, uuid: 1 } },
      ],
      as: "historicalData",
    };
    pipeline.push({ $lookup: lookup });

    const match = {
      $match: { historicalData: { $size: 1 }, uuid: { $nin: hackers } },
    };

    pipeline.push(match);

    const project = {
      _id: 0,
      uuid: 1,
      name: 1,
      rank: 1,
      banned: 1,
      hacker: 1,
      importance: 1,
      plusColor: 1,
      mvpColor: 1,
      historicalData: 1,
      [stat]: 1,
      miniWalls: 1,
      lbProp: {
        $subtract: [
          `$${stat}`,
          {
            $reduce: {
              input: "$historicalData",
              initialValue: 0,
              in: { $max: ["$$value", `$$this.${stat}`] },
            },
          },
        ],
      },
    };
    pipeline.push({ $project: project });

    const sort = { lbProp: -1 };
    pipeline.push({ $sort: sort }, { $limit: limit });

    const historical = await this.accounts.aggregate(pipeline).toArray();

    return historical;
  }

  async getImportantAccounts(level = 0) {
    const cfg = Config.fromJSON();

    const opts = {
      projection: {
        _id: 0,
        uuid: 1,
      },
    };

    if (level == 0) {
      return await this.accounts
        .find(
          {
            $or: [{ importance: { $gte: cfg.hypixel.importanceLimit } }, { discordID: { $exists: true } }],
            lastLogin: { $gte: Date.now() - cfg.hypixel.loginLimit },
          },
          opts,
        )
        .toArray();
    } else if (level == 1) {
      return await this.accounts.find({ $or: [{ importance: { $gte: cfg.hypixel.importanceLimit } }, { discordID: { $exists: true } }] }, opts).toArray();
    } else if (level == 2) {
      return await this.accounts
        .find(
          {
            $or: [{ importance: { $gte: cfg.hypixel.minImportance } }, { discordID: { $exists: true } }, { updateTime: { $lte: Date.now() - cfg.hypixel.loginLimit * 8 } }],
          },
          opts,
        )
        .toArray();
    } else {
      return await this.accounts.find({}, opts).toArray();
    }
  }

  async getInfo() {
    return {
      accs: await this.accounts.estimatedDocumentCount(),
      guilds: await this.guilds.estimatedDocumentCount(),
      links: await this.discordList.estimatedDocumentCount(),
      mem: (os.totalmem() - os.freemem()) / 1024 / 1000,
    };
  }

  /**
   *
   *
   * @param {Guild} guild
   * @memberof MongoConnector
   */
  async updateGuild(guild) {
    this.guilds.replaceOne({ uuid: guild.uuid }, guild, { upsert: true });
  }

  async linkDiscord(discordID, uuid) {
    await this.discordList.replaceOne({ discordID }, { discordID, uuid }, { upsert: true });
  }

  async unlinkDiscord(input) {
    await (input.length == 18 ? this.discordList.deleteOne({ discordID: input }) : this.discordList.deleteOne({ uuid: input }));
  }

  async addHacker(uuid) {
    await this.hackerList.replaceOne({ uuid }, { uuid }, { upsert: true });
  }

  async deleteHacker(uuid) {
    await this.hackerList.deleteOne({ uuid });
  }

  async addBanned(uuid) {
    await this.bannedList.replaceOne({ uuid }, { uuid }, { upsert: true });
  }

  async deleteBanned(uuid) {
    await this.bannedList.deleteOne({ uuid });
  }

  async destroy() {
    await this.client.close();
  }
}

module.exports = MongoConnector;
