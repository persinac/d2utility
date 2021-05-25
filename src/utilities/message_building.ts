import { CommandContext } from "../models/command_context";
import table = require("text-table");

export class MessageBuilding {
  public buildMessage(parsedUserCommand: CommandContext, bot: string, user: String, data: string): string {
    const parseData = JSON.parse(data);
    const tempHdr: string[] = [];
    const tempTblData = [];
    if (user === "all user") {
      tempHdr.push("Player");
    }
    if (bot === "salt") {
      tempHdr.push("Last Salt Parade");
      tempHdr.push("Saltiness");
    } else {
      tempHdr.push("Last Rage Quit");
      tempHdr.push("Counter");
    }
    tempTblData.push(tempHdr);
    for (const parseDataKey in parseData) {
      if (bot === "salt") {
        const date = new Date(parseData[parseDataKey]["salt_added_on"]);
        if (user === "all user") {
          tempTblData.push([parseData[parseDataKey]["salty_player"], this.formatDate(date), parseData[parseDataKey]["salt_level"]]);
        } else {
          tempTblData.push([this.formatDate(date), parseData[parseDataKey]["salt_level"]]);
        }
      } else {
        const date = new Date(parseData[parseDataKey]["reported_on"]);
        if (user === "all user") {
          tempTblData.push([parseData[parseDataKey]["player"], this.formatDate(date), parseData[parseDataKey]["counter"]]);
        } else {
          tempTblData.push([this.formatDate(date), parseData[parseDataKey]["counter"]]);
        }
      }
    }
    const t = table( tempTblData, { align: [ "l", "c", "c" ] });
    return "```" + t + "```";
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const seconds = date.getSeconds();
    return ( monthIndex + 1 ) + "-" + day + "-" + year + " " + this.padTime(hours) + ":" + this.padTime(minutes) + ":" + this.padTime(seconds);
  }

  padTime(digit: number): string {
    if (digit < 10 ) {
      return "0" + digit.toString();
    } else {
      return digit.toString();
    }
  }
}