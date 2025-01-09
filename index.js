require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const express = require('express');
const axios = require('axios'); // HTTP istekleri için axios

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Sadece bu sunucuda çalışmasını istediğiniz sunucu ID'si
const ALLOWED_GUILD_ID = '1213531797925920768'; // Bu satırı kendi sunucu ID'nizle güncelleyin
const VOICE_CHANNEL_ID = '1324341431514562600';

// Express uygulaması oluştur
const app = express();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Bot çalışıyor!');
});

// Uptime URL'sine belirli aralıklarla istek gönderme
function checkUptime() {
  setInterval(() => {
    axios.get(process.env.LINK)
      .then(response => {
        
      })
      .catch(error => {
        console.error('Uptime URL\'sine bağlantı hatası:', error);
      });
  }, 30000); // 10 dakika (600000 ms)
}

// Bot giriş yaptıktan sonra yapılacak işlemler
client.once('ready', () => {
  console.log(`Bot giriş yaptı: ${client.user.tag}`);

  // Uptime URL kontrolünü başlat
  checkUptime();

  // Express sunucusunu başlat
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
  });

  // Sunucuya bağlanma işlemleri
  const guild = client.guilds.cache.get(ALLOWED_GUILD_ID);
  
  if (!guild) {
    console.log('Sunucu bulunamadı!');
    return;
  }
  
  const voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  
  if (!voiceChannel) {
    console.log('Ses kanalı bulunamadı!');
    return;
  }
  
  console.log(`Kanal adı: ${voiceChannel.name}`);
  console.log(`Kanal türü: ${voiceChannel.type}`);
  
  // Kanal türünü kontrol et
  if (voiceChannel.type === 2) { // `GUILD_VOICE` = 2
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    console.log(`Bot ${voiceChannel.name} kanalına bağlandı ve kalacak.`);
  } else {
    console.log('Geçerli bir ses kanalı değil!');
  }
});

// Sunucuda ses kanalında kalmayı sağlamak için event listener
client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.channelId === VOICE_CHANNEL_ID) {
    // Eğer bot ses kanalından ayrılırsa tekrar bağlanması için
    if (!newState.channel || newState.member.id === client.user.id) {
      joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: newState.guild.id,
        adapterCreator: newState.guild.voiceAdapterCreator,
      });
    }
  }
});

// Davetleri takip et ve yeni üyeleri karşıla
const invites = new Map();
client.once('ready', async () => {
  console.log(`Bot başarıyla giriş yaptı: ${client.user.tag}`);

  const guild = client.guilds.cache.get(ALLOWED_GUILD_ID);
  if (guild) {
    const firstInvites = await guild.invites.fetch();
    invites.set(guild.id, new Map(firstInvites.map(invite => [invite.code, invite.uses])));
  } else {
    console.error('Bot belirtilen sunucuda bulunamadı!');
  }
});

client.on('guildMemberAdd', async member => {
  if (member.guild.id !== ALLOWED_GUILD_ID) return;

  const cachedInvites = invites.get(member.guild.id);
  const newInvites = await member.guild.invites.fetch();

  const usedInvite = newInvites.find(invite => cachedInvites.get(invite.code) < invite.uses);
  invites.set(member.guild.id, new Map(newInvites.map(invite => [invite.code, invite.uses])));

  const inviter = usedInvite ? usedInvite.inviter : null;
  const inviteLink = usedInvite ? `https://discord.gg/${usedInvite.code}` : 'Bilinmiyor';

  const channel = member.guild.channels.cache.get('1318535711477075988');

  if (channel) {
    const embed = new EmbedBuilder()
      .setTitle(`Sunucuya Hoşgeldin ${member.user.username}`)
      .setDescription(
        `╭ »Bushi 仌 Anime & Manga & Destek\n` +
        `╎ ・<:anime_blanket:1278827611921055826>  ↦ ⁠・﹒ [Kurallar](https://discord.com/channels/1213531797925920768/1324341287394087014) - kuralları okumayı unutma!\n` +
        `╎ ・ <:focacomfy:1272421146544963646> ↦ ⁠⁠二・🍂﹒ [Selam Chat](https://discord.com/channels/1213531797925920768/1324341303953330176)\n` +
        `╎ ・<:sei_iciyorum:1272428797395996744>  ↦ ⁠ ⁠ <#1324341292901339146> - Çekiliş Varmı Bah Hele\n` +
        `╎ ・<:emoji_102:1273396150514221076>  ↦ ⁠・﹒ <@&1324341361159180308> - Partnerlik için rollerini alabilirsin..\n` +
        `╰ » Hadi Sana İyi Sohbetler`
      )
      .setColor(null)
      .addFields([
        {
          name: 'Davet Eden=',
          value: inviter ? `Seni ${inviter.tag} Davet Etti.\nDavet linki: ${inviteLink}` : 'Davet eden ve link bulunamadı.'
        }
      ])
      .setAuthor({ name: 'Yeni Üye Düştü' })
      .setFooter({ text: `Sunucu ${member.guild.memberCount} Kişi` })
      .setImage('https://cdn.discordapp.com/attachments/1123948349326893076/1308126305526743141/NQ9tE5t.png?ex=673ccf0f&is=673b7d8f&hm=2bd1ffc49368489c236ff832906c917892a0efea0d55a9d89ad4816d26df8950&');

    channel.send({
      content: `Sunucuya Hoşgeldin ${member} <@&1304018054295982162>`,
      embeds: [embed]
    });
  } else {
    console.error('Belirtilen kanal bulunamadı!');
  }
});

client.login(process.env.TOKEN);
