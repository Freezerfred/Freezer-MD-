'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

const API = 'https://api.azbry.com/api/download/tiktok';

cmd({
    pattern: 'tiktok',
    name: 'tiktok',
    category: 'Downloaders',
    description: 'Download TikTok videos',
    aliases: ['tt', 'tikdl'],
    tags: ['download'],
    command: /^\.?(tiktok|tt|tikdl)$/i,
    filename: __filename
}, async (sock, m, args) => {

    const prefix = global.BOT_PREFIX || '.';
    const url = args[0];

    if (!url) {
        return m.reply(
            `❄️ *FREEZER-MD*\n\n` +
            `╭━━━〔 🎵 TIKTOK 〕\n` +
            `┃\n` +
            `┃ Send a TikTok video link.\n` +
            `┃\n` +
            `┃ ❄️ ${prefix}tiktok <url>\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━`
        );
    }

    if (!/https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com/i.test(url)) {
        return m.reply('❌ *Invalid TikTok link.*');
    }

    try {
        await m.reply('⏳ *Freezer-MD is processing your TikTok...*');

        const { data } = await axios.get(API, {
            params: { url },
            timeout: 20000
        });

        if (!data?.status || !data?.download?.nowm) {
            throw new Error('No downloadable video was returned.');
        }

        const videoUrl = data.download.nowm;

        await sock.sendMessage(m.from, {
            video: { url: videoUrl },
            caption:
                `╭━━━〔 ❄️ FREEZER-MD 〕\n` +
                `┃\n` +
                `┃ 🎵 *TIKTOK DOWNLOADER*\n` +
                `┃\n` +
                `┃ ✅ Download complete\n` +
                `┃ 📥 No watermark\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━\n` +
                `> *Freezer-MD • Downloaders*`
        }, { quoted: m });

    } catch (err) {
        console.error('Freezer TikTok Error:', err.message);

        await m.reply(
            `❌ *FREEZER-MD*\n\n` +
            `Unable to download this TikTok.\n` +
            `Please check the link and try again.`
        );
    }
});
