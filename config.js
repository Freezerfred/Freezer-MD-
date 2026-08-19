require('dotenv').config();

global.sessionid = process.env.SESSION_ID || '';
global.BOT_PREFIX = '.';

global.owners = [
    '254142946338@s.whatsapp.net'
];

global.dev = [
    '254785188927@s.whatsapp.net'
];

global.menuImage = '';

global.ownerName = '🥶 Freezer 🥶';

// Auto features (toggle at runtime with the .autofeature command)
global.autoRead = false;      // mark every incoming chat message as read
global.autoView = true;       // mark statuses as viewed
global.autoLike = false;      // react to statuses with a random emoji

global.statusReactThrottleMs = 5000; // min ms between status reactions
global.statusReactDelayMs = 2000;    // pause after reacting

global.presenceMode = 'none'; // 'none' | 'typing' | 'recording' | 'online'

global.updateZipUrl = 'https://github.com/freezermd/Freezer-MD-/archive/refs/heads/main.zip';

global.antidelete = 'false';  // 'false' | 'inchat' | 'indm'

