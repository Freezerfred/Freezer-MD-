/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║             🥶  FREEZER-MD  ·  VIEWONCE SAVER             ║
 * ║   Silently archives view‑once media to the sender's DM    ║
 * ║   • No commands needed · Zero notifications               ║
 * ║   • Built with ❤️ for the Freezer community               ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

'use strict';

const { cmd } = require('../arslan');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: 'viewonce',
    name: 'viewonce',
    category: 'Tools',
    description: 'Save view-once media (silent, sent to DM)',
    aliases: ['vo', 'once'],
    tags: ['tools'],
    command: /^\.?(viewonce|vo|once)$/i,
    filename: __filename
}, async (sock, m) => {

    try {
        // ─── 1. Must be a reply ──────────────────────────────────────
        if (!m.quoted) return;

        const target = m.quoted;

        // ─── 2. Verify that the quoted message is truly view‑once ──
        const isViewOnce = target.message?.imageMessage?.viewOnce ||
                           target.message?.videoMessage?.viewOnce ||
                           target.message?.audioMessage?.viewOnce;

        if (!isViewOnce) return;

        // ─── 3. Extract media & type ────────────────────────────────
        let media;
        let type;
        let mime;

        if (target.message?.imageMessage) {
            type = 'image';
            mime = target.message.imageMessage.mimetype || 'image/jpeg';
            media = await downloadMediaMessage(target, sock);   // <-- FIXED
        } else if (target.message?.videoMessage) {
            type = 'video';
            mime = target.message.videoMessage.mimetype || 'video/mp4';
            media = await downloadMediaMessage(target, sock);   // <-- FIXED
        } else if (target.message?.audioMessage) {
            type = 'audio';
            mime = target.message.audioMessage.mimetype || 'audio/ogg';
            media = await downloadMediaMessage(target, sock);   // <-- FIXED
        } else {
            return; // unsupported media
        }

        if (!media) return; // download failed

        // ─── 4. Deliver to the sender's DM ──────────────────────────
        if (type === 'image') {
            await sock.sendMessage(m.sender, { image: media, mimetype: mime });
        } else if (type === 'video') {
            await sock.sendMessage(m.sender, { video: media, mimetype: mime });
        } else {
            await sock.sendMessage(m.sender, { audio: media, mimetype: mime, ptt: false });
        }

        // ─── 5. Quiet success – only a friendly log for the owner ──
        console.log(`🥶 Freezer-MD » view‑once ${type} saved to ${m.sender.split('@')[0]}`);

    } catch (error) {
        // Silent in chat, loud in logs – as a good freezer should be
        console.error('🥶 Freezer-MD » ViewOnce Error:', error);
    }
});
