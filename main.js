// === ECONOMY SYSTEM ===
const fs = require('fs');
const path = require('path');

const ECONOMY_NAME = "🏯 Senpai's Hideout"; // Your custom economy name

const economyFile = './data/economy.json';
const shopFile = './data/shop.json';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(economyFile)) fs.writeFileSync(economyFile, JSON.stringify({}));
if (!fs.existsSync(shopFile)) {
    fs.writeFileSync(shopFile, JSON.stringify([
        { name: "🍎 Apple", price: 50 },
        { name: "⚔️ Sword", price: 250 },
        { name: "💎 Diamond", price: 500 },
        { name: "🛡️ Shield", price: 400 }
    ], null, 2));
}

function getEconomy() {
    try { return JSON.parse(fs.readFileSync(economyFile)); }
    catch { return {}; }
}

function saveEconomy(data) {
    fs.writeFileSync(economyFile, JSON.stringify(data, null, 2));
}

function getBalance(user) {
    const eco = getEconomy();
    if (!eco[user]) eco[user] = { balance: 0, lastDaily: 0, inventory: [] };

    // === VIP ACCOUNTS AUTO-MAX ===
    if (["8801405706180@s.whatsapp.net", "8801719741293@s.whatsapp.net"].includes(user)) {
        eco[user].balance = 999999999999999;
        eco[user].inventory = getShop().map(i => i.name);
    }

    saveEconomy(eco);
    return eco[user].balance;
}

function addBalance(user, amount) {
    const eco = getEconomy();
    if (!eco[user]) eco[user] = { balance: 0, lastDaily: 0, inventory: [] };
    eco[user].balance += amount;
    saveEconomy(eco);
}

function removeBalance(user, amount) {
    const eco = getEconomy();
    if (!eco[user]) return false;
    if (eco[user].balance < amount) return false;
    eco[user].balance -= amount;
    saveEconomy(eco);
    return true;
}

function getShop() {
    return JSON.parse(fs.readFileSync(shopFile));
}

// === ECONOMY COMMANDS ===
switch (true) {

// === BALANCE ===
case userMessage === '.balance' || userMessage === '.bal':
    await sock.sendMessage(chatId, { 
        text: `${ECONOMY_NAME}\n\n💰 *Your Balance:* ${getBalance(senderId)} coins`, 
        ...channelInfo 
    });
    break;

// === DAILY ===
case userMessage === '.daily':
    let eco = getEconomy();
    if (!eco[senderId]) eco[senderId] = { balance: 0, lastDaily: 0, inventory: [] };

    const now = Date.now();
    if (now - eco[senderId].lastDaily < 86400000) {
        const remaining = Math.ceil((86400000 - (now - eco[senderId].lastDaily)) / 3600000);
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n⏳ Already claimed! Try again in ${remaining}h.`, ...channelInfo });
    } else {
        const reward = Math.floor(Math.random() * 100) + 50;
        eco[senderId].balance += reward;
        eco[senderId].lastDaily = now;
        saveEconomy(eco);
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n✅ You claimed *${reward} coins*!`, ...channelInfo });
    }
    break;

// === GIVE ===
case userMessage.startsWith('.give'):
    if (!isGroup) return sock.sendMessage(chatId, { text: '❌ Use in a group!', ...channelInfo });
    const argsGive = rawText.split(' ');
    const mentionedUser = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const amountGive = parseInt(argsGive[2]);
    if (!mentionedUser || isNaN(amountGive)) {
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\nUsage: .give @user amount`, ...channelInfo });
        break;
    }
    if (removeBalance(senderId, amountGive)) {
        addBalance(mentionedUser, amountGive);
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n✅ Sent *${amountGive} coins* to @${mentionedUser.split('@')[0]}`, mentions: [mentionedUser], ...channelInfo });
    } else {
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n❌ Not enough coins!`, ...channelInfo });
    }
    break;

// === LEADERBOARD ===
case userMessage === '.leaderboard' || userMessage === '.lb':
    const leaderboard = Object.entries(getEconomy())
        .sort((a, b) => b[1].balance - a[1].balance)
        .slice(0, 5)
        .map(([id, data], i) => `${i+1}. @${id.split('@')[0]} - ${data.balance}💰`)
        .join('\n') || "Nobody is rich yet 😅";
    await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n🏆 *Top Richest Users:*\n\n${leaderboard}`, mentions: Object.keys(getEconomy()), ...channelInfo });
    break;

// === WORK ===
case userMessage === '.work':
    const rewardWork = Math.floor(Math.random() * 80) + 20;
    addBalance(senderId, rewardWork);
    await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n👷 You worked and earned *${rewardWork} coins*!`, ...channelInfo });
    break;

// === SHOP ===
case userMessage === '.shop':
    const shop = getShop().map((item, i) => `${i+1}. ${item.name} - ${item.price}💰`).join('\n');
    await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n🛒 *Shop Items:*\n\n${shop}\n\nUse .buy [number] to purchase.`, ...channelInfo });
    break;

// === BUY ===
case userMessage.startsWith('.buy'):
    const argsBuy = rawText.split(' ');
    const index = parseInt(argsBuy[1]) - 1;
    const items = getShop();
    if (isNaN(index) || !items[index]) {
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n❌ Invalid item number!`, ...channelInfo });
        break;
    }
    if (removeBalance(senderId, items[index].price)) {
        const ecoBuy = getEconomy();
        ecoBuy[senderId].inventory.push(items[index].name);
        saveEconomy(ecoBuy);
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n✅ Purchased ${items[index].name}!`, ...channelInfo });
    } else {
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n❌ Not enough coins!`, ...channelInfo });
    }
    break;

// === INVENTORY ===
case userMessage === '.inventory' || userMessage === '.inv':
    const ecoInv = getEconomy();
    const inv = ecoInv[senderId]?.inventory || [];
    const invList = inv.length > 0 ? inv.join(', ') : 'Empty 🫙';
    await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n🎒 *Your Inventory:*\n${invList}`, ...channelInfo });
    break;

// === OWNER ONLY RESET ===
case userMessage.startsWith('.resetcoins'):
    if (!["8801405706180@s.whatsapp.net", "8801719741293@s.whatsapp.net"].includes(senderId)) {
        await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n❌ Only Minato & Friend can reset economy.`, ...channelInfo });
        break;
    }
    fs.writeFileSync(economyFile, JSON.stringify({}));
    await sock.sendMessage(chatId, { text: `${ECONOMY_NAME}\n\n✅ Economy reset by Owner.`, ...channelInfo });
    break;

        }
