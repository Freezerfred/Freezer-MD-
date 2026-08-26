'use strict';

const axios = require('axios');
const { promises: fs } = require('fs');
const { cmd } = require('../arslan');

cmd({
    pattern: 'menu',
    name: 'menu',
    hidden: true,
    description: 'Show available Freezer-MD commands',
    aliases: ['help', 'cmdlist', 'commands'],
    filename: __filename
}, async (sock, m) => {

    try {
        // ─────────────────────────────────────────────
        // 1. PREFIX
        // ─────────────────────────────────────────────
        const prefix = global.BOT_PREFIX || '.';

        // ─────────────────────────────────────────────
        // 2. DATE & TIME (Nairobi)
        // ─────────────────────────────────────────────
        const now = new Date();
        const date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'Africa/Nairobi'
        });
        const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Africa/Nairobi'
        });

        // ─────────────────────────────────────────────
        // 3. BOT INFO & USER
        // ─────────────────────────────────────────────
        const botName = global.BOT_NAME || 'FREEZER-MD';
        const botOwner = global.ownerName || '🥶 Freezer 🥶';
        const user = m.pushName || m.sender?.split('@')[0] || 'User';

        // ─────────────────────────────────────────────
        // 4. UPTIME (days, hours, minutes, seconds)
        // ─────────────────────────────────────────────
        const uptimeSec = Math.floor(process.uptime());
        const days = Math.floor(uptimeSec / 86400);
        const hours = Math.floor((uptimeSec % 86400) / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const seconds = uptimeSec % 60;

        const uptimeParts = [];
        if (days) uptimeParts.push(`${days}d`);
        if (hours) uptimeParts.push(`${hours}h`);
        if (minutes) uptimeParts.push(`${minutes}m`);
        uptimeParts.push(`${seconds}s`);
        const uptimeStr = uptimeParts.join(' ');

        // ─────────────────────────────────────────────
        // 5. RAM
        // ─────────────────────────────────────────────
        const ramStr = `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`;

        // ─────────────────────────────────────────────
        // 6. BORDER LINES – now ending with ❄️
        // ─────────────────────────────────────────────
        const TOP = '╔══════════════════════ ❄️';
        const MID = '╠══════════════════════ ❄️';
        const BOTTOM = '╚══════════════════════ ❄️';

        // ─────────────────────────────────────────────
        // 7. CATEGORIES & ICONS (only for category titles)
        // ─────────────────────────────────────────────
        const CATEGORY_ORDER = [
            'General', 'Downloaders', 'Tools', 'AI', 'Fun',
            'Group', 'Status', 'Channel', 'Admin', 'Owner', 'Security'
        ];

        const CATEGORY_ICONS = {
            General: '⚡', Downloaders: '📥', Tools: '🛠️', AI: '🤖',
            Fun: '🎮', Group: '👥', Status: '📡', Channel: '📢',
            Admin: '👑', Owner: '🔐', Security: '🛡️'
        };

        // ─────────────────────────────────────────────
        // 8. LOAD & GROUP PLUGINS
        // ─────────────────────────────────────────────
        const grouped = {};
        const seen = new Set();
        let totalPlugins = 0;

        if (global.plugins instanceof Map) {
            const uniquePlugins = new Set(global.plugins.values());
            for (const plugin of uniquePlugins) {
                if (!plugin || !plugin.name || plugin.hidden) continue;
                const pluginName = String(plugin.name).trim();
                if (!pluginName) continue;

                const uniqueKey = pluginName.toLowerCase();
                if (seen.has(uniqueKey)) continue;
                seen.add(uniqueKey);

                const category = String(plugin.category || 'General').trim();
                if (!grouped[category]) grouped[category] = [];
                grouped[category].push(pluginName);
                totalPlugins++;
            }
        }

        // ─────────────────────────────────────────────
        // 9. BUILD CATEGORY SECTIONS
        // ─────────────────────────────────────────────
        const allCategories = [
            ...CATEGORY_ORDER.filter(cat => grouped[cat]?.length),
            ...Object.keys(grouped).filter(cat =>
                !CATEGORY_ORDER.includes(cat) && grouped[cat]?.length
            )
        ];

        let commandSections = '';
        if (totalPlugins === 0) {
            commandSections = `
${TOP}
║ 📭 *NO COMMANDS LOADED*
${BOTTOM}`;
        } else {
            commandSections = allCategories.map(category => {
                const catIcon = CATEGORY_ICONS[category] || '📂';
                const commands = grouped[category]
                    .sort((a, b) => a.localeCompare(b))
                    .map(cmdName => {
                        // ❄️ used before every command – dynamic icons removed
                        return `║ ❄️ ${prefix}${cmdName}`;
                    })
                    .join('\n');

                return `
${TOP}
║ ${catIcon} *${category.toUpperCase()}*
${MID}
${commands}
${BOTTOM}`;
            }).join('\n');
        }

        // ─────────────────────────────────────────────
        // 10. FINAL MENU TEXT
        // ─────────────────────────────────────────────
        const menuText = `
${TOP}
║ 🥶 *${botName}*
${MID}
║ 👑 *OWNER:* ${botOwner}
║ 👤 *USER:* ${user}
║ 🧩 *PLUGINS:* ${totalPlugins}
║ ⚡ *UPTIME:* ${uptimeStr}
║ 📅 *DATE:* ${date}
║ 🕐 *TIME:* ${time}
║ 📊 *RAM:* ${ramStr}
║ 🔧 *PREFIX:* ${prefix}
${BOTTOM}

${commandSections}

${TOP}
║ 🥶 *${botName}*
${MID}
║ 🚀 *FAST • STABLE • POWERFUL*
║ 💠 *POWERED BY FREEZER*
║ ❄️ *BUILT DIFFERENT*
${BOTTOM}
`.trim();

        // ─────────────────────────────────────────────
        // 11. SEND – IMAGE OR TEXT ONLY
        // ─────────────────────────────────────────────
        if (!global.menuImage) {
            return await m.reply(menuText);
        }

        let imageBuffer = null;

        try {
            if (/^https?:\/\//i.test(global.menuImage)) {
                const response = await axios.get(global.menuImage, {
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    maxContentLength: 10 * 1024 * 1024,
                    maxBodyLength: 10 * 1024 * 1024
                });
                imageBuffer = Buffer.from(response.data);
            } else {
                await fs.access(global.menuImage);
                imageBuffer = await fs.readFile(global.menuImage);
            }

            if (!imageBuffer || imageBuffer.length === 0) {
                throw new Error('Empty image buffer');
            }

            await m.reply(imageBuffer, { caption: menuText });

        } catch (imgError) {
            console.error('[FREEZER-MD] Menu image failed:', imgError.message);
            await m.reply(menuText);
        }

    } catch (error) {
        console.error('[FREEZER-MD] Menu command error:', error);
        try {
            await m.reply(`❌ *Menu Error*\n\n${error.message}`);
        } catch (_) { /* ignore */ }
    }
});
