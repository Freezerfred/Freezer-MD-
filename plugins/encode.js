'use strict';

const { cmd } = require('../arslan');

cmd({
    pattern: 'encode',
    name: 'encode',
    category: 'Tools',
    description: 'Encode or decode text',
    aliases: ['base64', 'b64'],
    filename: __filename
}, async (sock, m, args) => {

    try {

        const mode = (args[0] || '').toLowerCase();
        const text = args.slice(1).join(' ').trim();

        if (!['encode', 'decode'].includes(mode) || !text) {
            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔐 *ENCODER*
┃
┃ Usage:
┃ .encode encode Hello World
┃ .encode decode SGVsbG8=
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        let result;

        if (mode === 'encode') {
            result = Buffer.from(text, 'utf8').toString('base64');
        } else {
            result = Buffer.from(text, 'base64').toString('utf8');
        }

        if (!result) {
            throw new Error('Empty result');
        }

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔐 *${mode.toUpperCase()}*
┃
┃ 📝 *Input:*
┃ ${text.substring(0, 300)}
┃
┃ ✅ *Result:*
┃ ${result.substring(0, 500)}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Encode Error:',
            error.message
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *Invalid input*
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
