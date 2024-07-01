const {
  Client,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { genEmbed } = require("../../utils/Embed");

module.exports = {
  name: "kayıt",
  aliases: [
    "k",
    "kayit",
    "man",
    "erkek",
    "e",
    "kadın",
    "kız",
    "kiz",
    "kadin",
    "boy",
    "woman",
    "girl",
    "gacı",
    "amlı",
    "taşşaklı",
  ],
  usage: "kayıt <@takachi/ID>",
  description: ".",
  category: "kayıt",
  Extend: true,

  /**
   * @param {Client} client
   */
  onLoad: function (client) {},

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<String>} args
   */
  onRequest: async function (client, message, args) {
    try {
      if (
        !global.config.roller.teyitciRolleri.some((x) =>
          message.member.roles.cache.get(x),
        ) &&
        !message.member.permissions.has("Administrator")
      )
        return false;
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!member) return message.reply({ content: "Üye belirt." });
      if (
        message.member.roles.highest.position <= member.roles.highest.position
      )
        return message
          .reply("Bu kullanıcının yetkisi senden üstün.")
          .then((x) => {
            setTimeout(() => {
              x.delete().catch((err) => {});
            }, 5000);
          });
      if (
        global.config.roller.erkekRolleri.some((x) =>
          member.roles.cache.has(x),
        ) ||
        global.config.roller.kadınRolleri.some((x) => member.roles.cache.has(x))
      )
        return message
          .reply(
            "Kullanıcının kayıt verileri bulunuyor, .kayıtsız komutuyla kayıtsıza atıp tekrar kayıt edin. eğer cinsiyet hatası yapılmış ise .cinsiyet @kullanıcı komutunu kullanarak cinsiyetini değiştirebilirsiniz.",
          )
          .then((x) => {
            setTimeout(() => {
              x.delete().catch((err) => {});
            }, 5000);
          });
      if (member.user.bot)
        return message
          .reply("Botlar ne zamandan beri kayıt ediliyor?")
          .then((x) => {
            setTimeout(() => {
              x.delete().catch((err) => {});
            }, 5000);
          });
      args = args.filter((a) => a !== "" && a !== " ").splice(1);
      let setName;
      let isim = args
        .filter((arg) => isNaN(arg))
        .map(
          (arg) => arg.charAt(0).replace("i", "İ").toUpperCase() + arg.slice(1),
        )
        .join(" ");
      if (!isim)
        return message
          .reply(
            `Belirtilen argümanlar geçersiz olduğu için devam edilemiyor. ${message.guild.emojiGöster(emojiler.Iptal)}`,
          )
          .then((s) => setTimeout(() => s.delete().catch((err) => {}), 5000));
      let yaş = args.find((arg) => !isNaN(arg));
      if (global.config.main.isimyaş && !yaş)
        return message
          .reply(
            `Belirtilen argümanlar geçersiz olduğu için devam edilemiyor. ${message.guild.emojiGöster(emojiler.Iptal)}`,
          )
          .then((s) => setTimeout(() => s.delete().catch((err) => {}), 5000));
      if (global.config.main.isimyaş && yaş < 16)
        return message
          .reply("Yaşınız 16 dan küçük olduğu için kayıt tamamlanamıyor.")
          .then((x) => {
            setTimeout(() => {
              x.delete();
            }, 5000);
          });
      if (
        (global.config.main.taglıalım &&
          !member.user.globalName.includes(global.config.main.tag) &&
          !member.roles.cache.get(global.config.roller.vipRolü)) ||
        (global.config.main.taglıalım &&
          !member.user.globalName.includes(global.config.main.tag) &&
          !member.roles.cache.get(global.config.roller.boosterRolü))
      )
        return message
          .reply({
            content:
              "Sunucumuz taglı alımdadır, kayıt olabilmesi için tagımızı alması veya booster yada vip rolüne sahip olması gerekli.",
          })
          .then((x) => {
            setTimeout(() => {
              x.delete();
            }, 5000);
          });
      if (global.config.main.isimyaş) {
        setName = `${isim} | ${yaş}`;
      } else if (!global.config.main.isimyaş) {
        setName = `${isim}`;
      }
      const response = global.httpClient.get(
        `http://localhost:1555/api/user?id=${member.user.id}`,
      );
      const data = response.data;
      const gerçekisim = data.base.topName;
      const gerçekyaş = data.base.topAge;
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder({
          style: ButtonStyle.Primary,
          custom_id: "man",
          label: "Erkek",
          emoji: {
            id: message.guild.emojiGöster(global.config.emojiler.erkek),
          },
        }),
        new ButtonBuilder({
          style: ButtonStyle.Secondary,
          custom_id: "woman",
          label: "Kadın",
          emoji: {
            id: message.guild.emojiGöster(global.config.emojiler.kadın),
          },
        }),
        new ButtonBuilder({
          style: ButtonStyle.Danger,
          custom_id: "iptal",
          emoji: {
            id: message.guild.emojiGöster(global.config.emojiler.iptal),
          },
        }),
      );
      const embed = new genEmbed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `${member} kullanıcısının ismini ${setName} olarak değiştirildi, Alttaki butonlardan cinsiyetini belirleyebilirsiniz, ${(gerçekisim = null ? "" : gerçekisim !== isim ? `\n\nNOT: Bu kullanıcının diğer sunucularda bulunan en çok verisi **${gerçekisim}** Bunu göz önüne alarak kayıt edin. ${(gerçekyaş = null ? "" : gerçekyaş !== yaş ? `En çok bulunan yaş verisi ise ${gerçekyaş}.` : "")}` : "")}`,
        );
      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });
      setTimeout(() => {
        msg.delete;
      }, 15 * 1000);
      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 15 * 1000,
        componentType: ComponentType.Button,
      });
      collector.on("collect", async (i) => {
        if (i.customId === "man") {
          const embed = new genEmbed()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member} kullanıcısı başarıyla **Erkek** olarak kayıt edildi.`,
            );
          let kayitPuani = db.get(`${message.author.id}.kayıtpuan.erkek`) || 0;
          global.db.set(`${message.author.id}.kayıtpuan.erkek`, kayitPuani + 1);
          member.setNickname(
            `${global.config.main.taglı ? (member.user.globalName.includes(global.config.main.tag) ? global.config.main.tag + " " : global.config.main.tagsiz ? global.config.main.tagsiz + " " : global.config.main.tag || "") : ``}${setName}`,
          );
          member.register(isim, yaş, "Erkek", message.author.id);
          msg.edit({
            embeds: [embed],
          });
        }
        if (i.customId === "woman") {
          const embed = new genEmbed()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member} kullanıcısı başarıyla **Kadın** olarak kayıt edildi.`,
            );
          let kayitPuani = db.get(`${message.author.id}.kayıtpuan.kadın`) || 0;
          global.db.set(`${message.author.id}.kayıtpuan.kadın`, kayitPuani + 1);
          member.setNickname(
            `${global.config.main.taglı ? (member.user.globalName.includes(global.config.main.tag) ? global.config.main.tag + " " : global.config.main.tagsiz ? global.config.main.tagsiz + " " : global.config.main.tag || "") : ``}${setName}`,
          );
          member.register(isim, yaş, "Kadın", message.author.id);
          msg.edit({
            embeds: [embed],
          });
        }
        if (i.customId === "iptal") {
          i.deferUpdate();
          msg.delete().catch((err) => {});
        }
      });
    } catch (err) {
      global.logger.error("Bir hata oluştu" + err);
    }
  },
};
