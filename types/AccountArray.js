const Account = require("./Account");

/**
 * 
 * @param {object[]} accounts 
 * @returns {Account[]}
 */
function AccountArray (accounts) {
  return accounts.map((v) => Account.from(v));
}

module.exports = AccountArray;