'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'alive',
    name: 'alive',
    category: 'General',
    aliases: ['online', 'status'],
    description: 'Check Freezer-MD system status',
    filename: __filename
}, async (sock, m) => {

    try {
        const prefix = global.BOT_PREFIX || '.';
        const botName = global.ownerName || '❄️ Freezer 🥶';

        const uptime = process.uptime();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeText =
            `${hours}h ${minutes}m ${seconds}s`;

        const memory =
            process.memoryUsage().rss / 1024 / 1024;

        const ram =
            `${memory.toFixed(2)} MB`;

        const pluginCount =
            global.plugins instanceof Map
                ? new Set(global.plugins.values()).size
                : 0;

        const start = Date.now();

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃       *SYSTEM ONLINE*
┃
┃ 🟢 STATUS
┃ └─ ONLINE
┃
┃ ⚡ RESPONSE
┃ └─ Testing...
┃
┃ 🚀 UPTIME
┃ └─ ${uptimeText}
┃
┃ 💾 MEMORY
┃ └─ ${ram}
┃
┃ 🧩 PLUGINS
┃ └─ ${pluginCount}
┃
┃ 👑 OWNER
┃ └─ ${botName}
┃
╰━━━━━━━━━━━━━━━━━━━━━━
> ❄️ *POWERED BY FREEZER-MD*`
        );

        const latency = Date.now() - start;

        await sock.sendMessage(
            m.from,
            {
                text:
                    `⚡ *Response:* ${latency}ms`,
            },
            { quoted: m }
        );

    } catch (err) {

        console.error(
            '❌ Freezer Alive Error:',
            err
        );

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *SYSTEM CHECK FAILED*
┃
┃ ${String(
                err.message || err
            ).substring(0, 150)}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        ).catch(() => {});
    }
});
