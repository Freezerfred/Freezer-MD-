'use strict';

const axios = require('axios');
const { sendInteractiveMessage } = require('gifted-btns');
const { cmd } = require('../arslan');

cmd({
    pattern: 'menu',
    name: 'menu',
    hidden: true,
    description: 'Show Freezer-MD command center',
    aliases: ['help', 'cmdlist', 'commands'],
    filename: __filename
}, async (sock, m) => {

    const prefix = global.BOT_PREFIX || '.';

    const CHANNEL_URL =
        'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U';

    // ─────────────────────────────────────────────
    // FREEZER-MD INFO
    // ─────────────────────────────────────────────

    const user =
        m.pushName ||
        m.sender?.split('@')[0] ||
        'User';

    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    const uptimeText =
        `${hours}h ${minutes}m`;

    // ─────────────────────────────────────────────
    // MENU CATEGORIES
    // ─────────────────────────────────────────────

    const MENU_GROUPS = {
        General: {
            icon: '⚡',
            categories: [
                'General',
                'Status',
                'Channel'
            ]
        },

        Downloads: {
            icon: '📥',
            categories: [
                'Downloaders',
                'Download',
                'Media'
            ]
        },

        Tools: {
            icon: '🛠️',
            categories: [
                'Tools',
                'Utilities'
            ]
        },

        AI: {
            icon: '🤖',
            categories: [
                'AI'
            ]
        },

        Group: {
            icon: '👥',
            categories: [
                'Group',
                'Security'
            ]
        },

        Owner: {
            icon: '👑',
            categories: [
                'Admin',
                'Owner'
            ]
        }
    };

    // ─────────────────────────────────────────────
    // LOAD PLUGINS
    // ─────────────────────────────────────────────

    const grouped = {};
    const seen = new Set();

    if (global.plugins instanceof Map) {

        for (const plugin of new Set(global.plugins.values())) {

            if (!plugin?.name) continue;
            if (plugin.hidden) continue;

            const commandName =
                String(plugin.name).toLowerCase();

            if (seen.has(commandName)) continue;

            seen.add(commandName);

            const category =
                plugin.category || 'General';

            for (const [menuGroup, data] of Object.entries(MENU_GROUPS)) {

                if (data.categories.includes(category)) {

                    if (!grouped[menuGroup]) {
                        grouped[menuGroup] = [];
                    }

                    grouped[menuGroup].push(
                        `${prefix}${plugin.name}`
                    );

                    break;
                }
            }
        }
    }

    // ─────────────────────────────────────────────
    // BUILD MENU
    // ─────────────────────────────────────────────

    const sections = Object.entries(MENU_GROUPS)
        .map(([group, data]) => {

            const commands =
                (grouped[group] || [])
                    .sort((a, b) =>
                        a.localeCompare(b)
                    );

            if (!commands.length) return '';

            return (
                `${data.icon} *${group.toUpperCase()}*\n` +
                commands
                    .map(command => `┃ ❄️ ${command}`)
                    .join('\n')
            );

        })
        .filter(Boolean)
        .join('\n\n');

    // ─────────────────────────────────────────────
    // MENU TEXT
    // ─────────────────────────────────────────────

    const menuText = `
╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 👋 *Hello, ${user}*
┃
┃ 🚀 *ADVANCED WHATSAPP BOT*
┃ ⚡ *Fast • Stable • Powerful*
┃
┃ 🧩 *Commands:* ${seen.size}
┃ ⏱️ *Uptime:* ${uptimeText}
┃ 🔧 *Prefix:* ${prefix}
┃
╰━━━━━━━━━━━━━━━━━━━━━━

${sections}

╭━━━〔 📢 OFFICIAL CHANNEL 〕━━━╮
┃
┃ Stay updated with
┃ Freezer-MD releases & updates.
┃
╰━━━━━━━━━━━━━━━━━━━━━━

❄️ *FREEZER-MD*
> *BUILT DIFFERENT.*
`.trim();

    // ─────────────────────────────────────────────
    // SEND MENU IMAGE
    // ─────────────────────────────────────────────

    try {

        if (!global.menuImage) {
            throw new Error('global.menuImage is not set');
        }

        const imageBuffer = (
            await axios.get(
                global.menuImage,
                {
                    responseType: 'arraybuffer',
                    timeout: 8000
                }
            )
        ).data;

        await m.reply(imageBuffer, {
            caption: menuText
        });

    } catch (err) {

        console.error(
            '[FREEZER-MD] Menu image error:',
            err.message
        );

        await m.reply(menuText);
    }

    // ─────────────────────────────────────────────
    // INTERACTIVE BUTTONS
    // ─────────────────────────────────────────────

    try {

        await sendInteractiveMessage(
            sock,
            m.from,
            {
                title: '❄️ FREEZER-MD',
                text:
                    'Select a command section or join the official channel.',
                footer:
                    'FREEZER-MD • BUILT DIFFERENT',

                interactiveButtons: [

                    {
                        name: 'quick_reply',
                        buttonParamsJson:
                            JSON.stringify({
                                display_text: '⚡ General',
                                id: `${prefix}help General`
                            })
                    },

                    {
                        name: 'quick_reply',
                        buttonParamsJson:
                            JSON.stringify({
                                display_text: '📥 Downloads',
                                id: `${prefix}help Downloads`
                            })
                    },

                    {
                        name: 'quick_reply',
                        buttonParamsJson:
                            JSON.stringify({
                                display_text: '🛠️ Tools',
                                id: `${prefix}help Tools`
                            })
                    },

                    {
                        name: 'quick_reply',
                        buttonParamsJson:
                            JSON.stringify({
                                display_text: '🤖 AI',
                                id: `${prefix}help AI`
                            })
                    },

                    {
                        name: 'quick_reply',
                        buttonParamsJson:
                            JSON.stringify({
                                display_text: '👥 Group',
                                id: `${prefix}help Group`
                            })
                    },

                    {
                        name: 'quick_reply',
                        buttonParamsJson:
                            JSON.stringify({
                                display_text: '👑 Owner',
                                id: `${prefix}help Owner`
                            })
                    },

                    {
                        name: 'cta_url',
                        buttonParamsJson:
                            JSON.stringify({
                                display_text: '📢 View Channel',
                                url: CHANNEL_URL
                            })
                    }
                ]
            }
        );

    } catch (err) {

        console.error(
            '[FREEZER-MD] Interactive menu error:',
            err.message
        );

        // Channel link fallback
        await m.reply(
            `📢 *FREEZER-MD OFFICIAL CHANNEL*\n\n${CHANNEL_URL}`
        ).catch(() => {});
    }
});
