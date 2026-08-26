'use strict';

const { createDecipheriv } = require('crypto');
const yts = require('yt-search');
const { cmd } = require('../arslan');

const METADATA_DECRYPTION_KEY = Buffer.from(
    'C5D58EF67A7584E4A29F6C35BBC4EB12',
    'hex'
);

const HEADERS = {
    'Content-Type': 'application/json',
    Origin: 'https://yt.savetube.me',
    'User-Agent':
        'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36'
};

// ─── Freezer-MD YouTube Audio Downloader ──────────────────────────

async function savetube(
    url,
    { downloadType = 'audio', quality = '128kbps' } = {}
) {
    const idMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/
    );

    if (!idMatch) throw 'Invalid YouTube URL';

    const videoId = idMatch[1];

    const cdnRes = await fetch(
        'https://media.savetube.vip/api/random-cdn',
        {
            headers: HEADERS
        }
    )
        .then(res => res.json())
        .catch(() => null);

    if (!cdnRes?.cdn) throw 'Freezer-MD CDN is unavailable';

    const cdn = cdnRes.cdn;

    const info = await fetch(`https://${cdn}/v2/info`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            url: `https://www.youtube.com/watch?v=${videoId}`
        })
    })
        .then(res => res.json())
        .catch(() => null);

    if (!info?.data) throw 'Unable to retrieve YouTube metadata';

    let metadata;

    try {
        const encrypted = Buffer.from(info.data, 'base64');

        const decipher = createDecipheriv(
            'aes-128-cbc',
            METADATA_DECRYPTION_KEY,
            encrypted.subarray(0, 16)
        );

        const decrypted = Buffer.concat([
            decipher.update(encrypted.subarray(16)),
            decipher.final()
        ]);

        metadata = JSON.parse(decrypted.toString('utf8'));
    } catch {
        throw 'Failed to decrypt YouTube metadata';
    }

    if (!metadata?.key) throw 'Download key not found';

    const dl = await fetch(`https://${cdn}/download`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            id: videoId,
            downloadType,
            quality,
            key: metadata.key
        })
    })
        .then(res => res.json())
        .catch(() => null);

    if (!dl?.data?.downloadUrl) {
        throw dl?.message || 'Freezer-MD audio download failed';
    }

    return {
        title: metadata.title,
        duration: metadata.durationLabel,
        thumbnail: metadata.thumbnail,
        url: dl.data.downloadUrl
    };
}

async function savetubeRetry(url, opts, retry = 3) {
    let lastErr;

    for (let i = 0; i < retry; i++) {
        try {
            return await savetube(url, opts);
        } catch (err) {
            lastErr = err;
        }
    }

    throw lastErr;
}

// ─── Freezer-MD Command ────────────────────────────────────────────

cmd({
    pattern: 'play',
    name: 'play',
    category: 'Downloaders',
    aliases: ['ply'],
    description: 'Search and download audio from YouTube',
    filename: __filename
}, async (sock, m, args) => {

    try {
        const text = args.join(' ').trim();
        const usedPrefix = m.prefix || global.BOT_PREFIX || '.';
        const command = 'play2';

        if (!text) {
            throw `╭━━〔 🥶 FREEZER-MD 〕━━╮
┃
┃ 🎧 *YouTube Audio Downloader*
┃
┃ Usage:
┃ ${usedPrefix}${command} <song name>
┃
┃ Example:
┃ ${usedPrefix}${command} chase atlantic
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;
        }

        await m.react('🎧');

        let url = text;

        // Search YouTube if the user provided a song name
        if (!/youtube\.com|youtu\.be/i.test(text)) {
            const search = await yts(text);

            if (!search?.videos?.length) {
                throw '❌ Song not found on YouTube.';
            }

            url = search.videos[0].url;
        }

        const detail = await yts(url);
        const vid = detail?.videos?.[0];

        if (!vid) {
            throw '❌ YouTube video not found.';
        }

        const ytUrl = vid.url || url;
        const invisible = '\u200B'.repeat(400);

        const caption = `
╭━━〔 🥶 FREEZER-MD 〕━━╮
┃
┃ 🎵 *${vid.title}*
┃
┃ ⏱️ Duration: ${vid.timestamp || '-'}
┃ 👁️ Views: ${Number(vid.views || 0).toLocaleString()}
┃ 📆 Published: ${vid.ago || '-'}
┃
┃ ⏳ Downloading audio...
┃
╰━━━━━━━━━━━━━━━━━━━━╯
`.trim();

        await sock.sendMessage(
            m.from,
            {
                text: `${ytUrl}${invisible}

${caption}`,
                contextInfo: {
                    externalAdReply: {
                        title: `🥶 ${vid.title}`,
                        body: `🎧 Freezer-MD • ${vid.timestamp || 'Audio'}`,
                        thumbnailUrl: vid.thumbnail,
                        sourceUrl: ytUrl,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }
        );

        try {
            const audio = await savetubeRetry(url, {
                downloadType: 'audio',
                quality: '128kbps'
            });

            await sock.sendMessage(
                m.from,
                {
                    audio: {
                        url: audio.url
                    },
                    mimetype: 'audio/mpeg',
                    fileName: `${audio.title}.mp3`,
                    ptt: false
                }
            );

            await m.react('✅');

        } catch (err) {
            console.error('[FREEZER-MD PLAY2]', err);

            await m.react('❌');

            await sock.sendMessage(
                m.from,
                {
                    text: `╭━━〔 🥶 FREEZER-MD 〕━━╮
┃
┃ ❌ *Download Failed*
┃
┃ Unable to download the audio
┃ right now.
┃
┃ Please try again later.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                }
            );
        }

    } catch (err) {
        console.error('[FREEZER-MD PLAY2]', err);

        await m.react('❌');

        throw typeof err === 'string'
            ? err
            : '❌ An unexpected error occurred.';
    }
});
