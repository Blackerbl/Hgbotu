require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000; // PORT'u .env dosyasından veya varsayılan olarak 3000 olarak ayarla

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});

client.once('ready', () => {
    console.log('Bot is online!');
});

// Sunucuya bir istek geldiğinde yanıt ver
app.get('/', (req, res) => {
    res.send('Bot çalışıyor!');
});

// Botu başlat
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get('1272806997342945284'); // Karşılama mesajı göndermek istediğiniz kanalın ID'si
    if (!channel) return;

    const welcomeMessage = {
        content: `Aramıza Hoşgeldin <:yes:1272441451543789641> ${member}  <@&1272845704858959935>`,
        embeds: [
            {
                title: "Hoşgeldin",
                description: `╭ »Keke 仌 Anime & Manga \n╎ ・<a:KOH:1272839412790591509>  ↦ ⁠・﹒ <#1272806996923650067> - kurallar Okumayı unutma!\n╎ ・ <a:kannaaglamak:1272813149246062643> ↦ ⁠⁠二・🍂﹒ <#1272806997342945289> - Kendini tanıtabilirsin..\n╎ ・<:wakuwaku:1242796320742445056>  ↦ ⁠ ⁠ <#1272806997342945284> - Selam Yaz\n╎ ・<:waw:1272837424703209605>  ↦ ⁠・﹒ <@&1272806996797689880>  - Partnerlik için geldiysen etiketleyebilirsin..\n╰ » Hadi Sana İyi Sohbetler`,
                color: null,
                author: {
                    name: `${member.user.username} Sunucuya İniş Yaptı`
                },
                image: {
                    url: "https://cdn.discordapp.com/attachments/1245412053506592870/1270294681334583361/15e7bdc6ebb30d2dd028ed52dfc5bbbb.gif?ex=66b32d9c&is=66b1dc1c&hm=d42b9a07f532cd8eb12aae3bd968cc9943b9d20d51d78ab58473bf22a49cc832&"
                },
                thumbnail: {
                    url: "https://cdn.discordapp.com/attachments/1245412053506592870/1270294681334583361/15e7bdc6ebb30d2dd028ed52dfc5bbbb.gif?ex=66b32d9c&is=66b1dc1c&hm=d42b9a07f532cd8eb12aae3bd968cc9943b9d20d51d78ab58473bf22a49cc832&"
                }
            }
        ],
        username: "Rias",
        avatar_url: "https://cdn.discordapp.com/attachments/1123948349326893076/1270294012200489032/rias-gremory-dxd-rias.gif?ex=66b32cfd&is=66b1db7d&hm=7ef57b68af3f06eaba053875edf28b1488bb85499298f2345fe8f573e36885b7&",
        attachments: []
    };

    channel.send(welcomeMessage);
});

// Botu başlat
client.login(process.env.DISCORD_TOKEN);

// Express sunucusunu başlat
app.listen(PORT, () => {
    console.log(`Express sunucusu ${PORT} portunda çalışıyor.`);
});
