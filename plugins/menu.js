'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

cmd({
    pattern: 'menu',
    name: 'menu',
    category: 'General',
    hidden: true,
    aliases: ['help', 'cmdlist', 'commands'],
    description: 'Display the Freezer-MD command center',
    filename: __filename
}, async (sock, m) => {

    const prefix = global.BOT_PREFIX || '.';
    const botOwner = global.ownerName || '🥶 Freezer 🥶';

    const user =
        m.pushName ||
        m.sender?.split('@')[0] ||
        'User';

    const channelUrl =
        'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U';

    // ─────────────────────────────────────────
    // DATE & TIME
    // ─────────────────────────────────────────

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

    // ─────────────────────────────────────────
    // SYSTEM
    // ─────────────────────────────────────────

    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeText =
        `${hours}h ${minutes}m ${seconds}s`;

    const ram =
        `${(
            process.memoryUsage().rss /
            1024 /
            1024
        ).toFixed(2)} MB`;

    // ─────────────────────────────────────────
    // MENU DESIGN
    // ─────────────────────────────────────────

    const TOP =
        '╭━━━〔 ❄️ FREEZER-MD 〕';

    const MID =
        '┣━━━━━━━━━━━━━━━━━━━━';

    const BOT =
        '╰━━━━━━━━━━━━━━━━━━━━';

    // ─────────────────────────────────────────
    // CATEGORIES
    // ─────────────────────────────────────────

    const CATEGORY_ORDER = [
        'General',
        'Downloaders',
        'Tools',
        'AI',
        'Media',
        'Fun',
        'Group',
        'Security',
        'Status',
        'Channel',
        'Admin',
        'Owner'
    ];

    const CATEGORY_ICONS = {
        General: '⚡',
        Downloaders: '📥',
        Tools: '🔧',
        AI: '🤖',
        Media: '🎨',
        Fun: '🎮',
        Group: '👥',
        Security: '🛡️',
        Status: '📡',
        Channel: '📢',
        Admin: '⚙️',
        Owner: '👑'
    };

    // ─────────────────────────────────────────
    // LOAD PLUGINS
    // ─────────────────────────────────────────

    const grouped = {};
    const seen = new Set();

    let totalPlugins = 0;

    if (global.plugins instanceof Map) {

        const uniquePlugins =
            new Set(global.plugins.values());

        totalPlugins = uniquePlugins.size;

        for (const plugin of uniquePlugins) {

            if (!plugin || !plugin.name) {
                continue;
            }

            // Hidden commands stay hidden
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

    // ─────────────────────────────────────────
    // ORDER CATEGORIES
    // ─────────────────────────────────────────

    const categories = [
        ...CATEGORY_ORDER.filter(
            category => grouped[category]
        ),

        ...Object.keys(grouped).filter(
            category =>
                !CATEGORY_ORDER.includes(category)
        )
    ];

    // ─────────────────────────────────────────
    // BUILD COMMAND SECTIONS
    // ─────────────────────────────────────────

    const commandSections = categories
        .map(category => {

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

            return `${TOP}
┃ ${icon} *${category.toUpperCase()}*
${MID}
${commands}
${BOT}`;

        })
        .join('\n\n');

    // ─────────────────────────────────────────
    // MENU
    // ─────────────────────────────────────────

    const menuText = `
${TOP}
┃
┃       ❄️ *FREEZER-MD* ❄️
┃
┃   *ADVANCED WHATSAPP BOT*
┃
${MID}
┃
┃ 👑 *OWNER:* ${botOwner}
┃ 👤 *USER:* ${user}
┃ 🧩 *PLUGINS:* ${totalPlugins}
┃ 🚀 *UPTIME:* ${uptimeText}
┃ 📅 *DATE:* ${date}
┃ 🕐 *TIME:* ${time}
┃ 💾 *RAM:* ${ram}
┃ ⚙️ *PREFIX:* ${prefix}
┃
${BOT}

${commandSections}

${TOP}
┃
┃ 📢 *OFFICIAL CHANNEL*
┃
┃ Follow Freezer-MD for:
┃
┃ 🚀 New updates
┃ 🧩 New plugins
┃ 🔥 Exclusive features
┃ 🛠️ Tutorials & fixes
┃
┃ 🔗 ${channelUrl}
┃
${BOT}

> ❄️ *FREEZER-MD*
> *POWERED BY ADVANCED TECHNOLOGY*
> *BUILT DIFFERENT.*
`.trim();

    // ─────────────────────────────────────────
    // SEND MENU
    // ─────────────────────────────────────────

    try {

        if (!global.menuImage) {
            throw new Error(
                'global.menuImage is not configured'
            );
        }

        const image =
            (
                await axios.get(
                    global.menuImage,
                    {
                        responseType: 'arraybuffer',
                        timeout: 10000
                    }
                )
            ).data;

        await m.reply(image, {
            caption: menuText,

            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,

                forwardedNewsletterMessageInfo: {
                    newsletterJid:
                        '120363426778975572@newsletter',

                    newsletterName:
                        '❄️ FREEZER-MD ❄️',

                    serverMessageId: 1
                }
            }
        });

    } catch (err) {

        console.error(
            '❌ Freezer-MD Menu Error:',
            err.message
        );

        // Text fallback
        await m.reply(menuText)
            .catch(error =>
                console.error(
                    '❌ Menu fallback error:',
                    error.message
                )
            );
    }
});
