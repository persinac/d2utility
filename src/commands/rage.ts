import { Message } from "discord.js";
import { MessageBuilding } from "../utilities/message_building";
import { Command } from "./command";
import { CommandContext } from "../models/command_context";
import * as req from "request-promise-native";

export class RageCommand implements Command {
  commandNames = ["ragequit", "rageadd", "ragelist", "rageuser"];
  msgBldr = new MessageBuilding();

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}${this.commandNames.join(", ")} to do ragey things.`;
  }

  async runCommand(parsedUserCommand: CommandContext, user: string): Promise<void> {
    const originalMessage = parsedUserCommand.originalMessage.toString();
    const cmd = originalMessage.split(" ", 1)[0].substring(1);
    switch (cmd) {
      case "ragelist": {
        await this.getAllRagers(parsedUserCommand);
        break;
      }
      case "rageuser": {
        await this.getRageQuitByName(parsedUserCommand, user);
        break;
      }
      case "rageadd": {
        await this.addNewRager(parsedUserCommand, user);
        break;
      }
      case "ragequit": {
        await this.addNewRager(parsedUserCommand, user);
        break;
      }
    }
  }

  async getRageQuitByName(parsedUserCommand: CommandContext, user: string): Promise<void> {
    let r1 = "";
    console.log(user);
    await req.post("http://localhost:48330/rager/" + user)
      .then(function (htmlString: string) {
        r1 = htmlString;
      })
      .catch(function (err) {
        console.log(err);
      });
    const msg = this.msgBldr.buildMessage(parsedUserCommand, "rage", user, r1);
    await parsedUserCommand.originalMessage.channel.send(msg);
  }

  async getAllRagers(parsedUserCommand: CommandContext): Promise<void> {
    console.log("get all ragers");
    let r1 = "";
    await req.get("http://localhost:48330/rager/list")
      .then(function (htmlString: string) {
        r1 = htmlString;
      })
      .catch(function (err) {
        console.log(err);
      });
    const msg = this.msgBldr.buildMessage(parsedUserCommand, "rage", "all user", r1);
    await parsedUserCommand.originalMessage.channel.send(msg);
  }

  async addNewRager(parsedUserCommand: CommandContext, user: string): Promise<void> {
    let r1 = "";
    console.log(parsedUserCommand.originalMessage.author.username);
    await req.post("http://localhost:48330/rager/new/" + user + "&" + parsedUserCommand.originalMessage.author.username)
      .then(function (htmlString: string) {
        r1 = htmlString;
      })
      .catch(function (err) {
        console.log(err);
      });
    await parsedUserCommand.originalMessage.channel.send("Added " + user + " to the darkside... let's see how how many times we can get them to ragequit");
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
