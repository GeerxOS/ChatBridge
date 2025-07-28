const { Client, GatewayIntentBits, EmbedBuilder, Embed } = require('discord.js');
const config = require("../config.json");
const logging = require("./logging");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

let discordChannel = null;
let minecraftBot = null;

let discordReadyResolve;
const onDiscordReady = new Promise((resolve) => {
    discordReadyResolve = resolve;
});

client.once('ready', async () => {
    logging(`[Discord] Conectado como ${client.user.tag}`);

    discordChannel = client.channels.cache.get(config.discordChannelId) 
        || await client.channels.fetch(config.discordChannelId).catch(() => null);

    if (!discordChannel){
        logging(`[Discord] No se encontro el canal: ${config.discordChannelId}`);
    } else {
        discordReadyResolve();
    }
});

client.on('messageCreate', (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.id !== config.discordChannelId) return;

    const content = msg.content.trim();

    if (!content.startsWith(config.botPrefix)) {
        const relayMessage = `[Discord] <${msg.author.username}> ${content}`;
        minecraftBot?.chat(relayMessage);
        return;
    }

    const args = content.slice(config.botPrefix.length).split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === "say") {
        const commandMessage = args.join(" ").trim();

        if (!minecraftBot) {
            msg.reply('El bot no está conectado');
            msg.react('❌');
            return;
        }

        if (!commandMessage) {
            msg.reply(`Uso correcto: \`${config.botPrefix}say <mensaje>\``);
            return;
        }

        minecraftBot.chat(commandMessage);
        msg.react('✅');
        return;
    }

    if (command === "players") {
        if (!minecraftBot || !minecraftBot.players) {
            msg.reply(`El bot no está conectado`);
            return;
        }

        const playersOnline = Object.values(minecraftBot.players)
            .filter(p => p.entity)
            .map(p => p.username);

        if (playersOnline.length === 0) {
            msg.reply("No hay jugadores conectados");
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`Jugadores en línea (${playersOnline.length})`)
                .setDescription(playersOnline.join(', '))
                .setColor('Blue')
                .setTimestamp();

            msg.reply({ embeds: [embed] });
        }
        return;
    }


});

client.login(config.discordBotToken);

function sendInGameMessages(username, playeruuid, message){
    if (!discordChannel){
        logging("[!] Canal de Discord aun no cargado.");
        return;
    }

    const inGameMessages = new EmbedBuilder()
        .setColor('White')
        .setAuthor({ name: username, iconURL: `https://render.skinmc.net/3d.php?user=${playeruuid}&vr=-10&hr0&hrh=25&aa=&headOnly=true&ratio=50`})
        //.setThumbnail(`https://render.skinmc.net/3d.php?user=${playeruuid}&vr=-10&hr0&hrh=25&aa=&headOnly=true&ratio=50`)
        .setDescription(`<${username}> ${message}`)
        .setTimestamp();

    discordChannel.send({ embeds: [inGameMessages] });
}

function playerJoinedMessages(username, playeruuid) {
    const playerJoinedEmbed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: username, iconURL: `https://render.skinmc.net/3d.php?user=${playeruuid}&vr=-10&hr0&hrh=25&aa=&headOnly=true&ratio=50`})
        .setDescription(`${username} a entrado al servidor.`)
        //.setThumbnail(`https://render.skinmc.net/3d.php?user=${playeruuid}&vr=-10&hr0&hrh=25&aa=&headOnly=true&ratio=50`)
        .setTimestamp();
    
    discordChannel.send({ embeds: [playerJoinedEmbed] });
}

function playerLeftMessages(username, playeruuid) {
    const playerLeftEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: username, iconURL: `https://render.skinmc.net/3d.php?user=${playeruuid}&vr=-10&hr0&hrh=25&aa=&headOnly=true&ratio=50`})
        .setDescription(`${username} a salido del servidor.`)
        //.setThumbnail(`https://render.skinmc.net/3d.php?user=${playeruuid}&vr=-10&hr0&hrh=25&aa=&headOnly=true&ratio=50`)
        .setTimestamp();
    
    discordChannel.send({ embeds: [playerLeftEmbed] });
}

function setMinecraftBot(botInstance){
    minecraftBot = botInstance;
}

module.exports = {
    setMinecraftBot,
    setupDiscordBot: {
        sendInGameMessages,
        playerJoinedMessages,
        playerLeftMessages,
        setMinecraftBot,
        onDiscordReady
    }
};
