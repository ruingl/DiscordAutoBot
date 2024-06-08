const { Client, GatewayIntentBits } = require("discord.js");

module.exports = async ({ TOKEN, PREFIX }) => {
  const { commands, events, activeUsers } = global.DiscordBot;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    activeUsers.push(client.user.tag);
  });

  client.on("messageCreate", (msg) => {
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

    const [command, ...args] = msg.content
      .slice(PREFIX.length)
      .trim()
      .split(/\s+/);

    if (commands.has(command)) {
      const cmd = commands.get(command);
      if (
        cmd.config.adminOnly === true &&
        !msg.member.permissions.has("ADMINISTRATORR")
      ) {
        return msg.reply(
          `You don’t have permission to use command: ${command}`,
        );
      }

      try {
        cmd.run({
          msg: msg,
          message: msg,
          args: args,
          cmdName: command,
        });
      } catch (error) {
        msg.reply(`Error while running command: ${command}.
        
Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
      }
    } else {
      msg.reply(
        `The command ${command ? `"${command}"` : "that you are using"} doesn't exist, use ${PREFIX}help to view available commands.`,
      );
    }
  });

  events.forEach(({ eventType, handler }) => {
    client.on(eventType, (...args) => handler.run(...args));
  });

  client.on("disconnect", (event) => {
    console.log("Disconnected from the gateway:", event);
    const index = activeUsers.indexOf(client.user.tag);
    if (index > -1) {
      activeUsers.splice(index, 1);
    }
  });

  // these are here so it wont die ;)
  client.on("error", (error) => {});
  client.on("shardError", (error, shardId) => {});
  client.on("warn", (info) => {});

  client.on("invalidated", () => {
    const index = activeUsers.indexOf(client.user.tag);
    if (index > -1) {
      activeUsers.splice(index, 1);
    }
  });

  try {
    await client.login(TOKEN);
    await console.log(`sum1 logged in m8, ${client.user.tag}`);
  } catch (error) {
    console.error("Failed to login:", error);
    const index = activeUsers.indexOf(client.user?.tag);
    if (index > -1) {
      activeUsers.splice(index, 1);
    }
  }
};
