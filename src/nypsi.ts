import * as Cluster from "discord-hybrid-sharding";
import { GatewayIntentBits, Options, Partials } from "discord.js";
import { NypsiClient } from "./utils/models/Client";

const client = new NypsiClient({
  allowedMentions: {
    parse: ["users", "roles"],
  },
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    GuildStickerManager: 0,
    GuildScheduledEventManager: 0,
    MessageManager: 50,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    VoiceStateManager: 0,
    GuildEmojiManager: 0,
  }),
  sweepers: {
    messages: {
      lifetime: 60,
      interval: 180,
    },
  },
  presence: {
    status: "dnd",
    activities: [
      {
        name: "loading..",
      },
    ],
  },
  rest: {
    offset: 0,
  },
  shards: Cluster.Client.getInfo().SHARD_LIST,
  shardCount: Cluster.Client.getInfo().TOTAL_SHARDS,
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel], // for direct messages
});

import { loadCommands } from "./utils/commandhandler";
import { logger } from "./utils/logger";

loadCommands();
client.loadEvents();

setTimeout(() => {
  logger.info("logging in...");
  client.login(process.env.BOT_TOKEN);
}, 500);
