```javascript
'use strict';

const { sendInteractiveMessage } = require('gifted-btns');
const { cmd } = require('../arslan');

cmd({
    pattern: 'ping',
    name: 'ping',
    category: 'General',
    description: 'Measure Freezer-MD response speed',
    aliases: ['pong', 'latency'],
    filename: __filename
}, async (sock, m) => {

    try {

        // ─────────────────────────────────────────────
        // REAL RESPONSE MEASUREMENT
        // ─────────────────────────────────────────────

        const start = process.hrtime.bigint();

        const response = await sock.sendMessage(m.from, {
            text: '❄️ *FREEZER-MD* • Checking response...'
        });

        const end = process.hrtime.bigint();

        const ms = Math.max(
            1,
            Math.round(
                Number(end - start) / 1_000_000
            )
        );

        // ─────────────────────────────────────────────
        // RESPONSE STATUS
        // ─────────────────────────────────────────────

        const status =
            ms <= 150 ? '⚡ Excellent' :
            ms <= 400 ? '🚀 Fast' :
            ms <= 800 ? '🟢 Stable' :
            '🟡 Slow';

        // ─────────────────────────────────────────────
        // FREEZER-MD DESIGN
        // ─────────────────────────────────────────────

        const TOP =
            '╭━━━━━━━━━━━━━━━━━━━━❄️';

        const MID =
            '┣━━━━━━━━━━━━━━━━━━━━❄️';

        const BOT =
            '╰━━━━━━━━━━━━━━━━━━━━❄️';

        const pingText =
`${TOP}
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
┃
${MID}
┃ 🏓 *Pong:* ${ms}ms
┃ 📡 *Status:* ${status}
┃
${BOT}

❄️ *FAST • STABLE • POWERFUL*
> *BUILT DIFFERENT.*`;

        // ─────────────────────────────────────────────
        // EDIT ORIGINAL MESSAGE
        // ─────────────────────────────────────────────

        try {

            await sock.sendMessage(
                m.from,
                {
                    text: pingText,
                    edit: response.key
                }
            );

        } catch (editError) {

            // Some Baileys versions do not support
            // editing messages in this format.
            // Send the result instead.

            await m.reply(pingText);
        }

        // ─────────────────────────────────────────────
        // VIEW CHANNEL
        // ─────────────────────────────────────────────

        await sendInteractiveMessage(
            sock,
            m.from,
            {
                title: '❄️ FREEZER-MD',

                text:
                    '📢 Stay updated with Freezer-MD releases, updates and new features.',

                footer:
                    '❄️ Freezer-MD • Built Different',

                interactiveButtons: [
                    {
                        name: 'cta_url',

                        buttonParamsJson:
                            JSON.stringify({
                                display_text:
                                    '📢 View Channel',

                                url:
                                    'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U'
                            })
                    }
                ]
            }
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Ping Error:',
            error
        );

        const TOP =
            '╭━━━━━━━━━━━━━━━━━━━━❄️';

        const BOT =
            '╰━━━━━━━━━━━━━━━━━━━━❄️';

        await m.reply(
`${TOP}
┃
┃ ❄️ *𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗*
┃
┃ ❌ *Ping failed*
┃
┃ ${error?.message || 'Unknown error'}
┃
${BOT}`
        );
    }
});
```
