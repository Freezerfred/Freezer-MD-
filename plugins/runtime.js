'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'runtime',
    name: 'runtime',
    category: 'System',
    description: 'Show Freezer-MD uptime',
    aliases: ['uptime', 'up'],
    tags: ['system', 'main'],
    command: /^\.?(runtime|uptime|up)$/i,
    filename: __filename
}, async (sock, m) => {

    try {

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const memory = process.memoryUsage();

        const ram =
            (memory.rss / 1024 / 1024).toFixed(2);

        const runtimeText = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     ❄️ *FREEZER-MD*
┃     *SYSTEM RUNTIME*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┏━━〔 🚀 UPTIME 〕━━┓
┃
┃ 📅 DAYS
┃ └─ ${days}
┃
┃ ⏰ HOURS
┃ └─ ${hours}
┃
┃ ⏱️ MINUTES
┃ └─ ${minutes}
┃
┃ 🕐 SECONDS
┃ └─ ${seconds}
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 💾 MEMORY 〕━━┓
┃
┃ RAM USAGE
┃ └─ ${ram} MB
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

🟢 *FREEZER-MD IS ONLINE*
⚡ *RUNNING SMOOTHLY*
`.trim();

        await m.reply(runtimeText);

    } catch (error) {

        console.error(
            '[FREEZER-MD] Runtime Error:',
            error
        );

        try {
            await m.reply(
                '❌ Unable to retrieve Freezer-MD runtime.'
            );
        } catch {}
    }
});
