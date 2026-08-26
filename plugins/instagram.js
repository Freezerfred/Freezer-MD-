'use strict';

const { cmd } = require('../arslan');

const NEXRAY = 'https://api.nexray.web.id/downloader/v2/instagram?url=';

cmd({
    pattern: 'igdl',
    name: 'igdl',
    category: 'Downloaders',
    aliases: ['instadl', 'insta', 'instagram', 'ig'],
    description: 'Download Instagram photos, videos and carousels',
    filename: __filename
}, async (sock, m, args) => {

    await m.react('⌛');

    const text = args && args.length
        ? args.join(' ').trim()
        : '';

    if (!text) {
        await m.react('❌').catch(() => {});

        return m.reply(
`╭━━〔 🥶 FREEZER-MD 〕━━╮
┃
┃ 📸 *Instagram Downloader*
┃
┃ Send an Instagram link.
┃
┃ Example:
┃ .igdl https://instagram.com/...
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }

    if (!/instagram\.com/i.test(text)) {
        await m.react('❌').catch(() => {});

        return m.reply(
`╭━━〔 🥶 FREEZER-MD 〕━━╮
┃
┃ ❌ *Invalid Instagram Link*
┃
┃ Please provide a valid
┃ Instagram URL.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }

    try {
        const r = await fetch(
            NEXRAY + encodeURIComponent(text),
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        );

        const d = await r.json();

        if (!d.status || !d.result) {
            throw new Error('Instagram API failed');
        }

        const {
            title,
            likes,
            comment,
            username,
            media
        } = d.result;

        if (!media || !media.length) {
            throw new Error('No media found');
        }

        await m.react('✅');

        for (const item of media.slice(0, 5)) {

            try {
                const dlRes = await fetch(item.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Referer': 'https://www.instagram.com/'
                    }
                });

                if (!dlRes.ok) continue;

                const buf = Buffer.from(
                    await dlRes.arrayBuffer()
                );

                const cap =
`╭━━〔 🥶 FREEZER-MD 〕━━╮
┃
┃ 📸 *Instagram Downloader*
┃
┃ 📝 ${title || 'Instagram Post'}
┃ 👤 @${username || 'unknown'}
┃ ❤️ ${likes ? likes.toLocaleString() : 'N/A'} likes
┃ 💬 ${comment ? comment.toLocaleString() : 'N/A'} comments
┃
╰━━━━━━━━━━━━━━━━━━━━╯
> 🥶 POWERED BY FREEZER-MD`;

                if (item.type === 'mp4') {

                    await sock.sendMessage(
                        m.from,
                        {
                            video: buf,
                            caption: cap,
                            mimetype: 'video/mp4'
                        }
                    );

                } else {

                    await sock.sendMessage(
                        m.from,
                        {
                            image: buf,
                            caption: cap
                        }
                    );
                }

            } catch (err) {
                console.error(
                    '[FREEZER-MD IGDL MEDIA]',
                    err
                );
            }
        }

    } catch (e) {

        console.error(
            '[FREEZER-MD IGDL]',
            e
        );

        await m.react('❌').catch(() => {});

        await m.reply(
`╭━━〔 🥶 FREEZER-MD 〕━━╮
┃
┃ ❌ *Download Failed*
┃
┃ ${e.message || 'Unable to download Instagram media.'}
┃
┃ Please try again later.
┃
╰━━━━━━━━━━━━━━━━━━━━╯
> 🥶 POWERED BY FREEZER-MD`
        );
    }
});
