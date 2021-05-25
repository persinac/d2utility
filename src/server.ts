import Discord, { Channel, GuildMember, Message, TextChannel, VoiceChannel, VoiceConnection } from "discord.js";
import { env_config, BotConfig } from "./config/env_config";
import { CommandHandler } from "./command_handler";
import path = require("path");
import has = Reflect.has;
import { SaltCommand } from "./commands/salt";
// process.env["NODE_CONFIG_DIR"] = "./src/config/";
validateConfig(env_config);
const fs = require("fs");

const commandHandler = new CommandHandler(env_config.prefix);
const client = new Discord.Client({intents: undefined});
const listenStreams = new Map();
const logger = require("discordjs-logger");
let hasBotSpoken;
let voicechannel;
let channelID;
let dispatcher;
const listOfListeners = [];

// https://discordapp.com/oauth2/authorize?&client_id=846566917594415104&scope=bot&permissions=2211969088

// just call API
logger.all(client);

client.on("debug", function(info) {
  // console.log(`debug -> ${info}`);
});

client.on("ready", async () => {
  console.log("Bot has started");
  await commandHandler.handleBotMessage(client, "giveAllSalt");
});

client.on("message", async (message: Message) => {
  await commandHandler.handleMessage(message);
});

client.on("error", e => {
  console.error("Discord client error!", e);
});

// make a new stream for each time someone starts to talk
function generateOutputFile(channel, member) {
  const fileName = `recordings/${channelID}-${member.username}-${Date.now()}.pcm`;
  console.log(fileName);
  return fs.createWriteStream(fileName);
}

function thenJoinVoiceChannel(conn) {
  console.log(`Scribe: ready: ${conn.channel.name}!`);
  // create our voice receiver
  const receiver = conn.receiver;

  // Must play a sound over the channel otherwise incoming voice data is empty
  if (!hasBotSpoken) {
    console.log("Scribe: Play join.mp3...");
    dispatcher = conn.play("initial_mp3\\salt_life.mp3", {passes: 5});
    dispatcher.on("start", () => {
      console.log("Scribe: Play Starting...");
    });
    dispatcher.on("finish", () => {
      console.log("Scribe: Finished playing!");
      hasBotSpoken = 1;
    });
    dispatcher.on("end", end => {
      console.log("Scribe: End Finished playing!");
    });
  }
  conn.on("error", (error) => {
    console.log("conn Error!", error);
  });
  conn.on("failed", (error) => {
    console.log("conn Fail!", error);
  });
  conn.on("speaking", (user, speaking) => {
    console.log("Scribe: Current Members: ", conn.channel.members.size);
    console.log(listOfListeners.indexOf(user.username) < 0);

    if (speaking.has("SPEAKING") && listOfListeners.indexOf(user.username) < 0) {
      // user is speaking and we're not listening to them yet, so add to list and listen
      listOfListeners.push(user.username);
      console.log(`Scribe: listening to ${user.username}`);
      // console.log(`Scribe: CONN ${conn}`, conn);
      // console.log(`Scribe: SPEAKING ${speaking}`, speaking);
      // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
      const audioStream = receiver.createStream(user, { mode: "pcm" });
      // create an output stream so we can dump our data in a file
      const outputStream = generateOutputFile(conn.channel, user);
      console.log("-=-=-=-=-=-=-=-=-=-= START outputStream -=-=-=-=-=-=-=-=-=-=");
      // pipe our audio data into the file stream
      // audioStream.on("data", (chunk) => {
      //    console.log(`Scribe: Received ${chunk.length} bytes of data.`);
      // });
      audioStream.pipe(outputStream);
      outputStream.on("data", console.log);
      // when the stream ends (the user stopped talking) tell the user
      audioStream.on("end", () => {
        // msg.channel.sendMessage(`I"m no longer listening to ${user}`);
        console.log(`Scribe: stop listening to ${user.username}`);
        listOfListeners.splice(listOfListeners.indexOf(user.username), 1);
        console.log("Listening to: " + listOfListeners.join(", "));
        console.log("-=-=-=-=-=-=-=-=-=-= END -=-=-=-=-=-=-=-=-=-=");
      });
    }
  });
}

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.member.voice.channel) {
    newState.member.voice.channel.join()
        .then(function (channel) {
          // Set the global
          channelID = newState.member.voice.channelID;
          voicechannel = channel;
          console.log("Joining voice channel", voicechannel.channel.name);
          return voicechannel.channel.join();
        })
        .then(thenJoinVoiceChannel);
  } else {
    console.log(newState.member.displayName + " left the channel");
    if (newState.member.displayName === "Salt Bae") {
      hasBotSpoken = undefined;
    }
  }
});

client.login(env_config.token);

/** Pre-startup validation of the bot env_config. */
function validateConfig(config: BotConfig) {
  if (!config.token) {
    throw new Error("You need to specify your Discord bot token!");
  }
}
