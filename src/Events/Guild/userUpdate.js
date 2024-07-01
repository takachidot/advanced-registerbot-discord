const { GuildMember, Events } = require("discord.js");

/**
 * @param {GuildMember} oldUser
 * @param {GuildMember} newUser
 */

module.exports = async (oldUser, newUser) => {
  const guild = oldUser.guild;
  const yasaklıTagLog = guild.kanalBul(global.config.kanallar.yasaklıTagLog);
  const tagLog = guild.kanalBul(global.config.kanallar.tagLog);
  const yasaklıTaglar = global.yasaklıTag.get("yasaklıTag");
  if (yasaklıTaglar.some((x) => x.includes(m.user.globalName))) {
    yasaklıTagLog.send({
      content: `${member} kullanıcısı aramıza yasaklı tagla beraber katıldı. yasaklı taglarda güncel olarak toplam **${guild.members.cache.filter((m) => yasaklıTaglar.some((x) => x.includes(m.user.globalName))).size()}** kişi var. `,
    });
    member.roles.set(global.config.roller.yasaklıTagRolü);
  } else {
    yasaklıTagLog.send({
      content: `${member} kullanıcısı aramıza yasaklı tagını bıraktı. yasaklı taglarda güncel olarak toplam **${guild.members.cache.filter((m) => yasaklıTaglar.some((x) => x.includes(m.user.globalName))).size()}** kişi var. `,
    });
    member.roles.set(global.config.roller.yasaklıTagRolü);
  }
  if (
    member.user.globalName.includes(global.config.main.tag) &&
    global.config.main.taglı
  ) {
    tagLog.send({
      content: `${member} kullanıcısı aramıza tagla beraber katıldı. güncel olarak toplam **${guild.members.cache.filter((m) => m.user.globalName.includes(global.config.main.tag)).size()}** kişi var. `,
    });
    member.displayName.replace(
      global.config.main.tagsiz,
      global.config.main.tag,
    );
    member.roles.add(global.config.roller.taglıRolü);
  } else {
    if (
      !member.user.globalName.includes(global.config.main.tag) &&
      global.config.main.taglı
    ) {
      tagLog.send({
        content: `${member} kullanıcısı aramızdan ayrıldı. güncel olarak toplam **${guild.members.cache.filter((m) => m.user.globalName.includes(global.config.main.tag)).size()}** kişi var. `,
      });
      member.displayName.replace(
        global.config.main.tag,
        global.config.main.tagsiz,
      );
      member.roles.remove(global.config.roller.taglıRolü);
    }
  }
};

module.exports.config = {
  Event: Events.UserUpdate,
};
