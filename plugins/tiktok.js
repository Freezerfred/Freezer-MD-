'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

const APIS = [
    {
        name: 'Azbry',
        get: url =>
            axios.get('https://api.azbry.com/api/download/tiktok', {
                params: { url },
                timeout: 15000
            }).then(r => r.data?.download?.nowm)
    },
    {
        name: 'TDown',
        get: url =>
            axios.get('https://tdownv4.sl-bjs.workers.dev/', {
                params: { down: url },
                timeout: 15000
            }).then(r => r.data?.download_url)
    }
];

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
            `╭━━━〔 ❄️ FREEZER-MD 〕\n` +
            `┃\n` +
            `┃ 🎵 *TIKTOK DOWNLOADER*\n` +
            `┃\n` +
            `┃ Usage:\n` +
            `┃ ${prefix}tiktok <TikTok URL>\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━`
        );
    }

    if (!/^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com/i.test(url)) {
        return m.reply('❌ *Please send a valid TikTok link.*');
    }

    try {
        await m.reply('⏳ *Downloading TikTok video...*');

        let videoUrl = null;

        for (const api of APIS) {
            try {
                videoUrl = await api.get(url);

                if (videoUrl && /^https?:\/\//i.test(videoUrl)) {
                    console.log(`✅ TikTok API: ${api.name}`);
                    break;
                }
            } catch (e) {
                console.log(`⚠️ ${api.name} failed: ${e.message}`);
            }
        }

        if (!videoUrl) {
            throw new Error('All TikTok download services failed.');
        }

        // Download the actual video
        const response = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            maxContentLength: 100 * 1024 * 1024,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Safari/537.36'
            }
        });

        const buffer = Buffer.from(response.data);

        if (!buffer.length) {
            throw new Error('Empty video received.');
        }

        await sock.sendMessage(
            m.from,
            {
                video: buffer,
                mimetype: 'video/mp4',
                caption:
                    `╭━━━〔 ❄️ FREEZER-MD 〕\n` +
                    `┃\n` +
                    `┃ 🎵 *TIKTOK DOWNLOADER*\n` +
                    `┃\n` +
                    `┃ ✅ Download complete\n` +
                    `┃ 📦 ${(buffer.length / 1024 / 1024).toFixed(2)} MB\n` +
                    `┃\n` +
                    `╰━━━━━━━━━━━━━━\n` +
                    `> *Freezer-MD • Downloaders*`
            },
            { quoted: m }
        );

    } catch (err) {
        console.error('❌ Freezer TikTok:', err.message);

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕\n` +
            `┃\n` +
            `┃ ❌ *DOWNLOAD FAILED*\n` +
            `┃\n` +
            `┃ The TikTok could not be downloaded.\n` +
            `┃ Try another TikTok link.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━`
        );
    }
});
