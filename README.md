# ChatBridge 

Testeado en servidores anarquicos

## Ejemplo de como configurar el archivo 'config.json':

```json
{
    "botName": "ChatBridge", // Cambialo por el nombre que quieras
    "botPassword": "null", // Contraseña del bot
    "logingMessage": "", // Mensaje que te aparece en el servidor al momento de querer loguearte
    "server": {
        "host": "", // IP del servidor
        "port": "", // Puerto del servidor
        "auth": "" // offline para servidores no premium
    },
    "botPrefix": "", // Prefijo del bot para usar comandos
    "botOwner": "", // No necesario, no esta implementado
    "discordChannelId": "", // ID Del canal de discord donde se mandaran los mensajes del juego
    "discordBotToken": "", // Token de tu bot de discord para enviar los mensajes
    "livechat_console": true // Cambialo a "false" si no quieres que se muestren mensajes del juego en la terminal
}
```
