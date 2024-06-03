const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async member => {
  const webhookMessage = {
    content: `<@&1227001001567981578> ${member}`,
    embeds: [
      {
        description: "╭ »TØKŬMÊİ\n╎    ・💎  ↦ #・﹒kurallar Okumayı unutma!\n╎ ・ 🌊↦ ⁠#二・🍂﹒kendini・tanıt Kendini tanıtabilirsin..\n╎ ・👑 ↦ #四・﹒renk・al Renklerini Seç?\n╰ » Hadi İyi Sohbetler",
        color: null,
        author: {
          name: "Hoşgeldin !"
        },
        footer: {
          text: `Seninle birlikte ${member.guild.memberCount} kişi olduk!`
        },
        image: {
          url: "https://media.discordapp.net/attachments/1203665979096174632/1204130220588662874/Baslksz13_20240205212323.png?ex=665b6728&is=665a15a8&hm=9097845214dd0941949389c7532090346896036278cdf28dbbd92bcfb8c1b694&format=webp&quality=lossless&"
        }
      }
    ],
    attachments: []
  };

  try {
    await axios.post(WEBHOOK_URL, webhookMessage);
    console.log('Webhook başarıyla gönderildi!');
  } catch (error) {
    console.error('Webhook gönderilirken hata oluştu:', error);
  }
});

client.login(TOKEN);
