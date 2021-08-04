const HypixelApi = require("../HypixelApi");
const optifineRequest = require("../optifineRequest");
const labyRequest = require("../labyRequest");
const Logger = require("hyarcade-logger");

class SeasonalStats {

    constructor(player) {
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

    constructor(player) {
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

class MiniWallsStats {

    constructor(player) {
        this.kit = player?.stats?.Arcade?.miniwalls_activeKit ?? "Soldier";
        this.arrowsHit = player?.stats?.Arcade?.arrows_hit_mini_walls ?? 0;
        this.arrowsShot = player?.stats?.Arcade?.arrows_shot_mini_walls ?? 0;
        this.finalKills = player?.stats?.Arcade?.final_kills_mini_walls ?? 0;
        this.kills = player?.stats?.Arcade?.kills_mini_walls ?? 0;
        this.witherKills = player?.stats?.Arcade?.wither_kills_mini_walls ?? 0;
        this.deaths = player?.stats?.Arcade?.deaths_mini_walls ?? 0;
        this.witherDamage = player?.stats?.Arcade?.wither_damage_mini_walls ?? 0;
    }

    kit = "";
    arrowsHit = 0;
    arrowsShot = 0;
    finalKills = 0;
    kills = 0;
    witherKills = 0;
    deaths = 0;
    witherDamage = 0;
}

class ArcadeChallenges {

    constructor(player) {
        this.blockingDead = player?.stats?.challenges?.all_time?.ARCADE__blocking_dead_challenge ?? 0;
        this.creeperAttack = player?.stats?.challenges?.all_time?.ARCADE__creeper_attack_challenge ?? 0;
        this.dragonWars = player?.stats?.challenges?.all_time?.ARCADE__dragon_wars_challenge ?? 0;
        this.enderSpleef = player?.stats?.challenges?.all_time?.ARCADE__ender_spleef_challenge ?? 0;
        this.farmHunt = player?.stats?.challenges?.all_time?.ARCADE__farm_hunt_challenge ?? 0;
        this.galaxyWars = player?.stats?.challenges?.all_time?.ARCADE__galaxy_wars_challenge ?? 0;
        this.hitw = player?.stats?.challenges?.all_time?.ARCADE__hole_in_the_wall_challenge ?? 0;
        this.hns = player?.stats?.challenges?.all_time?.ARCADE__hide_and_seek_challenge ?? 0;
        this.hypixelSays = player?.stats?.challenges?.all_time?.ARCADE__hypixel_says_challenge ?? 0;
        this.miniWalls = player?.stats?.challenges?.all_time?.ARCADE__mini_walls_challenge ?? 0;
        this.partyGames = player?.stats?.challenges?.all_time?.ARCADE__party_games_challenge ?? 0;
        this.throwOut = player?.stats?.challenges?.all_time?.ARCADE__throw_out_challenge ?? 0;
        this.zombies = player?.stats?.challenges?.all_time?.ARCADE__zombies_challenge ?? 0;
    }

    zombies = 0;
    partyGames = 0;
    galaxyWars = 0;
    hitw = 0;
    hypixelSays = 0;
    creeperAttack = 0;
    blockingDead = 0;
    enderSpleef = 0;
    football = 0;
    miniWalls = 0;
    hns = 0;
    farmHunt = 0;
    dragonWars = 0;
    throwOut = 0;
}

class ArcadeQuests {

    constructor(player) {
        this.arcadeGamer = player?.quests?.arcade_gamer?.completions?.length;
        this.arcadeSpecialist = player?.quests?.arcade_specialist?.completions?.length;
        this.arcadeWinner = player?.quests?.arcade_winner?.completions?.length;
    }

    arcadeGamer = 0;
    arcadeWinner = 0;
    arcadeSpecialist = 0;
}

class ZombiesStats {
    constructor(player) {
        if(player?.stats?.Arcade) {
            for(let stat in player?.stats?.Arcade) {
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
    arcadeCoins = 0;
    wins = 0;
    hitwQual = 0;
    hitwFinal = 0;
    hitwWins = 0;
    hitwRounds = 0;
    farmhuntWins = 0;
    farmhuntShit = 0;
    hypixelSaysWins = 0;
    miniWallsWins = 0;
    footballWins = 0;
    enderSpleefWins = 0;
    throwOutWins = 0;
    galaxyWarsWins = 0;
    dragonWarsWins = 0;
    bountyHuntersWins = 0;
    blockingDeadWins = 0;
    hideAndSeekWins = 0;
    zombiesWins = 0;
    pixelPaintersWins = 0;
    ctwKills = 0;
    ctwWoolCaptured = 0;
    arcadeWins = 0;
    combinedArcadeWins = 0;
    anyWins = 0;
    hnsKills = 0;
    simTotal = 0;

    /**
     * Seasonal "simulator" games wins and stats
     *
     * @type {SeasonalStats}
     * @memberof Account
     */
    seasonalWins;

    /**
     *
     * @type {ExtraStats}
     * @memberof Account
     */
    extras;

    /**
     *
     * @type {MiniWallsStats}
     * @memberof Account
     */
    miniWalls;

    /**
     *
     * @type {ArcadeChallenges}
     * @memberof Account
     */
    challenges;

    /**
     *
     * @type {ArcadeQuests}
     * @memberof Account
     */
    quests;

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
    plusColor = "";
    mvpColor = "";
    hat = "";
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
    constructor(name, wins, uuid) {
        this.name = name;
        this.wins = wins;
        this.uuid = uuid;
        try {
            let timeLow = uuid?.slice(0, 8);
            let timeMid = uuid?.slice(8, 12);
            let version = uuid?.slice(12, 16);
            let varient = uuid?.slice(16, 20);
            let node = uuid?.slice(-12);
            this.uuidPosix = `${timeLow}-${timeMid}-${version}-${varient}-${node}`;
        } catch (e) {
            Logger.error(`Error caused from the uuid of ${name} : ${uuid}`);
            Logger.error(e);
        }
    }

    setData(oldAcc) {
        for(let prop in oldAcc) {
            this[prop] = oldAcc[prop];
        }
    }

    /**
     * Update and populate all the data for this account
     *
     * @memberof account
     */
    async updateData() {
        await Promise.all([this.updateHypixel(), this.updateOptifine(), this.updateLaby()]);
    }

    /**
     * Update and populate the optifine data
     *
     * @memberof account
     */
    async updateOptifine() {
        let req = new optifineRequest(this.name);
        await req.makeRequest();
        this.hasOFCape = req.hasCape();
    }

    /**
     * Update and populate the labymod data
     *
     * @memberof account
     */
    async updateLaby() {
        let req = new labyRequest(this.uuidPosix);
        await req.makeRequest();
        this.hasLabyCape = req.hasCape();
    }

    /**
     * Update and populate the hypixel data
     *
     * @memberof account
     */
    async updateHypixel() {
        let json = await HypixelApi.player(this.uuid);
        let player = json?.player;
        this.updateTime = Date.now();
        let arcade = json.player?.stats?.Arcade;

        this.wins = new Number(arcade?.wins_party ?? 0);
        this.wins += new Number(arcade?.wins_party_2 ?? 0);
        this.wins += new Number(arcade?.wins_party_3 ?? 0);

        this.ranksGifted = json.player?.giftingMeta?.ranksGiven ?? 0;

        this.rank = json.player?.rank;
        this.rank ??= json.player?.newPackageRank;
        this.rank ??= json?.player?.packageRank;
        if(json.player?.monthlyPackageRank == "SUPERSTAR") this.rank = "MVP_PLUS_PLUS";

        this.mvpColor = json.player?.monthlyRankColor ?? "GOLD";

        this.hypixelDiscord = json.player?.socialMedia?.links?.DISCORD ?? "";

        this.name = json?.player?.displayname ?? "INVALID-NAME";
        this.name_lower = this.name.toLowerCase();
        this.nameHist = json?.player?.knownAliases ?? ["INVALID-NAME"];

        this.internalId = json?.player?._id ?? 0;
        this.isLoggedIn = json?.player?.lastLogin > json.player?.lastLogout;
        this.lastLogout = json?.player?.lastLogout ?? 0;
        this.firstLogin = json?.player?.firstLogin ?? Date.now();

        this.version = json.player?.mcVersionRp ?? "1.8";
        this.mostRecentGameType = json.player?.mostRecentGameType ?? "NONE";

        this.xp = json.player?.networkExp ?? 0;
        this.level = 1.0 + -8750.0 / 2500.0 + Math.sqrt(((-8750.0 / 2500.0) * -8750.0) / 2500.0 + (2.0 / 2500.0) * this.xp);

        this.karma = json?.player?.karma ?? 0;
        this.achievementPoints = json?.player?.achievementPoints ?? 0;

        this.plusColor = json?.player?.rankPlusColor ?? "GOLD";
        this.cloak = json?.player?.currentCloak ?? "";
        this.hat = json?.player?.currentHat ?? "";
        this.clickEffect = json?.player?.currentClickEffect ?? "";

        this.arcadeCoins = arcade?.coins ?? 0;

        this.hypixelSaysWins = arcade?.wins_simon_says ?? 0;

        this.hitwFinal = arcade?.hitw_record_f ?? 0;
        this.hitwQual = arcade?.hitw_record_q ?? 0;
        this.hitwWins = arcade?.wins_hole_in_the_wall ?? 0;
        this.hitwRounds = arcade?.rounds_hole_in_the_wall ?? 0;

        this.farmhuntWins = arcade?.wins_farm_hunt ?? 0;
        this.farmhuntShit = arcade?.poop_collected ?? 0;
        this.miniWallsWins = arcade?.wins_mini_walls ?? 0;
        this.footballWins = arcade?.wins_soccer ?? 0;
        this.enderSpleefWins = arcade?.wins_ender ?? 0;
        this.throwOutWins = arcade?.wins_throw_out ?? 0;
        this.galaxyWarsWins = arcade?.sw_game_wins ?? 0;
        this.dragonWarsWins = arcade?.wins_dragonwars2 ?? 0;
        this.bountyHuntersWins = arcade?.wins_oneinthequiver ?? 0;
        this.blockingDeadWins = arcade?.wins_dayone ?? 0;
        this.hideAndSeekWins = (arcade?.seeker_wins_hide_and_seek ?? 0) + (arcade?.hider_wins_hide_and_seek ?? 0);
        this.zombiesWins = arcade?.wins_zombies ?? 0;
        this.pixelPaintersWins = arcade?.wins_draw_their_thing ?? 0;

        this.hnsKills = json.player?.achievements?.arcade_hide_and_seek_hider_kills ?? 0;

        this.ctwWoolCaptured = json.player?.achievements?.arcade_ctw_oh_sheep ?? 0;
        this.ctwKills = json.player?.achievements?.arcade_ctw_slayer ?? 0;

        this.seasonalWins = new SeasonalStats(json?.player);
        this.simTotal = this.seasonalWins.total;

        this.zombies = new ZombiesStats(player);
        this.extras = new ExtraStats(player);
        this.miniWalls = new MiniWallsStats(player);
        this.challenges = new ArcadeChallenges(player);
        this.quests = new ArcadeQuests(player);

        this.arcadeWins = json.player?.achievements?.arcade_arcade_winner ?? 0;
        this.anyWins = json.player?.achievements?.general_wins ?? 0;

        this.combinedArcadeWins =
            this.wins +
            this.hitwWins +
            this.farmhuntWins +
            this.hypixelSaysWins +
            this.miniWallsWins +
            this.footballWins +
            this.enderSpleefWins +
            this.throwOutWins +
            this.galaxyWarsWins +
            this.dragonWarsWins +
            this.bountyHuntersWins +
            this.blockingDeadWins +
            this.hideAndSeekWins +
            this.zombiesWins +
            this.pixelPaintersWins +
            this.simTotal;
    }
}

module.exports = Account;
