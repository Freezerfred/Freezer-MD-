'use strict';

require('dotenv').config();

/*
 * ============================================================
 *                    FREEZER-MD CONFIG
 * ============================================================
 */

global.BOT_NAME = process.env.BOT_NAME || 'FREEZER-MD';
global.BOT_PREFIX = process.env.BOT_PREFIX || '.';
global.ownerName = process.env.OWNER_NAME || '🥶 Freezer 🥶';

/*
 * ============================================================
 *                       SESSION
 * ============================================================
 */

global.sessionid = process.env.SESSION_ID || '';

/*
 * ============================================================
 *                    OWNER / DEVELOPER
 * ============================================================
 *
 * Keep these temporarily here for compatibility.
 * We will move them to .env after auditing all permission checks.
 */

global.owners = [
    '254142946338@lid',
    '254785188927@lid'
];

global.dev = [
    '254142946338@s.whatsapp.net',
    '254785188927@s.whatsapp.net',
    '254142946338@lid',
    '254785188927@lid'
];

/*
 * ============================================================
 *                         MENU
 * ============================================================
 */

global.menuImage =
    process.env.MENU_IMAGE ||
    'https://i.ibb.co/fY77xvV1/IMG-20260814-WA0000-1.jpg';

/*
 * ============================================================
 *                    AUTO FEATURES
 * ============================================================
 */

global.autoRead = false;
global.autoView = true;
global.autoLike = false;

global.statusReactThrottleMs = 5000;
global.statusReactDelayMs = 2000;

global.presenceMode = 'none';

/*
 * ============================================================
 *                     UPDATE SYSTEM
 * ============================================================
 */

global.updateZipUrl =
    'https://github.com/Freezerfred/Freezer-MD-/archive/refs/heads/main.zip';

/*
 * ============================================================
 *                     ANTIDELETE
 * ============================================================
 */

global.antidelete = 'false';

/*
 * ============================================================
 *                    OFFICIAL CHANNEL
 * ============================================================
 */

global.channelUrl =
    process.env.CHANNEL_URL ||
    'https://whatsapp.com/channel/0029Vb87tM1D8SE7qCVjbq3U';

global.channelName =
    process.env.CHANNEL_NAME ||
    '❄️ FREEZER-MD OFFICIAL ❄️';

/*
 * ============================================================
 *                      SAFETY DEFAULTS
 * ============================================================
 */

global.BOT_VERSION = '1.0.0';
global.BOT_AUTHOR = 'Freezer';

/*
 * ============================================================
 *                      CONFIG STATUS
 * ============================================================
 */

if (!global.sessionid) {
    console.warn('[FREEZER-MD] SESSION_ID is not configured.');
}

console.log(
    `[FREEZER-MD] ${global.BOT_NAME} v${global.BOT_VERSION} configuration loaded.`
);
