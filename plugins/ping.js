'use strict';

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
        const start = process.hrtime.bigint();

        const sent = await sock.sendMessage(m.from, {
            text: '❄️ *FREEZER-MD*'
        });

        const end = process.hrtime.bigint();

        const ms = Math.max(
            1,
            Math.round(Number(end - start) / 1_000_000)
        );

        const status =
            ms <= 150 ? '⚡ EXCELLENT' :
            ms <= 400 ? '🚀 FAST' :
            ms <= 800 ? '🟢 STABLE' :
            '🟡 SLOW';

        const pingText =
`╭━━━〔 ❄️ 𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗 〕━━━╮
┃
┃   🏓 *𝗣𝗢𝗡𝗚*
┃
┣━━━━━━━━━━━━━━━━━━━━━━❄️
┃
┃ ⚡ Response : *${ms}ms*
┃ 📡 Status   : *${status}*
┃
┣━━━━━━━━━━━━━━━━━━━━━━❄️
┃
┃ ❄️ *𝗙𝗔𝗦𝗧 • 𝗦𝗧𝗔𝗕𝗟𝗘*
┃    *𝗕𝗨𝗜𝗟𝗧 𝗗𝗜𝗙𝗙𝗘𝗥𝗘𝗡𝗧*
┃
╰━━━━━━━━━━━━━━━━━━━━━━❄️`;

        try {
            await sock.sendMessage(m.from, {
                text: pingText,
                edit: sent.key
            });
        } catch (editError) {
            console.error(
                '[FREEZER-MD] Ping edit error:',
                editError.message
            );

            await m.reply(pingText);
        }

    } catch (error) {

        console.error(
            '[FREEZER-MD] Ping Error:',
            error
        );

        await m.reply(
`╭━━━〔 ❄️ 𝗙𝗥𝗘𝗘𝗭𝗘𝗥-𝗠𝗗 〕━━━╮
┃
┃ ❌ *𝗣𝗜𝗡𝗚 𝗙𝗔𝗜𝗟𝗘𝗗*
┃
┃ ${error?.message || 'Unknown error'}
┃
╰━━━━━━━━━━━━━━━━━━━━━━❄️`
        );
    }
});
