'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'freezer',
    name: 'freezer',
    category: 'General',
    description: 'Display Freezer-MD bot information',
    aliases: ['info', 'about', 'version'],
    tags: ['main', 'system'],
    command: /^\.?(botinfo|info|about|version)$/i,
    filename: __filename
}, async (sock, m) => {

    try {
        const prefix = global.BOT_PREFIX || '.';
        const owner = global.ownerName || '🥶 Freezer 🥶';

        // ─────────────────────────────────────
        // BOT INFORMATION
        // ─────────────────────────────────────

        const botName = 'FREEZER-MD';
        const version = '1.0.0';
        const engine = 'Baileys';
        const platform = process.platform;
        const nodeVersion = process.version;

        // ─────────────────────────────────────
        // UPTIME
        // ─────────────────────────────────────

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeText =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // ─────────────────────────────────────
        // MEMORY
        // ─────────────────────────────────────

        const memory = process.memoryUsage();

        const ramUsed =
            (memory.rss / 1024 / 1024).toFixed(2);

        const heapUsed =
            (memory.heapUsed / 1024 / 1024).toFixed(2);

        // ─────────────────────────────────────
        // PLUGIN COUNT
        // ─────────────────────────────────────

        let pluginCount = 0;

        if (global.plugins instanceof Map) {
            pluginCount = new Set(
                global.plugins.values()
            ).size;
        }

        // ─────────────────────────────────────
        // CONNECTION STATUS
        // ─────────────────────────────────────

        let connection = 'ONLINE';

        try {
            if (!sock?.user?.id) {
                connection = 'CONNECTED';
            }
        } catch {
            connection = 'UNKNOWN';
        }

        // ─────────────────────────────────────
        // FREEZER-MD UI
        // ─────────────────────────────────────

        const infoText = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     ❄️ *FREEZER-MD* ❄️
┃     *BOT INFORMATION*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┏━━〔 🤖 BOT DETAILS 〕━━┓
┃
┃ 🧊 *NAME*
┃ └─ ${botName}
┃
┃ 📦 *VERSION*
┃ └─ ${version}
┃
┃ ⚙️ *ENGINE*
┃ └─ ${engine}
┃
┃ 👑 *OWNER*
┃ └─ ${owner}
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 📊 SYSTEM 〕━━┓
┃
┃ 🟢 *STATUS*
┃ └─ ${connection}
┃
┃ 🚀 *UPTIME*
┃ └─ ${uptimeText}
┃
┃ 🧩 *PLUGINS*
┃ └─ ${pluginCount}
┃
┃ 💾 *RAM*
┃ └─ ${ramUsed} MB
┃
┃ 🧠 *HEAP*
┃ └─ ${heapUsed} MB
┃
┃ 🟦 *NODE*
┃ └─ ${nodeVersion}
┃
┃ 💻 *PLATFORM*
┃ └─ ${platform}
┃
┃ ⚡ *PREFIX*
┃ └─ ${prefix}
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 🌐 FREEZER-MD 〕━━┓
┃
┃ 🛡️ Stable & Reliable
┃ ⚡ Fast Response Engine
┃ 🧩 Modular Plugin System
┃ 🔄 Easy Updates
┃ 🔐 Secure Session System
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

╭──────────────────────────╮
│ ❄️ *FREEZER-MD*
│ *POWERED BY FREEZER CORE*
╰──────────────────────────╯
`.trim();

        await m.reply(infoText);

    } catch (error) {

        console.error(
            '[FREEZER-MD] BotInfo Error:',
            error
        );

        try {
            await m.reply(
                '❌ *FREEZER-MD*\n\nUnable to retrieve bot information.'
            );
        } catch (fallbackError) {
            console.error(
                '[FREEZER-MD] BotInfo fallback error:',
                fallbackError
            );
        }
    }
});
