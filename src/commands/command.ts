import { Message, User } from "discord.js";
import { CommandContext } from "../models/command_context";

export interface Command {
  /**
   * List of aliases for the command.
   *
   * The first name in the list is the primary command name.
   */
  readonly commandNames: string[];

  /** Usage documentation. */
  getHelpMessage(commandPrefix: string): string;

  /** Execute the command. */
  runCommand(parsedUserCommand: CommandContext, user: String): Promise<void>;

  /** Returns whether or not the requesting user can use the command in the current context. */
  hasPermissionToRun(parsedUserCommand: CommandContext): boolean;
}
