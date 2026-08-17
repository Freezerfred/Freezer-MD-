'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

const API = 'https://tdownv4.sl-bjs.workers.dev/';

cmd({
    pattern: 'tiktok',
    name: 'tiktok',
    category: 'Downloaders',
    description: 'Download TikTok videos',
    aliases: ['tt', 'tikdl'],
    filename: __filename
}, async (sock, m, args) => {

    const prefix = global.BOT_PREFIX || '.';
    const url = args[0];

    if (!url) {
        return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ 🎵 *TIKTOK DOWNLOADER*
┃
┃ Usage:
┃ ${prefix}tiktok <TikTok URL>
┃
╰━━━━━━━━━━━━━━`
        );
    }

    if (!/tiktok\.com/i.test(url)) {
        return m.reply('❌ Please provide a valid TikTok URL.');
    }

    try {
        await m.reply('⏳ *FREEZER-MD*\n\nDownloading TikTok...');

        const response = await axios.get(API, {
            params: { down: url },
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const data = response?.data;

        console.log(
            '🎵 TikTok API Response:',
            JSON.stringify(data, null, 2)
        );

        // Try common response formats
        const videoUrl =
            data?.download_url ||
            data?.url ||
            data?.video ||
            data?.video_url ||
            data?.data?.download_url ||
            data?.data?.url ||
            data?.data?.video ||
            data?.data?.video_url ||
            data?.result?.download_url ||
            data?.result?.url ||
            data?.result?.video;

        if (!videoUrl || typeof videoUrl !== 'string') {
            throw new Error('TikTok API returned no usable video URL.');
        }

        console.log('✅ TikTok Video URL:', videoUrl);

        const video = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            maxContentLength: 100 * 1024 * 1024,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!video?.data) {
            throw new Error('Video data was empty.');
        }

        const buffer = Buffer.from(video.data);

        if (!buffer.length) {
            throw new Error('Downloaded video is empty.');
        }

        await sock.sendMessage(
            m.from,
            {
                video: buffer,
                mimetype: 'video/mp4',
                caption:
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ 🎵 *TIKTOK DOWNLOADER*
┃
┃ ✅ Download complete
┃ 📦 ${(buffer.length / 1024 / 1024).toFixed(2)} MB
┃
╰━━━━━━━━━━━━━━
> *Freezer-MD • Downloaders*`
            },
            { quoted: m }
        );

    } catch (err) {

        console.error(
            '❌ Freezer TikTok Error:',
            err?.stack || err?.message || err
        );

        return m.reply(
`╭━━━〔 ❄️ FREEZER-MD 〕
┃
┃ ❌ *DOWNLOAD FAILED*
┃
┃ The downloader service did not
┃ return a usable video.
┃
┃ Try another TikTok link.
┃
╰━━━━━━━━━━━━━━`
        );
    }
});
