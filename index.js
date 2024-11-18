require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages
  ]
});

// Sadece bu sunucuda çalışmasını istediğiniz sunucu ID'si
const ALLOWED_GUILD_ID = '1213531797925920768'; // Bu satırı kendi sunucu ID'nizle güncelleyin

// Express uygulaması oluştur
const app = express();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Bot çalışıyor!');
});

// Belirtilen port üzerinden sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});

// Önceki davetleri saklamak için bir harita (map) oluşturuyoruz
const invites = new Map();

client.once('ready', async () => {
  console.log(`Bot başarıyla giriş yaptı: ${client.user.tag}`);

  // Her sunucudaki davetleri önceden kaydediyoruz
  const guild = client.guilds.cache.get(ALLOWED_GUILD_ID);
  if (guild) {
    const firstInvites = await guild.invites.fetch();
    invites.set(guild.id, new Map(firstInvites.map(invite => [invite.code, invite.uses])));
  } else {
    console.error('Bot belirtilen sunucuda bulunamadı!');
  }
});

// Yeni bir üye sunucuya katıldığında
client.on('guildMemberAdd', async member => {
  if (member.guild.id !== ALLOWED_GUILD_ID) return; // Diğer sunuculardan gelen istekleri yok say

  const cachedInvites = invites.get(member.guild.id);
  const newInvites = await member.guild.invites.fetch();

  // Davetleri karşılaştırarak hangi davet kodunun kullanıldığını buluyoruz
  const usedInvite = newInvites.find(invite => cachedInvites.get(invite.code) < invite.uses);
  invites.set(member.guild.id, new Map(newInvites.map(invite => [invite.code, invite.uses])));

  const inviter = usedInvite ? usedInvite.inviter : null;
  const inviteLink = usedInvite ? `https://discord.gg/${usedInvite.code}` : 'Bilinmiyor';

  const channelId = '1307374268316782715'
  if (channel) {
    // Embed mesajını oluştur
    const embed = new EmbedBuilder()
      .setTitle(`Sunucuya Hoşgeldin ${member.user.username}`)
      .setDescription(
        `╭ »Bushi 仌 Anime & Manga & Destek\n` +
        `╎ ・<:anime_blanket:1278827611921055826>  ↦ ⁠・﹒ [Kurallar](https://discord.com/channels/1213531797925920768/1280180106832121906) - kuralları okumayı unutma!\n` +
        `╎ ・ <:focacomfy:1272421146544963646> ↦ ⁠⁠二・🍂﹒ [Selam Chat](https://discord.com/channels/1213531797925920768/1307374268316782715)\n` +
        `╎ ・<:sei_iciyorum:1272428797395996744>  ↦ ⁠ ⁠ <#1307374278437769306> - Kendini Tanıt\n` +
        `╎ ・<:emoji_102:1273396150514221076>  ↦ ⁠・﹒ <@&1307374072161898596> - Partnerlik için geldiysen etiketleyebilirsin..\n` +
        `╰ » Hadi Sana İyi Sohbetler`
      )
      .setColor(null) // Renk belirtilmemiş
      .addFields([
        {
          name: 'Davet Eden=',
          value: inviter ? `Seni ${inviter.tag} Davet Etti.\nDavet linki: ${inviteLink}` : 'Davet eden ve link bulunamadı.'
        }
      ])
      .setAuthor({ name: 'Yeni Üye Düştü' })
      .setFooter({ text: `Sunucu ${member.guild.memberCount} Kişi` })
      .setImage('https://cdn.discordapp.com/attachments/1123948349326893076/1308119220835450970/5G8d3z9.gif?ex=673cc875&is=673b76f5&hm=47128b96986e97e89cc4fadfac2dfeea0bccb748d779b33c48a5cb8d3a6d7dd3&');

    // Metin mesajını gönder
    channel.send({
      content: `Sunucuya Hoşgeldin ${member} <@&1308118499931066439>`,
      embeds: [embed]
    });
  }
});

client.login(process.env.TOKEN);
