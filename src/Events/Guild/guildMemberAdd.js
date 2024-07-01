const { GuildMember, Events } = require("discord.js");

/**
 * @param {GuildMember} member
 */

module.exports = async (member) => {
  const guild = member.guild;
  let rol = guild.roles.cache
    .clone()
    .filter((e) => e.managed)
    .map((e) => e.id)
    .concat(global.config.roller.kayıtsızRolleri);
  member.roles.set(rol);
  const yasaklıTagLog = guild.kanalBul(global.config.kanallar.yasaklıTagLog);
  const tagLog = guild.kanalBul(global.config.kanallar.tagLog);
  const hoşgeldinKanalı = guild.kanalBul(
    global.config.kanallar.hoşgeldinKanalı,
  );
  let nickname = "";
  if (global.config.main.isimyaş && global.config.main.taglı) {
    nickname = `${global.config.main.tagsiz} İsim | Yaş`;
  }
  if (!global.config.main.isimyaş && global.config.main.taglı) {
    nickname = `${global.config.main.tagsiz} İsim`;
  }
  if (global.config.main.isimyaş && !global.config.main.taglı) {
    nickname = `${global.config.main.tagsiz} İsim | Yaş`;
  }
  if (!global.config.main.isimyaş && !global.config.main.taglı) {
    nickname = `${global.config.main.tagsiz} İsim`;
  }
  member.setNickname(nickname);
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
  }
  const yasaklıTaglar = global.yasaklıTag.get("yasaklıTag");
  if (yasaklıTaglar.some((x) => x.includes(m.user.globalName))) {
    yasaklıTagLog.send({
      content: `${member} kullanıcısı aramıza yasaklı tagla beraber katıldı. güncel olarak toplam **${guild.members.cache.filter((m) => yasaklıTaglar.some((x) => x.includes(m.user.globalName))).size()}** kişi var. `,
    });
    member.roles.set(global.config.roller.yasaklıTagRolü);
    member.setNickname("Yasaklı Tag");
  }
  const joinDate = member.user.createdAt;
  const currentDate = new Date();
  const differenceInDays = Math.floor(
    (currentDate - joinDate) / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 7) {
    member.roles.set(global.config.roller.şüpheliRolü);
    hoşgeldinKanalı.send({
      content: `${member} kullanıcısının hesabı 7 günden önce açıldığı için şüpheliye atıldı.`,
    });
    member.setNickname("Şüpheli Hesap");
  }
  hoşgeldinKanalı.send({
    content: [
      `${member} **${member.guild.name}** Sunucusuna hoşgeldin`,
      `Seninle birlikte sunucumuz ${guild.memberCount} kişiye ulaştı`,
      `Sol taraftaki teyit kanallarında teyit vererek kayıt olabilirsin`,
      `Unutma sunucumuzda kayıt olduğun gibi kuralları okuduğunu ve kabul ettiğini var sayacağız iyi eğlenceler :tada:`,
    ].join("\n"),
  });
};

module.exports.config = {
  Event: Events.GuildMemberAdd,
};
