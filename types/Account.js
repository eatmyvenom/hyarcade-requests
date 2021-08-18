const HypixelApi = require("../HypixelApi");
const optifineRequest = require("../optifineRequest");
const labyRequest = require("../labyRequest");
const Logger = require("hyarcade-logger");
const AccountAP = require("./AccountAP");
const PopulateAccountData = require("./PopulateAccountData");

class ArcadeGameStats {
    /**
     *
     * @type {number}
     * @memberof ArcadeGameStats
     */
    wins = 0;
}

class BlockingDeadStats extends ArcadeGameStats {

    kills = 0;
    headshots = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_dayone ?? 0;
      this.kills = arcade?.kills_dayone ?? 0;
      this.headshots = arcade?.headshots_dayone ?? 0;
    }
}

class BountyHuntersStats extends ArcadeGameStats {
    kills = 0;
    bountyKills = 0;
    deaths = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_oneinthequiver ?? 0;
      this.kills = arcade?.kills_oneinthequiver ?? 0;
      this.bountyKills = arcade?.bounty_kills_oneinthequiver ?? 0;
      this.deaths = arcade?.deaths_oneinthequiver ?? 0;
    }
}

class CaptureTheWoolStats {
    kills = 0;
    woolCaptures = 0;

    constructor (player) {
      this.woolCaptures = player?.achievements?.arcade_ctw_oh_sheep ?? 0;
      this.kills = player?.achievements?.arcade_ctw_slayer ?? 0;
    }
}

class DragonWarsStats extends ArcadeGameStats {

    kills = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_dragonwars2 ?? 0;
      this.kills = arcade?.kills_dragonwars2 ?? 0;
    }
}

class EnderSpleefStats extends ArcadeGameStats {
  constructor (arcade) {
    super();
    this.wins = arcade?.wins_dragonwars2 ?? 0;
  }
}

class FootballStats extends ArcadeGameStats {

    goals = 0;
    powerkicks = 0;
    kicks = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_soccer ?? 0;
      this.goals = arcade?.goals_soccer ?? 0;
      this.powerkicks = arcade?.powerkicks_soccer ?? 0;
      this.kicks = arcade?.kicks_soccer ?? 0;
    }
}

class FarmhuntStats extends ArcadeGameStats {

    poop = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_farm_hunt ?? 0;
      this.poop = arcade?.poop_collected ?? 0;
    }
}

class GalaxyWarsStats extends ArcadeGameStats {

    kills = 0;
    deaths = 0;

    constructor (arcade) {
      super();
      this.kills = arcade?.sw_kills ?? 0;
      this.deaths = arcade?.sw_deaths ?? 0;
      this.wins = arcade?.sw_game_wins ?? 0;
    }
}

class HideAndSeekStats extends ArcadeGameStats {

    seekerWins = 0;
    hiderWins = 0;
    kills = 0;

    constructor (player) {
      super();
      this.seekerWins = player?.stats?.Arcade?.seeker_wins_hide_and_seek ?? 0;
      this.hiderWins = player?.stats?.Arcade?.hider_wins_hide_and_seek ?? 0;
      this.wins = this.seekerWins + this.hiderWins;
      this.kills = player?.achievements?.arcade_hide_and_seek_hider_kills ?? 0;
    }
}

class HoleInTheWallStats extends ArcadeGameStats {

    rounds = 0;
    qualifiers = 0;
    finals = 0;

    constructor (arcade) {
      super();
      this.finals = arcade?.hitw_record_f ?? 0;
      this.qualifiers = arcade?.hitw_record_q ?? 0;
      this.wins = arcade?.wins_hole_in_the_wall ?? 0;
      this.rounds = arcade?.rounds_hole_in_the_wall ?? 0;
    }
}

class HypixelSaysStats extends ArcadeGameStats {

    rounds = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_simon_says ?? 0;
      this.rounds = arcade?.rounds_simon_says ?? 0;
    }
}

class PartyGamesStats extends ArcadeGameStats {

    wins1 = 0;
    wins2 = 0;
    wins3 = 0;

    constructor (arcade) {
      super();
      this.wins1 = arcade?.wins_party ?? 0;
      this.wins2 = arcade?.wins_party_2 ?? 0;
      this.wins3 = arcade?.wins_party_3 ?? 0;
      this.wins = this.wins1 + this.wins2 + this.wins3;
    }
}

class PixelPaintersStats extends ArcadeGameStats {

  constructor (arcade) {
    super();
    this.wins = arcade?.wins_draw_their_thing ?? 0;
  }
}

class ThrowOutStats extends ArcadeGameStats {

    kills = 0;
    deaths = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_throw_out ?? 0;
      this.kills = arcade?.kills_throw_out ?? 0;
      this.deaths = arcade?.deaths_throw_out ?? 0;
    }
}

class SeasonalStats {

  constructor (player) {
    this.easter = player?.stats?.Arcade?.wins_easter_simulator ?? 0;
    this.grinch = player?.stats?.Arcade?.wins_grinch_simulator_v2 ?? 0;
    this.halloween = player?.stats?.Arcade?.wins_halloween_simulator ?? 0;
    this.scuba = player?.stats?.Arcade?.wins_scuba_simulator ?? 0;
    this.total =
            this.easter +
            this.grinch +
            this.halloween +
            this.scuba;
  }

    easter = 0;
    scuba = 0;
    halloween = 0;
    grinch = 0;
    total = 0;
}

class ExtraStats {

  constructor (player) {
    this.blockingDeadKills = player?.stats?.Arcade?.kills_dayone ?? 0;
    this.blockingDeadHeadshots = player?.stats?.Arcade?.headshots_dayone ?? 0;
    this.bountyHuntersKills = player?.stats?.Arcade?.kills_oneinthequiver ?? 0;
    this.bountyHuntersBountyKills = player?.stats?.Arcade?.bounty_kills_oneinthequiver ?? 0;
    this.bountyHuntersDeaths = player?.stats?.Arcade?.deaths_oneinthequiver ?? 0;
    this.dragonWarsKills = player?.stats?.Arcade?.kills_dragonwars2 ?? 0;
    this.footballGoals = player?.stats?.Arcade?.goals_soccer ?? 0;
    this.footballPKicks = player?.stats?.Arcade?.powerkicks_soccer ?? 0;
    this.footballKicks = player?.stats?.Arcade?.kicks_soccer ?? 0;
    this.galaxyWarsKills = player?.stats?.Arcade?.sw_kills ?? 0;
    this.galaxyWarsDeaths = player?.stats?.Arcade?.sw_deaths ?? 0;
    this.HNSSeekerWins = player?.stats?.Arcade?.seeker_wins_hide_and_seek ?? 0;
    this.HNSHiderWins = player?.stats?.Arcade?.hider_wins_hide_and_seek ?? 0;
    this.hypixelSaysRounds = player?.stats?.Arcade?.rounds_simon_says ?? 0;
    this.throwOutKills = player?.stats?.Arcade?.kills_throw_out ?? 0;
    this.throwOutDeaths = player?.stats?.Arcade?.deaths_throw_out ?? 0;
  }

    blockingDeadKills = 0;
    blockingDeadHeadshots = 0;
    bountyHuntersKills = 0;
    bountyHuntersBountyKills = 0;
    bountyHuntersDeaths = 0;
    dragonWarsKills = 0;
    footballGoals = 0;
    footballPKicks = 0;
    footballKicks = 0;
    galaxyWarsKills = 0;
    galaxyWarsDeaths = 0;
    HNSSeekerWins = 0;
    HNSHiderWins = 0;
    hypixelSaysRounds = 0;
    throwOutKills = 0;
    throwOutDeaths = 0;
}

class MiniWallsStats extends ArcadeGameStats {

    kit = "";
    arrowsHit = 0;
    arrowsShot = 0;
    finalKills = 0;
    kills = 0;
    witherKills = 0;
    deaths = 0;
    witherDamage = 0;

    constructor (arcade) {
      super();
      this.wins = arcade?.wins_mini_walls ?? 0;
      this.kit = arcade?.miniwalls_activeKit ?? "Soldier";
      this.arrowsHit = arcade?.arrows_hit_mini_walls ?? 0;
      this.arrowsShot = arcade?.arrows_shot_mini_walls ?? 0;
      this.finalKills = arcade?.final_kills_mini_walls ?? 0;
      this.kills = arcade?.kills_mini_walls ?? 0;
      this.witherKills = arcade?.wither_kills_mini_walls ?? 0;
      this.deaths = arcade?.deaths_mini_walls ?? 0;
      this.witherDamage = arcade?.wither_damage_mini_walls ?? 0;
    }
}

class ArcadeQuests {

  constructor (player) {
    this.arcadeGamer = player?.quests?.arcade_gamer?.completions?.length;
    this.arcadeSpecialist = player?.quests?.arcade_specialist?.completions?.length;
    this.arcadeWinner = player?.quests?.arcade_winner?.completions?.length;
  }

    arcadeGamer = 0;
    arcadeWinner = 0;
    arcadeSpecialist = 0;
}

class ZombiesStats {
  constructor (player) {
    if(player?.stats?.Arcade) {
      for(const stat in player?.stats?.Arcade) {
        if(stat.includes("zombie")) {
          this[stat] = player?.stats?.Arcade[stat];
        }
      }
    }
  }
}

class Account {
    name = "";
    name_lower = "";
    nameHist = [];
    uuid = "";
    uuidPosix = "";
    internalId = "";

    guildID = "";
    guild = undefined;
    guildTag = undefined;
    guildTagColor = undefined;

    rank = "";

    version = "";

    firstLogin = 0;
    isLoggedIn = false;
    lastLogout = 0;

    mostRecentGameType = "";

    achievementPoints = 0;
    xp = 0;
    level = 0;
    karma = 0;
    ranksGifted = 0;

    /**
     *
     * @type {AccountAP}
     * @memberof Account
     */
    arcadeAchievments = {};

    /**
     *
     * @type {BlockingDeadStats}
     * @memberof Account
     */
    blockingDead = {};

    /**
     *
     * @type {BountyHuntersStats}
     * @memberof Account
     */
    bountyHunters = {};

    /**
     *
     * @type {CaptureTheWoolStats}
     * @memberof Account
     */
    captureTheWool = {};

    /**
     *
     * @type {DragonWarsStats}
     * @memberof Account
     */
    dragonWars = {};

    /**
     *
     * @type {EnderSpleefStats}
     * @memberof Account
     */
    enderSpleef = {};

    /**
     *
     * @type {FarmhuntStats}
     * @memberof Account
     */
    farmhunt = {};

    /**
     *
     * @type {FootballStats}
     * @memberof Account
     */
    football = {};

    /**
     *
     * @type {GalaxyWarsStats}
     * @memberof Account
     */
    galaxyWars = {};

    /**
     *
     * @type {HideAndSeekStats}
     * @memberof Account
     */
    hideAndSeek = {};

    /**
     *
     * @type {HoleInTheWallStats}
     * @memberof Account
     */
    holeInTheWall = {};

    /**
     *
     * @type {HypixelSaysStats}
     * @memberof Account
     */
    hypixelSays = {};

    /**
     *
     * @type {PartyGamesStats}
     * @memberof Account
     */
    partyGames = {};

    /**
     *
     * @type {PixelPaintersStats}
     * @memberof Account
     */
    pixelPainters = {};

    /**
     *
     * @type {ThrowOutStats}
     * @memberof Account
     */
    throwOut = {};

    simTotal = 0;
    arcadeCoins = 0;
    arcadeWins = 0;
    combinedArcadeWins = 0;
    anyWins = 0;

    /**
     * Seasonal "simulator" games wins and stats
     *
     * @type {SeasonalStats}
     * @memberof Account
     */
    seasonalWins = {};

    /**
     *
     * @type {ExtraStats}
     * @memberof Account
     */
    extras = {};

    /**
     *
     * @type {MiniWallsStats}
     * @memberof Account
     */
    miniWalls = {};

    /**
     *
     * @type {ArcadeQuests}
     * @memberof Account
     */
    quests = {};

    /**
     *
     * @type {ZombiesStats}
     * @memberof Account
     */
    zombies = {};

    hasOFCape = false;
    hasLabyCape = false;

    cloak = "";
    clickEffect = "";
    hat = "";

    plusColor = "";
    mvpColor = "";

    hypixelDiscord = "";
    discord = "";

    updateTime = 0;

    /**
     * Creates an instance of Account.
     *
     * @param {string} name
     * @param {number} wins
     * @param {string} uuid
     * @memberof account
     */
    constructor (name, wins, uuid) {
      this.name = name;
      this.uuid = uuid;
      try {
        const timeLow = uuid?.slice(0, 8);
        const timeMid = uuid?.slice(8, 12);
        const version = uuid?.slice(12, 16);
        const varient = uuid?.slice(16, 20);
        const node = uuid?.slice(-12);
        this.uuidPosix = `${timeLow}-${timeMid}-${version}-${varient}-${node}`;
      } catch (e) {
        Logger.error(`Error caused from the uuid of ${name} : ${uuid}`);
        Logger.error(e);
      }
    }

    setData (oldAcc) {
      Object.assign(this, oldAcc);
    }

    /**
     * 
     * @param {*} obj 
     * @returns {Account}
     */
    static from (obj) {
      const acc = new Account("", 0, "");
      Object.assign(acc, obj);

      return acc;
    }

    get wins () {return this.partyGames.wins;}
    set wins (count) {this.partyGames.wins = count;}

    get hitwQual () {return this.holeInTheWall.qualifiers;}
    set hitwQual (v) {this.holeInTheWall.qualifiers = v;}

    get hitwFinal () {return this.holeInTheWall.finals;}
    set hitwFinal (v) {this.holeInTheWall.finals = v;}

    get hitwWins () {return this.holeInTheWall.wins;}
    set hitwWins (v) {this.holeInTheWall.wins = v;}

    get hitwRounds () {return this.holeInTheWall.rounds;}
    set hitwRounds (v) {this.holeInTheWall.rounds = v;}

    get farmhuntWins () {return this.farmhunt.wins;}
    set farmhuntWins (v) {this.farmhunt.wins = v;}

    get farmhuntShit () {return this.farmhunt.poop;}
    set farmhuntShit (v) {this.farmhunt.poop = v;}

    get hypixelSaysWins () {return this.hypixelSays.wins;}
    set hypixelSaysRounds (v) {this.hypixelSays.rounds = v;}

    get miniWallsWins () {return this.miniWalls.wins;}
    set miniWallsWins (v) {this.miniWalls.wins = v;}

    get footballWins () {return this.football.wins;}
    set footballWins (v) {this.football.wins = v;}

    get enderSpleefWins () {return this.enderSpleef.wins;}
    set enderSpleefWins (v) {this.enderSpleef.wins = v;}

    get throwOutWins () {return this.throwOut.wins;}
    set throwOutWins (v) {this.throwOut.wins = v;}

    get galaxyWarsWins () {return this.galaxyWars.wins;}
    set galaxyWarsWins (v) {this.galaxyWars.wins = v;}

    get dragonWarsWins () {return this.dragonWars.wins;}
    set dragonWarsWins (v) {this.dragonWars.wins = v;}

    get bountyHuntersWins () {return this.bountyHunters.wins;}
    set bountyHuntersWins (v) {this.bountyHunters.wins = v;}

    get blockingDeadWins () {return this.blockingDead.wins;}
    set blockingDeadWins (v) {this.blockingDead.wins = v;}

    get hideAndSeekWins () {return this.hideAndSeek.wins;}
    set hideAndSeekWins (v) {this.hideAndSeek.wins = v;}

    get zombiesWins () {return this.zombies.wins_zombies;}
    set zombiesWins (v) {this.zombies.wins_zombies = v;}

    get pixelPaintersWins () {return this.pixelPainters.wins;}
    set pixelPaintersWins (v) {this.pixelPainters.wins = v;}

    get ctwKills () {return this.captureTheWool.kills;}
    set ctwKills (v) {this.captureTheWool.kills = v;}

    get ctwWoolCaptured () {return this.captureTheWool.woolCaptures;}
    set ctwWoolCaptured (v) {this.captureTheWool.woolCaptures = v;}

    get hnsKills () {return this.hideAndSeek.kills;}
    set hnsKills (v) {this.hideAndSeek.kills = v;}

    get extras () {
      return {
        blockingDeadKills: this.blockingDead.kills,
        blockingDeadHeadshots: this.blockingDead.headshots,
        bountyHuntersKills: this.bountyHunters.kills,
        bountyHuntersBountyKills: this.bountyHunters.bountyKills,
        bountyHuntersDeaths: this.bountyHunters.deaths,
        dragonWarsKills: this.dragonWars.kills,
        footballGoals: this.football.goals,
        footballPKicks: this.football.powerkicks,
        footballKicks: this.football.kicks,
        galaxyWarsKills: this.galaxyWars.kills,
        galaxyWarsDeaths: this.galaxyWars.deaths,
        HNSSeekerWins: this.hideAndSeek.seekerWins,
        HNSHiderWins: this.hideAndSeek.hiderWins,
        hypixelSaysRounds: this.hypixelSays.rounds,
        throwOutKills: this.throwOut.kills,
        throwOutDeaths: this.throwOut.deaths
      };
    }

    /**
     *
     * @param {ExtraStats} v
     * @memberof Account
     */
    set extras (v) {
      this.blockingDead.kills = v.blockingDeadKills;
      this.blockingDead.headshots = v.blockingDeadHeadshots;
      this.bountyHunters.kills = v.bountyHuntersKills;
      this.bountyHunters.bountyKills = v.bountyHuntersBountyKills;
      this.dragonWars.kills = v.dragonWarsKills;
      this.football.goals = v.footballGoals;
      this.football.powerkicks = v.footballPKicks;
      this.football.kicks = v.footballKicks;
      this.galaxyWars.kills = v.galaxyWarsKills;
      this.galaxyWars.deaths = v.galaxyWarsDeaths;
      this.hideAndSeek.seekerWins = v.HNSSeekerWins;
      this.hideAndSeek.hiderWins = v.HNSHiderWins;
      this.hypixelSays.rounds = v.hypixelSaysRounds;
      this.throwOut.deaths = v.throwOutDeaths;
      this.throwOut.kills = v.throwOutKills;
    }

    /**
     * Update and populate all the data for this account
     *
     * @memberof account
     */
    async updateData () {
      await Promise.all([this.updateHypixel(), this.updateOptifine(), this.updateLaby()]);
    }

    /**
     * Update and populate the optifine data
     *
     * @memberof account
     */
    async updateOptifine () {
      const req = new optifineRequest(this.name);
      await req.makeRequest();
      this.hasOFCape = req.hasCape();
    }

    /**
     * Update and populate the labymod data
     *
     * @memberof account
     */
    async updateLaby () {
      const req = new labyRequest(this.uuidPosix);
      await req.makeRequest();
      this.hasLabyCape = req.hasCape();
    }

    /**
     * Update and populate the hypixel data
     *
     * @memberof account
     */
    async updateHypixel () {
      const json = await HypixelApi.player(this.uuid);

      const player = json?.player;
      const arcade = json.player?.stats?.Arcade;

      this.updateTime = Date.now();

      this.extras = new ExtraStats(player);
      this.blockingDead = new BlockingDeadStats(arcade);
      this.bountyHunters = new BountyHuntersStats(arcade);
      this.captureTheWool = new CaptureTheWoolStats(player);
      this.dragonWars = new DragonWarsStats(arcade);
      this.enderSpleef = new EnderSpleefStats(arcade);
      this.farmhunt = new FarmhuntStats(arcade);
      this.football = new FootballStats(arcade);
      this.galaxyWars = new GalaxyWarsStats(arcade);
      this.hideAndSeek = new HideAndSeekStats(arcade);
      this.holeInTheWall = new HoleInTheWallStats(arcade);
      this.hypixelSays = new HypixelSaysStats(arcade);
      this.partyGames = new PartyGamesStats(arcade);
      this.pixelPainters = new PixelPaintersStats(arcade);
      this.throwOut = new ThrowOutStats(arcade);
      this.zombies = new ZombiesStats(player);
      this.miniWalls = new MiniWallsStats(arcade);
      this.arcadeAchievments = new AccountAP(player);

      this.quests = new ArcadeQuests(player);
      this.seasonalWins = new SeasonalStats(json?.player);
      this.simTotal = this.seasonalWins.total;

      PopulateAccountData(json, this);
    }
}

module.exports = Account;
