/* eslint-disable no-prototype-builtins */
const Account = require("./Account");

/**
 * 
 * @param {Array} a 
 * @param {Function} key 
 * @returns {Array}
 */
function uniqBy (a, key) {
  const seen = {};
  return a.filter((item) => {
    const k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

/**
 * 
 * @param {object[]} accounts 
 * @returns {Account[]}
 */
function AccountArray (accounts) {
  const accs = accounts.map((v) => Account.from(v));
  return uniqBy(accs, (a) => a.uuid?.toLowerCase().replace(/-/g, ""));

}

module.exports = AccountArray;