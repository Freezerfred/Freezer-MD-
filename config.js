require('dotenv').config();
global.sessionid = process.env.SESSION_ID || '';
global.BOT_PREFIX = '.';
global.owners = ['254142946338@lid', '254785188927@lid'];
global.dev = ['254142946338@s.whatsapp.net', '254785188927@s.whatsapp.net', '254142946338@lid', '254785188927@lid'];
global.menuImage = 'https://i.ibb.co/fY77xvV1/IMG-20260814-WA0000-1.jpg';
global.ownerName = '🥶 Freezer 🥶';

// Auto features (toggle at runtime with the .autofeature command)
global.autoRead = false;      // mark every incoming chat message as read
global.autoView = true;       // mark statuses as viewed (kept on, matches previous behavior)
global.autoLike = false;      // react to statuses with a random emoji
global.statusReactThrottleMs = 5000; // min ms between status reactions (prevents burst-spam)
global.statusReactDelayMs = 2000;    // pause after reacting before handling the next status
global.presenceMode = 'none'; // 'none' | 'typing' | 'recording' | 'online'
global.updateZipUrl = 'https://github.com/Freezerfred/Freezer-MD-.git/archive/refs/heads/main.zip';
global.antidelete = 'false';  // 'false' | 'inchat' | 'indm' — toggle at runtime with .antidelete


global.channelUrl =
    'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U';

global.channelName =
    '❄️ FREEZER-MD OFFICIAL ❄️';


FOOTBALL_API_KEY=f0f7e35e9577e6b3eedf5d15d6948efc
