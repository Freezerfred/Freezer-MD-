'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

const API = {
    tdown: 'https://tdownv4.sl-bjs.workers.dev/',
    clipx: 'https://clipx.zamdev.workers.dev/'
};

const isTikTok = (url) =>
    /^(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\//i.test(url);

const cleanUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

async function tdown(url) {
    const { data } = await axios.get(API.tdown, {
        params: { down: url },
        timeout: 15000,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const video =
        data?.download_url ||
        data?.video ||
        data?.data?.download_url ||
        data?.data?.video;

    if (!video) {
        throw new Error('TDown returned no video URL');
    }

    return {
        video,
        title: data?.title || 'TikTok Video',
        author: data?.author?.username || 'Unknown'
    };
}

async function clipx(url) {
    const { data } = await axios.get(API.clipx, {
        params: { url },
        timeout: 15000,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const video =
        data?.download_url ||
        data?.video_url ||
        data?.video ||
        data?.data?.download_url ||
        data?.data?.video_url ||
        data?.data?.video;

    if (!video) {
        throw new Error('ClipX returned no video URL');
    }

    return {
        video,
        title: data?.title || data?.data?.title || 'TikTok Video',
        author:
            data?.author?.username ||
            data?.data?.author?.username ||
            'Unknown'
    };
}

cmd({
    pattern: 'tiktok',
    name: 'tiktok',
    category: 'Downloaders',
    aliases: ['tt', 'tikdl', 'tiktokdl'],
    description: 'Download TikTok videos without watermark',
    tags: ['downloader', 'tiktok'],
    filename: __filename
}, async (sock, m, args) => {

    try {

        const url = args[0];

        if (!url) {
            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🎵 *TIKTOK DOWNLOADER*
┃
┃ Send a TikTok video link.
┃
┃ ❄️ Example:
┃ ${global.BOT_PREFIX || '.'}tiktok https://vt.tiktok.com/xxxx
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        if (!isTikTok(url)) {
            return await m.reply(
                `❌ *INVALID TIKTOK LINK*\n\n` +
                `Please send a valid TikTok URL.`
            );
        }

        const tikUrl = cleanUrl(url);

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ⏳ *PROCESSING TIKTOK*
┃
┃ 🔎 Fetching video...
┃ ⚡ Please wait.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

        let result;
        let provider = '';

        // ─────────────────────────
        // PRIMARY API
        // ─────────────────────────

        try {
            result = await tdown(tikUrl);
            provider = 'TDown';
        } catch (e) {
            console.log(
                '❌ TDown failed:',
                e.response?.status || e.message
            );
        }

        // ─────────────────────────
        // FALLBACK API
        // ─────────────────────────

        if (!result) {
            try {
                result = await clipx(tikUrl);
                provider = 'ClipX';
            } catch (e) {
                console.log(
                    '❌ ClipX failed:',
                    e.response?.status || e.message
                );
            }
        }

        if (!result?.video) {
            return await m.reply(
                `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *DOWNLOAD FAILED*
┃
┃ Both download providers
┃ are currently unavailable.
┃
┃ 🔄 Try again in a moment.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
            );
        }

        // ─────────────────────────
        // DOWNLOAD VIDEO
        // ─────────────────────────

        const video = await axios.get(result.video, {
            responseType: 'arraybuffer',
            timeout: 30000,
            maxContentLength: 50 * 1024 * 1024,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        await m.reply(
            Buffer.from(video.data),
            {
                mimetype: 'video/mp4',
                fileName: 'Freezer-MD-TikTok.mp4',
                caption:
`╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🎵 *TIKTOK DOWNLOADER*
┃
┃ 👤 *AUTHOR:* ${result.author}
┃ 📝 *TITLE:* ${String(result.title).substring(0, 100)}
┃ ⚡ *API:* ${provider}
┃
╰━━━━━━━━━━━━━━━━━━━━━━
❄️ *Powered by FREEZER-MD*`
            }
        );

    } catch (err) {

        console.error('❌ Freezer TikTok:', err);

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *SYSTEM ERROR*
┃
┃ TikTok download could not
┃ be completed.
┃
┃ 🔄 Please try again.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );
    }
});
