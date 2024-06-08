const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "joinNoti",
    description: "Send a notification when a user joins the server.",
    eventType: "guildMemberAdd",
    enable: true,
  },

  run: async ({ member, author }) => {
    const welcomeChannel = member.guild.channels.cache.find(
      (channel) => channel.name === "welcomeChannelName",
    );
    if (!welcomeChannel) return;

    if (member.user.bot && member.user.id === member.client.user.id) {
      const embed = new MessageEmbed()
        .setColor("#3498db")
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle("Bot connected successfully!")
        .setDescription("Joined at: " + new Date().toLocaleTimeString())
        .setFooter("DiscordAutoBot v1");

      welcomeChannel.send({ embeds: [embed] });
    } else {
      const embed = new MessageEmbed()
        .setColor("#3498db")
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle("Welcome!")
        .setDescription("We're excited to have you join us!")
        .setFooter("DiscordAutoBot v1");

      welcomeChannel.send({ embeds: [embed] });
    }
  },
};
