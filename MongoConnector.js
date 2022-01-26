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

  constructor(url) {
    this.client = new MongoClient(url);
  }

  async connect() {
    await this.client.connect();
    
    this.database = this.client.db("hyarcade");
    this.accounts = this.database.collection("accounts");
    this.accounts.createIndex({ uuid: 1 });
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

  async updateAccount (acc) {
    this.accounts.replaceOne({ uuid: acc.uuid }, acc, { upsert : true });
  }

  async getLeaderboard (stat, min, reverse, limit, filter) {
    const options = {
      limit,
      sort: {
        [stat] : reverse ? 1 : -1
      },
    };

    const query = {};

    if(min) {
      options.projection = {
        uuid: 1,
        name: 1,
        rank: 1,
        plusColor: 1,
        mvpColor: 1,
        [stat]: 1,
      };
    }

    if(filter) {
      for(const field of filter) {
        query[field] = { $exists: false };
      }
    }

    return await this.accounts.find(query, options).toArray();
  }

  async destroy() {
    await this.client.close();
  }
}

module.exports = MongoConnector;