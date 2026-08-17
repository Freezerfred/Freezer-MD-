'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

cmd({
    pattern: 'shorturl',
    name: 'shorturl',
    category: 'Tools',
    description: 'Shorten a long URL',
    aliases: ['short', 'tinyurl'],
    filename: __filename
}, async (sock, m, args) => {

    try {

        const url = args.join(' ').trim();

        if (!url) {
            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔗 *URL SHORTENER*
┃
┃ Usage:
┃ .shorturl https://example.com
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        if (!/^https?:\/\/\S+$/i.test(url)) {
            return m.reply('❌ *Please provide a valid URL.*');
        }

        const response = await axios.get(
            'https://tinyurl.com/api-create.php',
            {
                params: { url },
                timeout: 15000,
                responseType: 'text'
            }
        );

        const shortUrl = String(response.data).trim();

        if (!/^https?:\/\/\S+$/i.test(shortUrl)) {
            throw new Error('Short URL was not returned');
        }

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔗 *URL SHORTENER*
┃
┃ 📎 *Original:*
┃ ${url}
┃
┃ ⚡ *Short URL:*
┃ ${shortUrl}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] ShortURL Error:',
            error.message
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *Shortening failed*
┃
┃ Try again shortly.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
