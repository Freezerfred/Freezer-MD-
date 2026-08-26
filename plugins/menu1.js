'use strict';

const axios = require('axios');
const fs = require('fs');

const { cmd } = require('../arslan');

cmd({
    pattern: 'menu1',
    name: 'menu1',
    hidden: true,
    description: 'Show available Freezer-MD commands',
    aliases: ['help', 'cmdlist', 'commands'],
    filename: __filename
}, async (sock, m) => {

    const prefix = global.BOT_PREFIX || '.';

    // ─────────────────────────────────────────────
    // DATE & TIME
    // ─────────────────────────────────────────────

    const now = new Date();

    const date = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
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
    // BOT INFORMATION
    // ─────────────────────────────────────────────

    const botOwner = global.ownerName || '🥶 Freezer 🥶';

    const user =
        m.pushName ||
        m.sender?.split('@')[0] ||
        'User';

    const uptimeSec = process.uptime();

    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = Math.floor(uptimeSec % 60);

    const uptimeStr =
        `${hours}h ${minutes}m ${seconds}s`;

    const ramStr =
        `${(
            process.memoryUsage().rss /
            1024 /
            1024
        ).toFixed(2)}MB`;

    // ─────────────────────────────────────────────
    // FREEZER-MD DESIGN
    // ─────────────────────────────────────────────

    const CAP = '❄️';

    const TOP =
        `╭━━━━━━━━━━━━━━━━━━━━${CAP}`;

    const MID =
        `┣━━━━━━━━━━━━━━━━━━━━${CAP}`;

    const BOT =
        `╰━━━━━━━━━━━━━━━━━━━━${CAP}`;

    // ─────────────────────────────────────────────
    // CATEGORIES
    // ─────────────────────────────────────────────

    const CATEGORY_ORDER = [
        'General',
        'Downloaders',
        'Tools',
        'AI',
        'Fun',
        'Group',
        'Status',
        'Channel',
        'Admin'
    ];

    const CATEGORY_ICONS = {
        General: '⚡',
        Downloaders: '📥',
        Tools: '🛠️',
        AI: '🧠',
        Fun: '🎮',
        Group: '👥',
        Status: '📡',
        Channel: '📢',
        Admin: '👑'
    };

    // ─────────────────────────────────────────────
    // LOAD PLUGINS
    // ─────────────────────────────────────────────

    const grouped = {};
    const seen = new Set();

    let totalPlugins = 0;

    if (global.plugins instanceof Map) {

        const uniquePlugins =
            new Set(global.plugins.values());

        totalPlugins =
            uniquePlugins.size;

        for (const plugin of uniquePlugins) {

            if (!plugin || !plugin.name) {
                continue;
            }

            if (plugin.hidden) {
                continue;
            }

            if (seen.has(plugin.name)) {
                continue;
            }

            seen.add(plugin.name);

            const category =
                plugin.category || 'General';

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push(
                `${prefix}${plugin.name}`
            );
        }
    }

    // ─────────────────────────────────────────────
    // BUILD CATEGORIES
    // ─────────────────────────────────────────────

    const allCategories = [
        ...CATEGORY_ORDER.filter(
            category => grouped[category]
        ),

        ...Object.keys(grouped).filter(
            category =>
                !CATEGORY_ORDER.includes(category)
        )
    ];

    const commandSections =
        allCategories.map(category => {

            const icon =
                CATEGORY_ICONS[category] || '📂';

            const commands =
                grouped[category]
                    .sort((a, b) =>
                        a.localeCompare(b)
                    )
                    .map(command =>
                        `┃ ❄️ ${command}`
                    )
                    .join('\n');

            return `
${TOP}
┃ ${icon} *${category.toUpperCase()}*
${MID}
${commands}
${BOT}`;

        }).join('\n');

    // ─────────────────────────────────────────────
    // MENU
    // ─────────────────────────────────────────────

    const menuText = `
${TOP}
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗* ❄️
┃ *𝗠𝗨𝗟𝗧𝗜 𝗗𝗘𝗩𝗜𝗖𝗘*
┃
${MID}
┃ 👑 *Owner:* ${botOwner}
┃ 👤 *User:* ${user}
┃ 🧩 *Plugins:* ${totalPlugins}
┃ ⚡ *Uptime:* ${uptimeStr}
┃ 📅 *Date:* ${date}
┃ 🕐 *Time:* ${time}
┃ 📊 *RAM:* ${ramStr}
┃ 🔧 *Prefix:* ${prefix}
┃
${BOT}

${commandSections}

${TOP}
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
┃
${BOT}

> ❄️ *𝗙𝗔𝗦𝗧 • 𝗦𝗧𝗔𝗕𝗟𝗘 • 𝗣𝗢𝗪𝗘𝗥𝗙𝗨𝗟*
> *𝗕𝗨𝗜𝗟𝗧 𝗗𝗜𝗙𝗙𝗘𝗥𝗘𝗡𝗧.*
`.trim();

    // ─────────────────────────────────────────────
    // MENU IMAGE — REQUIRED
    // ─────────────────────────────────────────────

    try {

        if (!global.menuImage) {
            throw new Error(
                'global.menuImage is not configured'
            );
        }

        const imageBuffer =
            /^https?:\/\//i.test(global.menuImage)

                ? (
                    await axios.get(
                        global.menuImage,
                        {
                            responseType:
                                'arraybuffer',
                            timeout: 10000
                        }
                    )
                ).data

                : fs.readFileSync(
                    global.menuImage
                );

        // ─────────────────────────────────────────
        // SEND MENU IMAGE
        // ─────────────────────────────────────────

        await m.reply(
            imageBuffer,
            {
                caption: menuText
            }
        );

    } catch (error) {

        console.error(
            '❄️ Freezer-MD Menu Error:',
            error.message
        );
    }
});
