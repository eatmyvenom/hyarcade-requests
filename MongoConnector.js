const Account = require("./types/Account");
const { MongoClient, Collection } = require("mongodb");

class MongoConnector {

  /**
   *
   * @type {MongoClient}
   * @memberof MongoConnector
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

  constructor(url) {
    this.client = new MongoClient(url);
  }

  async connect() {
    await this.client.connect();

    this.database = this.client.db("hyarcade");

    this.accounts = this.database.collection("accounts");
    this.accounts.createIndex({ uuid: 1 });

    this.dailyAccounts = this.database.collection("dailyAccounts");
    this.dailyAccounts.createIndex({ uuid: 1 });

    this.weeklyAccounts = this.database.collection("weeklyAccounts");
    this.weeklyAccounts.createIndex({ uuid: 1 });

    this.monthlyAccounts = this.database.collection("monthlyAccounts");
    this.monthlyAccounts.createIndex({ uuid: 1 });

  }

  async getAccount (uuid) {
    return await this.accounts.findOne({ uuid });
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateAccounts (accs) {
    for(const acc of accs) {
      this.accounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateDaily (accs) {
    for(const acc of accs) {
      this.dailyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateWeekly (accs) {
    for(const acc of accs) {
      this.weeklyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async updateMonthly (accs) {
    for(const acc of accs) {
      this.monthlyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  async updateAccount (acc) {
    this.accounts.replaceOne({ uuid: acc.uuid }, acc, { upsert : true });
  }

  async getLeaderboard (stat, reverse = false, limit = 10, filter = false) {
    const options = {
      limit,
      sort: {
        [stat] : reverse ? 1 : -1
      },
      projection : {
        uuid: 1,
        name: 1,
        rank: 1,
        plusColor: 1,
        banned: 1,
        hacker: 1,
        importance: 1,
        mvpColor: 1,
        [stat]: 1,
      }
    };

    const query = {};


    if(filter) {
      for(const field of filter) {
        query[field] = { $exists: false };
      }
    }

    return await this.accounts.find(query, options).toArray();
  }

  async getHistoricalLeaderboard (stat, time, reverse = false, limit = 10) {
    if(this[`${time}Accounts`] == undefined) {
      return [];
    }

    const historical = await this.accounts.aggregate([
      {
        $lookup: {
          from: this[`${time}Accounts`].collectionName,
          let: { uuid : "$uuid" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [ "$uuid", "$$uuid" ] }
              },
            },
            { project: { [stat]: 1, _id: 0, uuid: 1 } }
          ],
          as: "historicalData"
        }
      },
      {
        $project: {
          _id: 0,
          uuid: 1,
          name: 1,
          rank: 1,
          banned: 1,
          hacker: 1,
          importance: 1,
          plusColor: 1,
          mvpColor: 1,
          lbProp: {
            $subtract: [{ toInt: `$${stat}` }, {
              $reduce: {
                input: "$historicalData",
                initialValue: 0,
                in: { $max: ["$$value", `$$this.${stat}`] }
              }
            }]
          }
        }
      }
    ])
      .sort({ [stat] : reverse ? 1 : -1 })
      .limit(limit)
      .toArray();

    return historical;
  }

  async destroy() {
    await this.client.close();
  }
}

module.exports = MongoConnector;