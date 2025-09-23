const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
┏━━━━━━━━━━━━━━━┓
   ⚡ ${settings.botName || 'SasukeBot-MD'} ⚡
   Version: ${settings.version || '2.0.5'}
   Owner: ${settings.botOwner || 'Tamim'}
   YT: ${global.ytch}
┗━━━━━━━━━━━━━━━┛

✨ *Available Commands* ✨

🌀 General
• .help / .menu
• .ping | .alive
• .tts <text> | .owner
• .joke | .quote | .fact
• .weather <city> | .news
• .attp <text> | .lyrics <song>
• .8ball <q> | .groupinfo
• .staff | .vv | .trt <txt> <lang>
• .ss <link> | .jid

🛡️ Admin
• .ban @user | .promote @user
• .demote @user | .mute <min>
• .unmute | .delete | .kick @user
• .warnings @user | .warn @user
• .antilink | .antibadword | .clear
• .tag <msg> | .tagall | .chatbot
• .resetlink | .welcome on/off
• .goodbye on/off

👑 Owner
• .mode | .autostatus | .clearsession
• .antidelete | .cleartmp
• .setpp <img> | .autoreact

🎨 Sticker / Image
• .blur <img> | .simage
• .sticker <img> | .tgsticker <link>
• .meme | .take <packname>
• .emojimix <em1>+<em2>

🎮 Games
• .tictactoe @user | .hangman
• .guess <letter> | .trivia
• .answer <ans> | .truth | .dare

🤖 AI
• .gpt <q> | .gemini <q>
• .imagine <prompt> | .flux <prompt>

🎯 Fun
• .compliment @user | .insult @user
• .flirt | .shayari | .goodnight
• .roseday | .character @user
• .wasted @user | .ship @user
• .simp @user | .stupid @user [txt]

🔤 Textmaker
• .metallic | .ice | .snow
• .impressive | .matrix | .light
• .neon | .devil | .purple
• .thunder | .leaves | .1917
• .arena | .hacker | .sand
• .blackpink | .glitch | .fire

📥 Downloader
• .play <song> | .song <song>
• .instagram <link> | .facebook <link>
• .tiktok <link> | .video <song>
• .ytmp4 <link>

💻 Github
• .git | .github | .sc | .script | .repo

━━━━━━━━━━━━━━━━━━━
🔔 Join our channel for updates!
`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '0029VaZb8IQ9mrGc8tGETf2i@newsletter',
                        newsletterName: 'SasukeBot MD',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '0029VaZb8IQ9mrGc8tGETf2i@newsletter',
                        newsletterName: 'SasukeBot MD by Tamim',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
