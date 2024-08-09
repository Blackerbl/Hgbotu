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
    const channel = member.guild.channels.cache.get('1177975094581149791'); // Karşılama mesajı göndermek istediğiniz kanalın ID'si
    if (!channel) return;

    const welcomeMessage = {
        content: `Aramıza Hoşgeldin <:3712zerotwoheartlove:1241389409585074206> ${member}  <@&1270293476398993418>`,
        embeds: [
            {
                title: "Hoşgeldin",
                description: `╭ »TENGOKU\n╎ ・<a:1794_sparkles:1241374294890643487>  ↦ ⁠・﹒ <#1177975089283731556> - kurallar Okumayı unutma!\n╎ ・ <a:4165_Hyped_ZeroTwo:1241374320912240701> ↦ ⁠⁠二・🍂﹒ <#1178051348537823355> - Kendini tanıtabilirsin..\n╎ ・<a:9770animepat:1251507026694246401>  ↦ ⁠ ⁠ <#1178266906256482385> - Renklerini Seç ve rollerini al!Hoşgeldin !\n╎ ・<a:lavendalove:1241483165403709581>  ↦ ⁠・﹒ <@&1241109140001001653>  - Partnerlik için geldiysen etiketleyebilirsin..\n╰ » Hadi Sana İyi Sohbetler`,
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
