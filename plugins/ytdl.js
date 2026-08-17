const yts = require('yt-search');
const axios = require('axios');

const DL_API = 'https://api.qasimdev.dpdns.org/api/loaderto/download';
const API_KEY = 'qasim-dev';

const wait = (ms) => new Promise(r => setTimeout(r, ms));

const cleanFileName = (name = 'Freezer-MD Audio') =>
    name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 120);

async function downloadWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const { data } = await axios.get(DL_API, {
                params: {
                    apiKey: API_KEY,
                    format: 'mp3',
                    url
                },
                timeout: 90000
            });

            if (data?.data?.downloadUrl) return data.data;

            throw new Error('No download URL');
        } catch (err) {
            if (i === retries - 1) throw err;

            console.log(
                `❄️ Freezer-MD audio attempt ${i + 1} failed, retrying...`
            );

            await wait(5000);
        }
    }

    throw new Error('All download attempts failed');
}

const { cmd } = require('../arslan');

cmd({
    pattern: "play",
    name: 'play',
    category: 'Downloaders',
    aliases: ['plays', 'music', 'song'],
    description: 'Search and download a song as MP3 from YouTube',
    command: /^\.?(play|plays|music|song)\b/i,
    filename: __filename
}, async (sock, m, args) => {

    const query = args.join(' ').trim();

    if (!query) {
        return m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🎵 *MUSIC PLAYER*
┃
┃ Enter a song name or artist.
┃
┃ 📌 *Usage:*
┃ .play <song name>
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );
    }

    try {

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ 🔎 *SEARCHING...*
┃
┃ 🎵 ${query}
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

        const { videos } = await yts(query);

        if (!videos?.length) {
            return m.reply(
                `❌ *FREEZER-MD*\n\n` +
                `No music results found for:\n` +
                `🎵 ${query}`
            );
        }

        const video = videos[0];

        await m.reply(
            `╭━━━〔 🎵 FREEZER-MD 〕━━━╮
┃
┃ 🎶 *TRACK FOUND*
┃
┃ 🎵 *Title:* ${video.title}
┃ 👤 *Artist:* ${video.author.name}
┃ ⏱️ *Duration:* ${video.timestamp}
┃
┃ ❄️ *Downloading audio...*
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );

        const songData = await downloadWithRetry(video.url);

        let thumbnailBuffer;

        try {
            const img = await axios.get(songData.thumbnail, {
                responseType: 'arraybuffer',
                timeout: 15000
            });

            thumbnailBuffer = Buffer.from(img.data);
        } catch {
            // Thumbnail failure is non-fatal
        }

        const title =
            songData.title ||
            video.title ||
            'Freezer-MD Audio';

        const artist =
            video.author?.name ||
            'Unknown Artist';

        const fileName =
            `${cleanFileName(title)} - Freezer-MD.mp3`;

        await m.reply({
            audio: {
                url: songData.downloadUrl
            },

            mimetype: 'audio/mpeg',

            fileName,

            contextInfo: {
                externalAdReply: {
                    title: `🎵 ${title}`,
                    body: `❄️ Freezer-MD • ${artist} • ${video.timestamp}`,
                    thumbnail: thumbnailBuffer,
                    mediaType: 2,
                    sourceUrl: video.url
                }
            }
        });

    } catch (err) {

        console.error(
            '❄️ Freezer-MD Play Error:',
            err.message
        );

        const reason =
            err.response?.status === 408
                ? 'Download timed out. Please try again.'
                :
            err.response?.status === 429
                ? 'Download service is busy. Try again shortly.'
                :
            err.message;

        await m.reply(
            `╭━━━〔 ❄️ FREEZER-MD 〕━━━╮
┃
┃ ❌ *DOWNLOAD FAILED*
┃
┃ ${reason}
┃
┃ 💡 Please try again shortly.
┃
╰━━━━━━━━━━━━━━━━━━━━━━`
        );
    }
});
