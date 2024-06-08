const { Collection } = require("discord.js");
const express = require("express");
const figlet = require("figlet");
const fs = require("fs-extra");
const ejs = require("ejs");

global.DiscordBot = {
  activeUsers: new Array(),
  commands: new Collection(),
  events: new Collection(),
};

// load:
const commandFiles = fs
  .readdirSync("./modules/commands")
  .filter((file) => file.endsWith(".js"));

const eventFiles = fs
  .readdirSync("./modules/commands")
  .filter((file) => file.endsWith(".js"));

for (const commandFile of commandFiles) {
  try {
    const i = require(`./modules/commands/${commandFile}`);

    if (!i) {
      throw new Error(`Command ${commandFile} does not export any!`);
    } else if (!i.config) {
      throw new Error(
        `Command ${commandFile} does not export a proper config object!`,
      );
    } else if (!i.run) {
      throw new Error(
        `Command ${commandFile} does not export a proper run function!`,
      );
    } else if (!i.config.enable) {
      return;
    }

    global.DiscordBot.commands.set(i.config.name, i);
  } catch (error) {
    console.error(error);
  }
}

for (const eventFile of eventFiles) {
  try {
    const i = require(`./modules/events/${eventFile}`);

    if (!i) {
      throw new Error(`Event ${eventFile} does not export any!`);
    } else if (!i.config) {
      throw new Error(
        `Event ${eventFile} does not export a proper config object!`,
      );
    } else if (!i.run) {
      throw new Error(
        `Event ${eventFile} does not export a proper run function!`,
      );
    } else if (!i.config.enable) {
      return;
    }

    global.DiscordBot.events.set(i.config.name, i);
  } catch (error) {
    console.error(error);
  }
}

const PORT = process.env.PORT || 3000;
const app = new express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());

// art???
let art = figlet.textSync("DiscBot");

// routez:
app.use("/api", require("./routes/api"));
app.use(require("./routes/root"));

// midwarez:
app.use((req, res, next) => {
  res.status(404).render("404");
  next();
});

// listen:
app.listen(PORT, () => {
  console.log(`${art}`);
  console.log(`Running on PORT: `, PORT);
  console.log();
});
