module.exports = {
  config: {
    name: "leaveNoti",
    description: "Send a notification when a user leaves the server.",
    eventType: "guildMemberRemove",
    enable: true,
  },

  run: async ({ member }) => {
    const goodbyeChannel = member.guild.channels.cache.find(
      (channel) => channel.name === "goodbyeChannelName",
    );
    if (!goodbyeChannel) return;

    goodbyeChannel.send(
      `${member.user.tag} has left the server.\nJoined at: ${new Date().toLocaleTimeString()}`,
    );
  },
};
