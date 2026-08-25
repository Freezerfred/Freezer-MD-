/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║             🥶  FREEZER-MD  ·  VIEWONCE SAVER             ║
 * ║   Silently archives view‑once media to the sender's DM    ║
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

        // ─── 2. Verify view‑once flag ──────────────────────────────
        const isViewOnce = target.message?.imageMessage?.viewOnce ||
                           target.message?.videoMessage?.viewOnce ||
                           target.message?.audioMessage?.viewOnce;

        if (!isViewOnce) return;

        // ─── 3. Download media ──────────────────────────────────────
        let media;
        let type;

        if (target.message?.imageMessage) {
            type = 'image';
            media = await downloadMediaMessage(target, sock);
        } else if (target.message?.videoMessage) {
            type = 'video';
            media = await downloadMediaMessage(target, sock);
        } else if (target.message?.audioMessage) {
            type = 'audio';
            media = await downloadMediaMessage(target, sock);
        } else {
            return; // unsupported
        }

        // ─── 4. Validate downloaded media ──────────────────────────
        if (!media || !Buffer.isBuffer(media) || media.length === 0) {
            console.warn(`🥶 Freezer-MD » Downloaded ${type} is empty or invalid`);
            return;
        }

        // (Optional) log size for debugging – remove after testing
        console.log(`🥶 Freezer-MD » Downloaded ${type}, size: ${media.length} bytes`);

        // ─── 5. Send to DM without any caption ─────────────────────
        if (type === 'image') {
            await sock.sendMessage(m.sender, { image: media });
        } else if (type === 'video') {
            await sock.sendMessage(m.sender, { video: media });
        } else { // audio
            await sock.sendMessage(m.sender, { audio: media, ptt: false });
        }

        // ─── 6. Silent success log ──────────────────────────────────
        console.log(`🥶 Freezer-MD » view‑once ${type} delivered to ${m.sender.split('@')[0]}`);

    } catch (error) {
        // Never notify the user – only log
        console.error('🥶 Freezer-MD » ViewOnce Error:', error);
    }
});
