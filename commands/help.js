const os = require("os");

module.exports = {
  name: "menu",
  alias: ["help"],
  desc: "Show all commands",
  run: async (conn, m, settings) => {
    try {
      // uptime
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

      // RAM usage
      const used = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
      const total = (os.totalmem() / 1024 / 1024).toFixed(2);

      // header block
      const header = `
*╭══〘〘 ${settings.botName || "SasukeBot-MD"} 〙〙*
*┃❍ ʀᴜɴ     :* ${uptimeStr}
*┃❍ ᴍᴏᴅᴇ    :* ${settings.mode || "Public"}
*┃❍ ᴘʀᴇғɪx  :* [.,!]
*┃❍ ʀᴀᴍ     :* ${used} / ${total} MB
*┃❍ ᴠᴇʀsɪᴏɴ :* ${settings.version || "2.0.5"}
*┃❍ ᴜsᴇʀ    :* ${settings.botOwner || "Tamim"}
*╰═════════════════⊷*
      `;

      // help message block
      const helpMessage = `
╭───────────────────╮
│ ⚡ ${settings.botName || "SasukeBot-MD"} ⚡
│ Version : ${settings.version || "2.0.5"}
│ Owner   : ${settings.botOwner || "Tamim"}
│ YT      : ${global.ytch || "Not set"}
╰───────────────────╯

✨ *Command List* ✨

🌐 General  
› .help / .menu | .ping | .alive  
› .tts <text> | .owner  
› .joke | .quote | .fact  
› .weather <city> | .news  
› .attp <text> | .lyrics <song>  
› .8ball <q> | .groupinfo | .staff  
› .vv | .trt <text> <lang>  
› .ss <link> | .jid  

🛡️ Admin  
› .ban @user | .promote @user  
› .demote @user | .mute <min> | .unmute  
› .delete | .kick @user | .warn @user  
› .warnings @user | .antilink | .antibadword  
› .clear | .tag <msg> | .tagall  
› .chatbot | .resetlink | .welcome on/off  
› .goodbye on/off  

👑 Owner  
› .mode | .autostatus | .clearsession  
› .antidelete | .cleartmp  
› .setpp <img> | .autoreact  

🎨 Sticker / Image  
› .blur <img> | .simage | .sticker <img>  
› .tgsticker <link> | .meme | .take <pack>  
› .emojimix <em1>+<em2>  

🎮 Games  
› .tictactoe @user | .hangman  
› .guess <letter> | .trivia | .answer <ans>  
› .truth | .dare  

🤖 AI  
› .gpt <q> | .gemini <q>  
› .imagine <prompt> | .flux <prompt>  

🎯 Fun  
› .compliment @user | .insult @user | .flirt  
› .shayari | .goodnight | .roseday  
› .character @user | .wasted @user  
› .ship @user | .simp @user | .stupid @user  

🔤 Textmaker  
› .metallic | .ice | .snow | .impressive  
› .matrix | .light | .neon | .devil
      `;

      // send
      await conn.sendMessage(m.chat, { text: header + "\n" + helpMessage }, { quoted: m });

    } catch (e) {
      console.error(e);
      conn.sendMessage(m.chat, { text: "❌ Error showing menu!" }, { quoted: m });
    }
  }
};
