'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

cmd({
    pattern: 'qr',
    name: 'qr',
    category: 'Tools',
    description: 'Generate a QR code from text or URL',
    aliases: ['qrcode'],
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
┃ 📱 *QR GENERATOR*
┃
┃ Usage:
┃ .qr Hello Freezer
┃ .qr https://example.com
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        const url =
            `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 15000
        });

        await m.reply(
            Buffer.from(response.data),
            {
                caption:
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 📱 *QR CODE READY*
┃
┃ 📝 *Content:*
┃ ${text.substring(0, 200)}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            }
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] QR Error:',
            error.message
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *QR generation failed*
┃
┃ Try again shortly.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
