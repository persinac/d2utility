import { GuildMember, Message, TextChannel } from "discord.js";
import { MessageBuilding } from "../utilities/message_building";
import { Command } from "./command";
import { CommandContext } from "../models/command_context";
import * as req from "request-promise-native";
import { concatenate } from "../utilities/audio_concatenation";
import { writeFile } from "../utilities/file_util";
const fs = require("fs");
const path = require("path");

export class SaltCommand implements Command {
    commandNames = ["addsalt", "saltlist", "saltuser", "joinus", "leaveus", "mixaudio"];
    msgBldr = new MessageBuilding();

    getHelpMessage(commandPrefix: string): string {
        return `Use ${commandPrefix}${this.commandNames.join(", ")} to do salty things.`;
    }

    async runCommand(parsedUserCommand: CommandContext, user: string): Promise<void> {
        const originalMessage = parsedUserCommand.originalMessage.toString();
        const cmd = originalMessage.split(" ", 1)[0].substring(1);
        console.log(originalMessage.split(" "));
        switch (cmd) {
            case "mixaudio": {
                await this.mixAudio();
                break;
            }
            case "saltlist": {
                await this.getAllSalt(parsedUserCommand);
                break;
            }
            case "saltuser": {
                await this.getSaltByName(parsedUserCommand, user);
                break;
            }
            case "addsalt": {
                const granules: number = Number(originalMessage.split(" ")[2]);
                console.log(granules);
                await this.addSalt(parsedUserCommand, user, granules);
                break;
            }
            case "transfersalt": {
                const granules: number = Number(originalMessage.split(" ")[2]);
                console.log(granules);
                await this.addSalt(parsedUserCommand, user, granules);
                break;
            }
            case "xfersalt": {
                const granules: number = Number(originalMessage.split(" ")[2]);
                console.log(granules);
                await this.addSalt(parsedUserCommand, user, granules);
                break;
            }
            case "lowersalt": {
                const granules: number = Number(originalMessage.split(" ")[2]);
                console.log(granules);
                await this.addSalt(parsedUserCommand, user, granules);
                break;
            }
            /* Voice commands - still in testing! */
            case "joinus": {
                const voiceChannel = parsedUserCommand.originalMessage.member.voice.channel;
                await this.joinChannel(parsedUserCommand.originalMessage.member, parsedUserCommand.originalMessage);
                break;
            }
            case "leaveus": {
                if (parsedUserCommand.originalMessage.member.voice.channel) {
                    await parsedUserCommand.originalMessage.member.voice.channel.leave();
                } else {
                    await parsedUserCommand.originalMessage.reply("You need to join a voice channel first!");
                }
                break;
            }
        }
    }

    async mixAudio() {
        const directoryPath = path.join(__dirname, "..\\..\\recordings");
        const files = fs.readdirSync(directoryPath);
        console.log("Files length: " + files.length);
        concatenate(files).then((e) => {
            console.log("Finished Concat?");
            console.log(e);
            writeFile("recordings\\mixed.pcm", e).then(() => console.log("written"));
        });
    }

    async joinChannel(newMember: GuildMember, message: Message): Promise<void> {
        if (newMember.voice.channel) {
            const connection = await newMember.voice.channel.join();
            console.log("Success");
        } else {
            await message.reply("You need to join a voice channel first!");
        }
    }

    async getSaltByName(parsedUserCommand: CommandContext, user: string): Promise<void> {
        let r1 = "";
        console.log(user);
        await req.post("http://localhost:48330/salt/" + user)
            .then(function (htmlString: string) {
                r1 = htmlString;
            })
            .catch(function (err) {
                console.log(err);
            });
        const msg = this.msgBldr.buildMessage(parsedUserCommand, "salt", user, r1);
        await parsedUserCommand.originalMessage.channel.send(msg);
    }

    async getAllSalt(parsedUserCommand: CommandContext): Promise<void> {
        console.log("get all salt");
        let r1 = "";
        await req.get("http://localhost:48330/salt/list")
            .then(function (htmlString: string) {
                r1 = htmlString;
            })
            .catch(function (err) {
                console.log(err);
            });
        console.log(r1);
        const msg = this.msgBldr.buildMessage(parsedUserCommand, "salt", "all user", r1);
        await parsedUserCommand.originalMessage.channel.send(msg);
    }

    async addSalt(parsedUserCommand: CommandContext, user: string, granules: number): Promise<void> {
        let r1 = "";
        console.log(parsedUserCommand.originalMessage.author.username);
        console.log(user);
        console.log(granules);
        if (!user) {
            await parsedUserCommand.originalMessage.channel.send("We need a player to add salt to! Command context: ```(saltadd <<user>> <<granules>>```");
        } else if (!granules) {
            await parsedUserCommand.originalMessage.channel.send("Give us a level of salt.. a number of sorts... 1? 10? 1000? Command context: ```(saltadd <<user>> <<granules>>```");
        } else {
            await req.post("http://localhost:48330/salt/new/" + user + "&" + granules + "&" + parsedUserCommand.originalMessage.author.username)
                .then(function (htmlString: string) {
                    r1 = htmlString;
                })
                .catch(function (err) {
                    console.log(err);
                });
            await parsedUserCommand.originalMessage.channel.send("Someone is getting saltier by the minute... sprinkle it on");
        }
    }

    /* Bot commands - from timer process */
    static async botAddSalt(channel: TextChannel, granules: number): Promise<void> {
        let r1 = "";
        if (!granules) {
            await channel.send("Give us a level of salt.. a number of sorts... 1? 10? 1000?");
        } else {
            await req.post("http://localhost:48330/salt/new/" + granules)
                .then(function (htmlString: string) {
                    r1 = htmlString;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }

    static async botGetAllSalt(channel: TextChannel): Promise<void> {
        console.log("get all salt");
        let r1 = "";
        await req.get("http://localhost:48330/salt/list")
            .then(function (htmlString: string) {
                r1 = htmlString;
            })
            .catch(function (err) {
                console.log(err);
            });
        console.log(r1);
        const msgBldr = new MessageBuilding();
        const msg = msgBldr.buildMessage(undefined, "salt", "all user", r1);
        await channel.send(msg);
    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
        return true;
    }
}
