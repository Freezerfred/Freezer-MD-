const axios = require('axios');
const fs = require('fs');
const { sendInteractiveMessage } = require('gifted-btns');

const { cmd } = require('../arslan');

cmd({
    pattern: "menu",
    name: 'menu',
    hidden: true,
    description: 'Show available bot commands',
    aliases: ['help', 'cmdlist', 'commands'],
    filename: __filename
}, async (sock, m) => {    
    const prefix = global.BOT_PREFIX || '.';    
    
    const now = new Date();
    
    const date = now.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'Africa/Accra'
    });
    
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true,
        timeZone: 'Africa/Accra'
    });
    
    const botOwner = global.ownerName || 'Freezer';
    
    const user = m.pushName || m.sender?.split('@')[0] || 'User';

    const uptimeSec = process.uptime();
    const uh = Math.floor(uptimeSec / 3600);
    const um = Math.floor((uptimeSec % 3600) / 60);
    const us = Math.floor(uptimeSec % 60);
    const uptimeStr = `${uh}h ${um}m ${us}s`;

    const ramStr = `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`;

    // Box-drawing pieces + accent emoji
    const CAP = '❍';
    const TOP = `╭──═════════════${CAP}`;
    const MID = `╠──═════════════${CAP}`;
    const BOT = `╰──═════════════${CAP}`;

    // Auto-build the command list from loaded plugins
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
        General: '📜',
        Downloaders: '💼',
        Tools: '🛠️',
        AI: '🧠',
        Fun: '🎉',
        Group: '👥',
        Status: '📡',
        Channel: '📢',
        Admin: '👑'
    };

    const grouped = {};
    const seen = new Set();
    let totalPlugins = 0;

    if (global.plugins instanceof Map) {
        const uniquePlugins = new Set(global.plugins.values());
        totalPlugins = uniquePlugins.size;

        for (const plugin of global.plugins.values()) {
            if (!plugin || !plugin.name) continue;
            if (plugin.hidden) continue;
            if (seen.has(plugin.name)) continue;

            seen.add(plugin.name);

            const category = plugin.category || 'General';

            if (!grouped[category]) {
                grouped[category] = [];
            }

            grouped[category].push(`${prefix}${plugin.name}`);
        }
    }

    const allCategories = [
        ...CATEGORY_ORDER.filter(c => grouped[c]),
        ...Object.keys(grouped).filter(
            c => !CATEGORY_ORDER.includes(c)
        )
    ];

    const commandSections = allCategories.map(category => {
        const icon = CATEGORY_ICONS[category] || '📂';

        const lines = grouped[category]
            .map(l => `║ ❍ ${l}`)
            .join('\n');

        return `${TOP}
║ ${icon} *${category.toUpperCase()}*
${MID}
║
${lines}
║
${BOT}`;
    }).join('\n\n');

    const menuText = `
${TOP}
║ ✨ 𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗 ✨
${MID}
║
║ 👤 𝗢𝗪𝗡𝗘𝗥: ${botOwner}
║ 🙋 𝗨𝗦𝗘𝗥: ${user}
║ 🚀 𝗣𝗟𝗨𝗚𝗜𝗡𝗦: ${totalPlugins}
║ ⏳ 𝗨𝗣𝗧𝗜𝗠𝗘: ${uptimeStr}
║ 📆 𝗗𝗔𝗧𝗘: ${date}
║ 📊 𝗥𝗔𝗠: ${ramStr}
║ 🔧 𝗣𝗥𝗘𝗙𝗜𝗫: ${prefix}
║
${BOT}

${commandSections}

*© Freezer-MD*
`.trim();

    try {

        if (!global.menuImage) {
            throw new Error('global.menuImage is not set');
        }

        const imageBuffer = /^https?:\/\//i.test(global.menuImage)
            ? (await axios.get(global.menuImage, {
                responseType: 'arraybuffer',
                timeout: 8000
            })).data
            : fs.readFileSync(global.menuImage);

        /*
         * Send menu image first
         */
        await m.reply(imageBuffer, {
            caption: menuText
        });

        /*
         * Send clickable View Channel button
         */
        await sendInteractiveMessage(sock, m.from, {
            title: '❄️ FREEZER-MD',
            text: '📢 Stay updated with the latest Freezer-MD news, updates and releases.',
            footer: '❄️ Freezer-MD • Advanced WhatsApp Bot',
            interactiveButtons: [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📢 View Channel',
                        url: 'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                    })
                }
            ]
        });

    } catch (err) {

        console.error(
            'Menu image error, falling back to text:',
            err.message
        );

        try {

            await m.reply(menuText);

            await sendInteractiveMessage(sock, m.from, {
                title: '❄️ FREEZER-MD',
                text: '📢 Follow the official Freezer-MD Channel for updates.',
                footer: '❄️ Freezer-MD',
                interactiveButtons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📢 View Channel',
                            url: 'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                        })
                    }
                ]
            });

        } catch (err2) {

            console.error(
                'Menu fallback error:',
                err2.message
            );

        }
    }
});
