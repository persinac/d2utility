import { Client, Collection, GuildMember, Message, Role, Snowflake, TextChannel } from "discord.js";
import { Command } from "./commands/command";
import { RageCommand } from "./commands/rage";
import { CommandContext } from "./models/command_context";
import { HelpCommand } from "./commands/help";
import { reactor } from "./reactions/reactor";
import { GreetCommand } from "./commands/greet";
import { SaltCommand } from "./commands/salt";
import * as fs from "fs";

interface GuildConfig {
  guildId: string;
  mainChannel: string;
  roles?: string[];
  members?: string[];
}

/** Handler for bot commands issued by users. */
export class CommandHandler {
  private commands: Command[];

  private readonly prefix: string;

  constructor(prefix: string) {
    const commandClasses = [
      // TODO: Add more commands here.
      GreetCommand,
      RageCommand,
      SaltCommand
    ];

    this.commands = commandClasses.map(commandClass => new commandClass());
    this.commands.push(new HelpCommand(this.commands));
    this.prefix = prefix;
  }

  /** Executes user commands contained in a message if appropriate. */
  async handleMessage(message: Message): Promise<void> {
    let users = "";
    message.mentions.members.forEach(function(member: GuildMember) {
      users = member.user.username;
    });

    if (message.author.bot || !this.isCommand(message)) {
      return;
    }

    const commandContext = new CommandContext(message, this.prefix);

    const allowedCommands = this.commands.filter(command => command.hasPermissionToRun(commandContext));
    const matchedCommand = this.commands.find(command => command.commandNames.includes(commandContext.parsedCommandName));

    if (!matchedCommand) {
      await message.reply(`I don't recognize that command. Try !help.`);
      await reactor.failure(message);
    } else if (!allowedCommands.includes(matchedCommand)) {
      await message.reply(`you aren't allowed to use that command. Try !help.`);
      await reactor.failure(message);
    } else {
      await matchedCommand.runCommand(commandContext, users).then(() => {
        reactor.success(message);
      }).catch(reason => {
        reactor.failure(message);
      });
    }
  }

  /*** Executes BOT generated commands contained in a message if appropriate. **/
  async handleBotMessage(client: Client, command: string): Promise<void> {
    const chan: TextChannel[] = [];
    const guildConfigs: GuildConfig[] = [];
    await client.guilds.cache.each((g) => {
      // for each client get the guild ID
      // then retrieve configuration file by <guild_id>.json
      console.log(g.id);
      // if role is empty, get everyone in the server
      // else get everyone in the config'd roles array
      const rawDog = fs.readFileSync(`guild_configs\\${g.id}.json`, "utf8");
      const config = JSON.parse(rawDog);
      const gc: GuildConfig = {
        guildId: g.id,
        mainChannel: config["main_channel"],
        roles: config["roles"],
        members: []
      };
      if (gc.roles.length > 0) {
        const serverRole: Collection<Snowflake, Role> = g.roles.cache.filter((r) => {
          return gc.roles.indexOf(r.name) >= 0;
        });
        serverRole.each((r) => {
          r.members.each((m) => {
            if (m.user.username !== undefined) {
              gc.members.push(m.user.username);
            }
          });
        });
      }
      guildConfigs.push(gc);
    });
    await client.channels.cache.each((c) => {
      client.channels.fetch(c.id)
          .then(channel => {
            if (channel.type === "text") {
              const ts = <TextChannel>channel;
              let gc: GuildConfig[];
              gc = guildConfigs.filter((g) => ts.guild.id === g.guildId);
              if (ts.name === gc[0].mainChannel) {
                chan.push(ts);
              }
            }
          });
    });

    /* TODO: enum for bot commands */
    if (command === "giveAllSalt") {
      chan.forEach((c) => {
        CommandHandler.setUpRandomSalt(c);
      });
    }
  }

  /** Determines whether or not a message is a user command. */
  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }

  private static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  private static setUpRandomSalt(textChannel: TextChannel) {
    const intervalMS = this.getRandomInt(50000000);
    console.log(`Setting Interval: ${intervalMS}`);
    const promise = new Promise(function (resolve, reject) {
      setTimeout(() => {
        CommandHandler.randomSalt(textChannel);
        CommandHandler.setUpRandomSalt(textChannel);
      }, intervalMS);
    });
  }
  /***
   * This is working - just need to:
   * 2. Maybe figure out a trigger to the DB to switch this on/off for more randomness and less frequency
   ***/
  private static async randomSalt(textChannel: TextChannel) {
    textChannel.send(
        "@everyone",
        { files: [ "images\\salt_for_all.jpg" ] });
    const saltGranules = this.getRandomInt(500);
    await SaltCommand.botAddSalt(textChannel, saltGranules);
    await SaltCommand.botGetAllSalt(textChannel);
  }
}
