import { Command } from "./command";
import { CommandContext } from "../models/command_context";

export class GreetCommand implements Command {
  commandNames = ["greet", "hello"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}greet to get a greeting.`;
  }

  async runCommand(parsedUserCommand: CommandContext): Promise<void> {
    await parsedUserCommand.originalMessage.reply("Who's raging tonight?");
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
