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
          (account?.blockingDead?.wins ?? 0) +
          (account?.bountyHunters?.wins ?? 0) +
          (account?.dragonWars?.wins ?? 0) +
          (account?.enderSpleef?.wins ?? 0) +
          (account?.farmhunt?.wins ?? 0) +
          (account?.football?.wins ?? 0) +
          (account?.galaxyWars?.wins ?? 0) +
          (account?.hideAndSeek?.wins ?? 0) +
          (account?.holeInTheWall?.wins ?? 0) +
          (account?.hypixelSays?.wins ?? 0) +
          (account?.miniWalls?.wins ?? 0) +
          (account?.partyGames?.wins ?? 0) +
          (account?.pixelPainters?.wins ?? 0) +
          (account?.simTotal ?? 0) +
          (account ?? 0?.throwOut?.wins ?? 0) +
          (account?.zombies?.wins_zombies ?? 0);
};