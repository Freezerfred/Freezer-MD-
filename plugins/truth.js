'use strict';

const { cmd } = require('../arslan');

const truths = [
    'What is your biggest secret?',
    'Who was your first crush?',
    'What is the most embarrassing thing you have done?',
    'Who do you text the most?',
    'What is one thing you wish you could change about yourself?',
    'Have you ever lied to your best friend?',
    'What is your biggest fear?',
    'Who was the last person you thought about?',
    'What is your most unforgettable memory?',
    'What is something you have never told anyone?'
];

const dares = [
    'Send a funny selfie to your closest friend.',
    'Change your WhatsApp status to something funny for 10 minutes.',
    'Send 😂 to the last person you chatted with.',
    'Type your next message using only emojis.',
    'Send a voice note saying "Freezer-MD is the GOAT."',
    'Let someone choose your WhatsApp profile picture for 5 minutes.',
    'Reply to the next message with only "🥶".',
    'Send your best joke to someone.',
    'Write "I need Freezer-MD" in your status for 5 minutes.',
    'Send a random GIF to your most recent chat.'
];

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

cmd({
    pattern: 'truth',
    name: 'truth',
    category: 'Fun',
    description: 'Get a random truth question',
    aliases: ['truthgame'],
    filename: __filename
}, async (sock, m) => {

    const truth = randomItem(truths);

    await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🎭 *TRUTH*
┃
┃ ❓ ${truth}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
❄️ *FREEZER-MD • FUN*`
    );
});

cmd({
    pattern: 'dare',
    name: 'dare',
    category: 'Fun',
    description: 'Get a random dare challenge',
    aliases: ['daregame'],
    filename: __filename
}, async (sock, m) => {

    const dare = randomItem(dares);

    await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔥 *DARE*
┃
┃ 🎯 ${dare}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
❄️ *FREEZER-MD • FUN*`
    );
});

cmd({
    pattern: 'tod',
    name: 'tod',
    category: 'Fun',
    description: 'Truth or Dare',
    aliases: ['truthordare'],
    filename: __filename
}, async (sock, m, args) => {

    const choice = (args[0] || '').toLowerCase();

    if (!['truth', 'dare'].includes(choice)) {
        return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🎭 *TRUTH OR DARE*
┃
┃ Usage:
┃ .tod truth
┃ .tod dare
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }

    const result =
        choice === 'truth'
            ? randomItem(truths)
            : randomItem(dares);

    const icon =
        choice === 'truth' ? '❓' : '🔥';

    await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ${icon} *${choice.toUpperCase()}*
┃
┃ ${result}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
❄️ *FREEZER-MD • FUN*`
    );
});
