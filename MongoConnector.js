const Account = require("./types/Account");
const { MongoClient } = require("mongodb");
const Logger = require("hyarcade-logger");

class MongoConnector {

  /**
   *
   * @type {MongoClient}
   * @memberof MongoConnector
   */
  client;

  accounts;

  constructor(url) {
    this.client = new MongoClient(url);
  }

  async connect() {
    await this.client.connect();
    
    this.database = this.client.db("hyarcade");
    this.accounts = this.database.collection("accounts");
  }

  async getAccount (name, uuid, discordID) {
    return await this.accounts.findOne({ name, uuid, discordID });
  }

  /**
   *
   *
   * @param {Account[]} accs
   * @memberof MongoConnector
   */
  async setAccounts (accs) {
    const result = await this.accounts.insertMany(accs);

    Logger.log(`${result.insertedCount} docs inserted`);
  }
}

module.exports = MongoConnector;