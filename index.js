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

// Selam mesajını göndermek istediğiniz kanalın ID'si
const WELCOME_CHANNEL_ID = '1280180147814793276'; // Bu satırı kendi kanal ID'nizle güncelleyin

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

  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID); // Selam mesajını göndermek için belirtilen kanalı al
  if (channel) {
    // Embed mesajını oluştur
    const embed = new EmbedBuilder()
      .setTitle(`Sunucuya Hoşgeldin ${member.user.username}`)
      .setDescription(
        `╭ »Bushi 仌 Anime & Manga & Destek\n` +
        `╎ ・<:anime_blanket:1278827611921055826>  ↦ ⁠・﹒ [Kurallar](https://discord.com/channels/1213531797925920768/1280180106832121906) - kuralları okumayı unutma!\n` +
        `╎ ・ <:focacomfy:1272421146544963646> ↦ ⁠⁠二・🍂﹒ [Selam Chat](https://discord.com/channels/1213531797925920768/1280180147814793276)\n` +
        `╎ ・<:sei_iciyorum:1272428797395996744>  ↦ ⁠ ⁠ https://discord.com/channels/1213531797925920768/1280180141414416526 - Destek İçin \n` +
        `╎ ・<:emoji_102:1273396150514221076>  ↦ ⁠・﹒ <@&1280179928058429481> - Partnerlik için geldiysen etiketleyebilirsin..\n` +
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
      .setImage('https://cdn.discordapp.com/attachments/1278512248196694077/1280979568764649604/indir.jpg?ex=66da0cb0&is=66d8bb30&hm=a8eb1b0ae26a9d0e42037fb1b2a19e2467405759bcb79e478a9cc89291a0ee17&');

    // Embed mesajını göndermek için kanalı kullan
    channel.send({
      content: `Sunucuya Hoşgeldin ${member} <@&1280976845633880094>`,
      embeds: [embed]
    });
  }
});

client.login(process.env.TOKEN);
