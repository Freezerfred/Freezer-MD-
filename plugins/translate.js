'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

cmd({
    pattern: 'translate',
    name: 'translate',
    category: 'Tools',
    description: 'Translate text into another language',
    aliases: ['tr', 'trans'],
    filename: __filename
}, async (sock, m, args) => {

    try {

        const text = args.join(' ').trim();

        if (!text) {
            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🌍 *TRANSLATOR*
┃
┃ Usage:
┃ .translate en Hello world
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        const parts = text.split(/\s+/);
        const target = parts.shift().toLowerCase();
        const message = parts.join(' ');

        if (!message) {
            return m.reply('❌ *Enter text to translate.*');
        }

        const response = await axios.get(
            'https://translate.googleapis.com/translate_a/single',
            {
                params: {
                    client: 'gtx',
                    sl: 'auto',
                    tl: target,
                    dt: 't',
                    q: message
                },
                timeout: 15000
            }
        );

        const result = response.data?.[0]
            ?.map(item => item?.[0])
            .filter(Boolean)
            .join('');

        if (!result) {
            throw new Error('Translation unavailable');
        }

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🌍 *TRANSLATION*
┃
┃ 📝 *Original:*
┃ ${message}
┃
┃ 🔤 *Language:* ${target.toUpperCase()}
┃
┃ ✅ *Result:*
┃ ${result}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Translate Error:',
            error.message
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *Translation failed*
┃
┃ Check the language code
┃ and try again.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
