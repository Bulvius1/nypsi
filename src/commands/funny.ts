import {
  BaseMessageOptions,
  CommandInteraction,
  GuildMember,
  InteractionReplyOptions,
  Message,
} from "discord.js";
import { Command, NypsiCommandInteraction } from "../models/Command";
import { CustomEmbed, ErrorEmbed } from "../models/EmbedBuilders";
import { addProgress } from "../utils/functions/economy/achievements.js";
import { createUser, userExists } from "../utils/functions/economy/utils.js";
import { getXp, updateXp } from "../utils/functions/economy/xp.js";
import { getMember } from "../utils/functions/member.js";
import { addCooldown, getResponse, onCooldown } from "../utils/handlers/cooldownhandler.js";

const cache = new Map<string, number>();

const cmd = new Command("funny", "Measures how funny you are", "fun").setAliases([
  "howfunny",
  "unfunny",

async function run(
  message: Message | (NypsiCommandInteraction & CommandInteraction),
  args: string[],
) {
  const send = async (data: BaseMessageOptions | InteractionReplyOptions) => {
    if (!(message instanceof Message)) {
      let usedNewMessage = false;
      let res;

      if (message.deferred) {
        res = await message.editReply(data).catch(async () => {
          usedNewMessage = true;
          return await message.channel.send(data as BaseMessageOptions);
        });
      } else {
        res = await message.reply(data as InteractionReplyOptions).catch(() => {
          return message.editReply(data).catch(async () => {
            usedNewMessage = true;
            return await message.channel.send(data as BaseMessageOptions);
          });
        });
      }

      if (usedNewMessage && res instanceof Message) return res;

      const replyMsg = await message.fetchReply();
      if (replyMsg instanceof Message) {
        return replyMsg;
      }
    } else {
      return await message.channel.send(data as BaseMessageOptions);
    }
  };

  if (await onCooldown(cmd.name, message.member)) {
    const embed = await getResponse(cmd.name, message.member);

    return send({ embeds: [embed], ephemeral: true });
  }

  await addCooldown(cmd.name, message.member, 7);

  let member: GuildMember;

  if (args.length == 0) {
    member = message.member;
  } else {
    member = await getMember(message.guild, args.join(" "));

    if (!member) {
      return send({ embeds: [new ErrorEmbed("invalid user")] });
    }
  }

  if (!(await userExists(member))) await createUser(member);

  let funnyAmount;

  if (cache.has(member.user.id)) {
    funnyAmount = cache.get(member.user.id);
  } else {
    funnyAmount = Math.ceil(Math.random() * 101) - 1;

    cache.set(member.user.id, funnyAmount);

    setTimeout(() => {
      if (cache.has(member.user.id)) {
        cache.delete(member.user.id);
      }
    }, 60 * 1000);
  }

  let funnyText = "";
  let funnyEmoji = "";

  if (funnyAmount >= 85) {
    funnyEmoji = "🤣😍😂😁🤭";
    funnyText = "I am certain that you have a good sense of humor.";
  } else if (funnyAmount >= 70) {
    funnyEmoji = "😁😀😳";
    funnyText = "Your friends should have a sense of humor as well";
  } else if (funnyAmount >= 50) {
    funnyEmoji = "😤😨💀";
    funnyText = "Don't be silly, get out";
  } else if (funnyAmount >= 30) {
    funnyEmoji = "😒🤔";
    funnyText = "You're looking for jokes on Google. Wow.";
  } else if (funnyAmount >= 25) {
    funnyEmoji = "😐";
    funnyText = "Even the google can't help you";
  } else if (funnyAmount >= 15) {
    funnyEmoji = "🤨🤨";
    funnyText = "Your mama jokes are funnier than u";
  } else if (funnyAmount >= 7) {
    funnyEmoji = "🤨⁉";
    funnyText = "nobody is laughing..";
  } else {
    funnyEmoji = "🙄";
    funnyText = "you're unfunny, but have 1 xp";

    if (cache.has(member.user.id)) {
      cache.delete(member.user.id);
      await updateXp(member, (await getXp(member)) + 1);
    }
  }

  const embed = new CustomEmbed(
    message.member,
    `${member.user.toString()}\n**${funnyAmount}**% funny ${funnyEmoji}\n${funnyText}`,
  ).setHeader("funny detector 3500", member.user.avatarURL());

  if (funnyAmount < 7) {
    embed.setFooter({ text: "+1xp" });
  }

  await send({ embeds: [embed] });

  addProgress(message.author.id, "unsure", 1);
}

cmd.setRun(run);

module.exports = cmd;
