const { Guild, Message, GuildMember, EmbedBuilder } = require("discord.js");
const { genEmbed } = require("./Embed");

Guild.prototype.kanalBul = function (content) {
  let x =
    this.channels.cache.get(content) ||
    this.channels.cache.find((x) => x.name === content);
  if (!x) {
    global.logger.error(`${x.name} Kanalı bulunamadı.`);
  }
  return x;
};

Guild.prototype.emojiGöster = function (content) {
  let x =
    this.emojis.cache.get(content) ||
    this.emojis.cache.find((x) => x.name === content);
  if (!x) {
    global.logger.error(`${x.name} Emojisi bulunamadı.`);
  }
  return x;
};

GuildMember.prototype.register = function (isim, yaş, cinsiyet, yetkili) {
  let eskiKayitlar = db.get(`${this.user.id}.kayıtlar`) || [];

  eskiKayitlar.push({
    isim: isim,
    yaş: yaş,
    cinsiyet: cinsiyet,
    yetkili: yetkili,
  });

  db.set(`${this.user.id}.kayıtlar`, eskiKayitlar);

  let rol = this.roles.cache
    .clone()
    .filter((e) => e.managed)
    .map((e) => e.id)
    .concat(
      (cinsiyet = "Kadın"
        ? global.config.roller.kadınRolleri
        : global.config.roller.erkekRolleri),
    );
  let kayitPuani = db.get(`${yetkili}.kayıtpuan.toplam`) || 0;
  db.set(`${yetkili}.kayıtpuan.toplam`, kayitPuani + 1);
  this.roles.set(rol).catch((err) => {});
  const kanal = this.guild.kanalBul(global.config.kanallar.registerLog);
  kanal.send({
    embeds: [
      new genEmbed()
        .setAuthor({
          name: `${this.user.tag} (${this.user.id})`,
          iconURL: this.user.displayAvatarURL(),
        })
        .setDescription(
          [
            `**${this}** Kullanıcısının yeni kayıt verisi:`,
            `**İsim:** ${isim}`,
            `**Yaş:** ${yaş}`,
            `**Cinsiyet:** ${cinsiyet}`,
            `**Yetkili:** <@${yetkili}>`,
          ].join("\n"),
        ),
    ],
  });
};
