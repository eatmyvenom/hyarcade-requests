const Account = require("./Account");

/**
 * 
 * @param {object} json 
 * @param {Account} account 
 */
module.exports = function PopulateAccountData (json, account) {
  account.ranksGifted = json.player?.giftingMeta?.ranksGiven ?? 0;

  account.rank = json.player?.rank;
  account.rank ??= json.player?.newPackageRank;
  account.rank ??= json?.player?.packageRank;
  if(json.player?.monthlyPackageRank == "SUPERSTAR") account.rank = "MVP_PLUS_PLUS";

  account.mvpColor = json.player?.monthlyRankColor ?? "GOLD";

  account.hypixelDiscord = json.player?.socialMedia?.links?.DISCORD ?? "";

  account.name = json?.player?.displayname ?? "INVALID-NAME";
  account.name_lower = account.name.toLowerCase();
  account.nameHist = json?.player?.knownAliases ?? ["INVALID-NAME"];

  account.internalId = json?.player?._id ?? 0;
  account.isLoggedIn = json?.player?.lastLogin > json.player?.lastLogout;
  account.lastLogout = json?.player?.lastLogout ?? 0;
  account.firstLogin = json?.player?.firstLogin ?? Date.now();

  account.version = json.player?.mcVersionRp ?? "1.8";
  account.mostRecentGameType = json.player?.mostRecentGameType ?? "NONE";

  account.xp = json.player?.networkExp ?? 0;
  account.level = 1.0 + -8750.0 / 2500.0 + Math.sqrt(((-8750.0 / 2500.0) * -8750.0) / 2500.0 + (2.0 / 2500.0) * account.xp);

  account.karma = json?.player?.karma ?? 0;
  account.achievementPoints = json?.player?.achievementPoints ?? 0;

  account.plusColor = json?.player?.rankPlusColor ?? "GOLD";
  account.cloak = json?.player?.currentCloak ?? "";
  account.hat = json?.player?.currentHat ?? "";
  account.clickEffect = json?.player?.currentClickEffect ?? "";

  account.arcadeCoins = json.player?.stats?.Arcade?.coins ?? 0;
  account.arcadeWins = json.player?.achievements?.arcade_arcade_winner ?? 0;
  account.anyWins = json.player?.achievements?.general_wins ?? 0;

  account.combinedArcadeWins =
          account.blockingDead.wins +
          account.bountyHunters.wins +
          account.dragonWars.wins +
          account.enderSpleef.wins +
          account.farmhunt.wins +
          account.football.wins +
          account.galaxyWars.wins +
          account.hideAndSeek.wins +
          account.holeInTheWall.wins +
          account.hypixelSays.wins +
          account.miniWalls.wins +
          account.partyGames.wins +
          account.pixelPainters.wins +
          account.simTotal +
          account.throwOut.wins +
          account.zombies.wins_zombies;
};