const mineflayer = require("mineflayer")
const config = require("./config.json")
const logging = require("./util/logging");
const { setupDiscordBot, sendInGameMessages } = require("./util/chathook");

const banner = `
 _______  __   __  _______  _______  _______  ______    ___   ______   _______  _______ 
|       ||  | |  ||   _   ||       ||  _    ||    _ |  |   | |      | |       ||       |
|       ||  |_|  ||  |_|  ||_     _|| |_|   ||   | ||  |   | |  _    ||    ___||    ___|
|       ||       ||       |  |   |  |       ||   |_||_ |   | | | |   ||   | __ |   |___ 
|      _||       ||       |  |   |  |  _   | |    __  ||   | | |_|   ||   ||  ||    ___|
|     |_ |   _   ||   _   |  |   |  | |_|   ||   |  | ||   | |       ||   |_| ||   |___ 
|_______||__| |__||__| |__|  |___|  |_______||___|  |_||___| |______| |_______||_______|
`

const bot = mineflayer.createBot({
  host: config.server.host,
  port: config.server.port,
  username: config.botName,
  auth: config.server.auth
});

const directions = ['forward', 'back', 'left', 'right']
let currentDirection = null


bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  if (config.livechat_console){
    logging(`<${username}> ${message}`)
  }

  if (message === config.logingMessage){
    bot.chat(`/login ${config.botPassword}`)
  }
  const player = bot.players[username];
  const player_uuid = player?.uuid || 'null';
  setupDiscordBot.sendInGameMessages(username, player_uuid, message)
  
});

bot.once('spawn', async () => {
  logging(banner)
  logging(`El bot se a conectado al server: ${config.server.host}:${config.server.port}`)
  await setupDiscordBot.onDiscordReady;
  setupDiscordBot.sendInGameMessages(config.botName, '9a5d1cd9-9ea5-4e7d-a440-a1d795de0997', `El bot a entrado al servidor: ${config.server.host}:${config.server.port}`)

    setInterval(() => {
    if (currentDirection) bot.setControlState(currentDirection, false)

    currentDirection = directions[Math.floor(Math.random() * directions.length)]
    bot.setControlState(currentDirection, true)

    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random() - 0.5) * Math.PI / 3
    bot.look(yaw, pitch, true)

    if (Math.random() < 0.5) {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)
    }


    if (Math.random() < 0.3) {
      bot.swingArm('right')
    }

  }, Math.random() * 3000 + 5000) 

});

bot.once('end', () => {
    logging(`El bot a salido del servidor: ${config.server.host}:${config.server.port}`)
    setupDiscordBot.sendInGameMessages(config.botName, '9a5d1cd9-9ea5-4e7d-a440-a1d795de0997', `El bot a salido del servidor: ${config.server.host}:${config.server.port}`)
});

//bot.on('playerJoined', (player) => {
//  setupDiscordBot.playerJoinedMessages(player.username, player.uuid);
//}); 

//bot.on('playerLeft', (player) => {
//  setupDiscordBot.playerLeftMessages(player.username, player.uuid);
//});


setupDiscordBot.setMinecraftBot(bot);
