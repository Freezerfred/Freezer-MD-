'use strict';

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║                 FREEZER-MD TRANSLATOR               ║
 * ║             Language Translation System             ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Commands:
 *   .translate en Hello bro
 *   .tr sw Hello bro
 *   .translate sw
 *
 * Reply to a message:
 *   .translate sw
 *
 * Default language:
 *   English (en)
 *
 * Author: Freezer
 */

const axios = require('axios');
const { cmd } = require('../arslan');

// ─────────────────────────────────────────────────────
// LANGUAGE LIST
// ─────────────────────────────────────────────────────

const LANGUAGES = {
    en: 'English',
    sw: 'Swahili',
    fr: 'French',
    es: 'Spanish',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ar: 'Arabic',
    hi: 'Hindi',
    bn: 'Bengali',
    ur: 'Urdu',
    tr: 'Turkish',
    nl: 'Dutch',
    pl: 'Polish',
    uk: 'Ukrainian',
    vi: 'Vietnamese',
    id: 'Indonesian',
    ms: 'Malay',
    th: 'Thai',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ta: 'Tamil',
    te: 'Telugu',
    gu: 'Gujarati',
    pa: 'Punjabi',
    yo: 'Yoruba',
    ha: 'Hausa',
    ig: 'Igbo',
    am: 'Amharic',
    so: 'Somali',
    zu: 'Zulu',
    xh: 'Xhosa'
};

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function cleanText(text = '') {
    return String(text)
        .replace(/\u0000/g, '')
        .trim();
}

function getLanguageName(code) {
    return LANGUAGES[code.toLowerCase()] || code.toUpperCase();
}

function getQuotedMessage(m) {
    return (
        m?.quoted ||
        m?.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
        null
    );
}

function extractTextFromMessage(message) {
    if (!message) return '';

    if (typeof message === 'string') {
        return cleanText(message);
    }

    if (message.text) {
        return cleanText(message.text);
    }

    if (message.body) {
        return cleanText(message.body);
    }

    if (message.message) {
        return extractTextFromMessage(message.message);
    }

    if (message.conversation) {
        return cleanText(message.conversation);
    }

    if (message.extendedTextMessage?.text) {
        return cleanText(message.extendedTextMessage.text);
    }

    if (message.imageMessage?.caption) {
        return cleanText(message.imageMessage.caption);
    }

    if (message.videoMessage?.caption) {
        return cleanText(message.videoMessage.caption);
    }

    return '';
}

// ─────────────────────────────────────────────────────
// API #1
// MyMemory Translation API
// ─────────────────────────────────────────────────────

async function translateMyMemory(text, source, target) {
    const response = await axios.get(
        'https://api.mymemory.translated.net/get',
        {
            params: {
                q: text,
                langpair: `${source}|${target}`
            },
            timeout: 15000
        }
    );

    const translated =
        response?.data?.responseData?.translatedText;

    if (!translated) {
        throw new Error('MyMemory returned no translation');
    }

    return translated;
}

// ─────────────────────────────────────────────────────
// API #2
// Google Translate unofficial endpoint
// ─────────────────────────────────────────────────────

async function translateGoogle(text, source, target) {
    const response = await axios.get(
        'https://translate.googleapis.com/translate_a/single',
        {
            params: {
                client: 'gtx',
                sl: source,
                tl: target,
                dt: 't',
                q: text
            },
            timeout: 15000
        }
    );

    const data = response?.data;

    if (!Array.isArray(data) || !Array.isArray(data[0])) {
        throw new Error('Google returned no translation');
    }

    const translated = data[0]
        .map(item => item?.[0] || '')
        .join('');

    if (!translated) {
        throw new Error('Google returned empty translation');
    }

    return translated;
}

// ─────────────────────────────────────────────────────
// TRANSLATION ENGINE
// ─────────────────────────────────────────────────────

async function translateText(text, source, target) {
    const errors = [];

    // Try Google first
    try {
        return await translateGoogle(text, source, target);
    } catch (error) {
        errors.push(`Google: ${error.message}`);
    }

    // Fallback to MyMemory
    try {
        return await translateMyMemory(text, source, target);
    } catch (error) {
        errors.push(`MyMemory: ${error.message}`);
    }

    throw new Error(errors.join(' | '));
}

// ─────────────────────────────────────────────────────
// COMMAND
// ─────────────────────────────────────────────────────

cmd({
    pattern: 'translate',
    name: 'translate',
    category: 'Tools',
    description: 'Translate text into another language',
    aliases: ['tr', 'trans', 'translator'],
    tags: ['tools', 'language', 'translate'],
    filename: __filename
}, async (sock, m) => {

    try {

        // ─────────────────────────────────────────────
        // GET COMMAND TEXT
        // ─────────────────────────────────────────────

        const body =
            m?.body ||
            m?.text ||
            m?.message?.conversation ||
            '';

        const args = body.trim().split(/\s+/).slice(1);

        // ─────────────────────────────────────────────
        // SHOW HELP
        // ─────────────────────────────────────────────

        if (!args.length) {
            return await m.reply(
`╭━━━〔 🥶 FREEZER TRANSLATOR 〕━━━╮
┃
┃ 🌍 *LANGUAGE TRANSLATOR*
┃
┃ Translate any text instantly.
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ 📌 *USAGE*
┃
┃ .translate <lang> <text>
┃
┃ Example:
┃ .translate sw Hello bro
┃
┃ .tr fr How are you?
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ 💬 *REPLY MODE*
┃
┃ Reply to a message with:
┃
┃ .translate sw
┃
┃ Freezer-MD will translate
┃ the replied message.
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ 🌐 *POPULAR LANGUAGES*
┃
┃ 🇬🇧 en — English
┃ 🇰🇪 sw — Swahili
┃ 🇫🇷 fr — French
┃ 🇪🇸 es — Spanish
┃ 🇩🇪 de — German
┃ 🇮🇹 it — Italian
┃ 🇸🇦 ar — Arabic
┃ 🇮🇳 hi — Hindi
┃ 🇨🇳 zh — Chinese
┃ 🇯🇵 ja — Japanese
┃ 🇰🇷 ko — Korean
┃ 🇷🇺 ru — Russian
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🥶 *FREEZER-MD • LANGUAGE ENGINE*`
            );
        }

        // ─────────────────────────────────────────────
        // LANGUAGE
        // ─────────────────────────────────────────────

        const target = args.shift().toLowerCase();

        if (!LANGUAGES[target]) {
            return await m.reply(
`╭━━━〔 ⚠️ INVALID LANGUAGE 〕━━━╮
┃
┃ ❌ Language code: *${target}*
┃
┃ Use a valid language code.
┃
┃ Example:
┃ .translate sw Hello
┃
┃ 🇬🇧 en — English
┃ 🇰🇪 sw — Swahili
┃ 🇫🇷 fr — French
┃ 🇪🇸 es — Spanish
┃ 🇩🇪 de — German
┃ 🇸🇦 ar — Arabic
┃ 🇮🇳 hi — Hindi
┃ 🇨🇳 zh — Chinese
┃ 🇯🇵 ja — Japanese
┃ 🇰🇷 ko — Korean
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        // ─────────────────────────────────────────────
        // TEXT FROM COMMAND
        // ─────────────────────────────────────────────

        let text = cleanText(args.join(' '));

        // ─────────────────────────────────────────────
        // TEXT FROM REPLIED MESSAGE
        // ─────────────────────────────────────────────

        if (!text) {
            const quoted = getQuotedMessage(m);

            if (quoted) {
                text = extractTextFromMessage(quoted);
            }
        }

        // ─────────────────────────────────────────────
        // NOTHING TO TRANSLATE
        // ─────────────────────────────────────────────

        if (!text) {
            return await m.reply(
`╭━━━〔 ⚠️ TRANSLATE ERROR 〕━━━╮
┃
┃ No text found to translate.
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ Example:
┃ .translate sw Hello bro
┃
┃ Or reply to a message:
┃ .translate sw
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        // ─────────────────────────────────────────────
        // LIMIT VERY LARGE MESSAGES
        // ─────────────────────────────────────────────

        if (text.length > 5000) {
            return await m.reply(
`╭━━━〔 ⚠️ TEXT TOO LONG 〕━━━╮
┃
┃ Maximum text length:
┃ *5000 characters*
┃
┃ Please shorten the message
┃ and try again.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        // ─────────────────────────────────────────────
        // PROCESSING MESSAGE
        // ─────────────────────────────────────────────

        const processing = await m.reply(
`╭━━━〔 🌍 TRANSLATING 〕━━━╮
┃
┃ 🔄 *Processing translation...*
┃
┃ 🎯 Target: *${getLanguageName(target)}*
┃
┃ 🥶 Freezer-MD Language Engine
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

        // ─────────────────────────────────────────────
        // TRANSLATE
        // ─────────────────────────────────────────────

        const translated = await translateText(
            text,
            'auto',
            target
        );

        if (!translated) {
            throw new Error('Empty translation received');
        }

        // ─────────────────────────────────────────────
        // RESULT
        // ─────────────────────────────────────────────

        const result =
`╭━━━〔 🌍 FREEZER TRANSLATOR 〕━━━╮
┃
┃ 🎯 *TARGET:* ${getLanguageName(target)}
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ 📝 *ORIGINAL*
┃
┃ ${text}
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ 🔤 *TRANSLATION*
┃
┃ ${translated}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🥶 *Translated by FREEZER-MD*`;

        // ─────────────────────────────────────────────
        // EDIT PROCESSING MESSAGE IF SUPPORTED
        // ─────────────────────────────────────────────

        try {
            if (
                processing &&
                sock?.sendMessage &&
                processing?.key
            ) {
                await sock.sendMessage(
                    m.chat,
                    {
                        text: result,
                        edit: processing.key
                    }
                );

                return;
            }
        } catch (_) {
            // Editing is optional.
        }

        // Fallback
        return await m.reply(result);

    } catch (error) {

        console.error(
            '[FREEZER-MD TRANSLATE ERROR]',
            error
        );

        return await m.reply(
`╭━━━〔 ❌ TRANSLATION FAILED 〕━━━╮
┃
┃ Something went wrong while
┃ translating the message.
┃
┣━━━━━━━━━━━━━━━━━━━━
┃ Possible reasons:
┃
┃ • Translation API unavailable
┃ • Network connection problem
┃ • Unsupported text
┃
┃ Please try again shortly.
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🥶 *FREEZER-MD*`
        );
    }
});
