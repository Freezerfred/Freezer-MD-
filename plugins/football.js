'use strict';

const { cmd } = require('../arslan');
const axios = require('axios');
const NodeCache = require('node-cache');

// ============================================================
// 🥶 FREEZER-MD | FOOTBALL SYSTEM
// ============================================================

const BOT_NAME = '🥶 Freezer-MD';
const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

if (!API_KEY) {
    console.error('❌ [Freezer-MD] FOOTBALL_API_KEY is missing in .env');
}

// ============================================================
// LEAGUES
// ============================================================

const LEAGUES = {
    PL: 'Premier League',
    PD: 'La Liga',
    BL1: 'Bundesliga',
    SA: 'Serie A',
    FL1: 'Ligue 1',
    CL: 'UEFA Champions League',
    EL: 'UEFA Europa League',
    WC: 'FIFA World Cup',
    EC: 'UEFA European Championship'
};

// ============================================================
// CACHE
// ============================================================

const cache = new NodeCache({
    stdTTL: 600,
    checkperiod: 120
});

// ============================================================
// HELPERS
// ============================================================

/**
 * Safely extract command text.
 *
 * Fixes:
 * TypeError: text.trim is not a function
 *
 * Depending on the command handler, the third argument may
 * sometimes be a string, object, array, or undefined.
 */
function getCommandText(input) {
    if (typeof input === 'string') {
        return input.trim();
    }

    if (Array.isArray(input)) {
        return input.join(' ').trim();
    }

    if (!input || typeof input !== 'object') {
        return '';
    }

    const possibleValues = [
        input.text,
        input.args,
        input.body,
        input.command,
        input.message,
        input.content
    ];

    for (const value of possibleValues) {
        if (typeof value === 'string') {
            return value.trim();
        }

        if (Array.isArray(value)) {
            return value.join(' ').trim();
        }

        if (
            value &&
            typeof value === 'object' &&
            typeof value.text === 'string'
        ) {
            return value.text.trim();
        }
    }

    return '';
}

function formatDate(dateStr) {
    if (!dateStr) return 'Unknown date';

    const d = new Date(dateStr);

    if (Number.isNaN(d.getTime())) {
        return 'Unknown date';
    }

    return d.toLocaleString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Nairobi'
    });
}

function getLeagueName(code) {
    return LEAGUES[code] || code || 'Unknown League';
}

function separator(length = 32) {
    return '─'.repeat(length);
}

function header(title, emoji = '⚽') {
    return `${emoji} *${BOT_NAME} | ${title}*\n${separator()}\n\n`;
}

async function sendComposing(sock, chat) {
    try {
        if (sock && typeof sock.sendPresenceUpdate === 'function') {
            await sock.sendPresenceUpdate('composing', chat);
        }
    } catch (_) {
        // Presence is optional — don't break commands.
    }
}

// ============================================================
// API
// ============================================================

async function fetchFromAPI(endpoint) {
    if (!API_KEY) {
        throw new Error(
            'FOOTBALL_API_KEY is missing. Add it to your .env file.'
        );
    }

    try {
        const response = await axios.get(
            `${BASE_URL}${endpoint}`,
            {
                headers: {
                    'X-Auth-Token': API_KEY
                },
                timeout: 15000
            }
        );

        return response.data;
    } catch (error) {
        if (error.response) {
            const message =
                error.response.data?.message ||
                error.response.statusText ||
                'Football API request failed';

            throw new Error(
                `API Error ${error.response.status}: ${message}`
            );
        }

        if (error.code === 'ECONNABORTED') {
            throw new Error('Football API request timed out.');
        }

        throw new Error(
            error.message || 'Failed to fetch football data.'
        );
    }
}

// ============================================================
// TEAM HELPERS
// ============================================================

async function getTeamsForLeague(leagueCode) {
    const cacheKey = `teams_${leagueCode}`;

    let teams = cache.get(cacheKey);

    if (!teams) {
        const data = await fetchFromAPI(
            `/competitions/${leagueCode}/teams`
        );

        teams = data.teams || [];

        cache.set(cacheKey, teams);
    }

    return teams;
}

function findTeam(teams, searchName) {
    const normalized = String(searchName || '')
        .toLowerCase()
        .trim();

    if (!normalized) return null;

    let found = teams.find(
        team =>
            String(team.name || '')
                .toLowerCase() === normalized
    );

    if (found) return found;

    found = teams.find(
        team =>
            String(team.name || '')
                .toLowerCase()
                .startsWith(normalized)
    );

    if (found) return found;

    found = teams.find(
        team =>
            String(team.name || '')
                .toLowerCase()
                .includes(normalized)
    );

    return found || null;
}

// ============================================================
// .LIVESCORE
// ============================================================

cmd({
    pattern: 'livescore',
    alias: ['live', 'score', 'scores'],
    desc: 'Get live football scores',
    category: 'Football',
    use: '.livescore [league_code]',
    filename: __filename
}, async (sock, m, text) => {

    try {
        await sendComposing(sock, m.chat);

        const input = getCommandText(text);
        const leagueCode = input
            ? input.toUpperCase()
            : null;

        const data = await fetchFromAPI('/matches');

        const matches = data.matches || [];

        const liveMatches = matches.filter(match =>
            ['LIVE', 'IN_PLAY', 'PAUSED'].includes(match.status)
        );

        const filtered = leagueCode
            ? liveMatches.filter(
                match => match.competition?.code === leagueCode
            )
            : liveMatches;

        if (filtered.length === 0) {
            const message = leagueCode
                ? `⚽ *${BOT_NAME}*\n\nNo live matches in *${getLeagueName(leagueCode)}* right now.`
                : `⚽ *${BOT_NAME}*\n\nNo live matches at the moment.`;

            return await m.reply(message);
        }

        let response = header('LIVE SCORES', '🔴');

        filtered.forEach(match => {
            const home = match.homeTeam?.name || 'TBD';
            const away = match.awayTeam?.name || 'TBD';

            const scoreHome =
                match.score?.fullTime?.home ??
                match.score?.halfTime?.home ??
                '-';

            const scoreAway =
                match.score?.fullTime?.away ??
                match.score?.halfTime?.away ??
                '-';

            const league = getLeagueName(
                match.competition?.code
            );

            const minute = match.minute || 'LIVE';

            response +=
                `🏆 *${league}*\n` +
                `⏱️ ${minute}'\n` +
                `⚽ ${home} *${scoreHome} - ${scoreAway}* ${away}\n` +
                `${separator(28)}\n\n`;
        });

        response += `\n🥶 *${BOT_NAME} Football System*`;

        await m.reply(response);

    } catch (error) {
        console.error('[Freezer-MD] Livescore error:', error);
        await m.reply(`❌ *Livescore Error*\n\n${error.message}`);
    }
});

// ============================================================
// .STANDINGS
// ============================================================

cmd({
    pattern: 'standings',
    alias: ['table', 'league', 'standing'],
    desc: 'Get league standings',
    category: 'Football',
    use: '.standings <league_code>',
    filename: __filename
}, async (sock, m, text) => {

    const input = getCommandText(text);

    if (!input) {
        return await m.reply(
            `🥶 *${BOT_NAME}*\n\n` +
            `❌ Provide a league code.\n\n` +
            `Available:\n${Object.keys(LEAGUES).join(', ')}`
        );
    }

    const leagueCode = input.split(/\s+/)[0].toUpperCase();

    if (!LEAGUES[leagueCode]) {
        return await m.reply(
            `❌ Invalid league code.\n\n` +
            `Available:\n${Object.keys(LEAGUES).join(', ')}`
        );
    }

    try {
        await sendComposing(sock, m.chat);

        const data = await fetchFromAPI(
            `/competitions/${leagueCode}/standings`
        );

        const standings =
            data.standings?.[0]?.table || [];

        if (standings.length === 0) {
            return await m.reply(
                `❌ No standings available for *${getLeagueName(leagueCode)}*.`
            );
        }

        let response = header(
            `${getLeagueName(leagueCode)} TABLE`,
            '🏆'
        );

        standings.slice(0, 20).forEach((team, index) => {

            const pos = index + 1;

            const name =
                team.team?.name || 'Unknown';

            const played =
                team.playedGames || 0;

            const won =
                team.won || 0;

            const draw =
                team.draw || 0;

            const lost =
                team.lost || 0;

            const goalsFor =
                team.goalsFor || 0;

            const goalsAgainst =
                team.goalsAgainst || 0;

            const gd =
                team.goalDifference || 0;

            const pts =
                team.points || 0;

            const medal =
                pos === 1 ? '🥇' :
                pos === 2 ? '🥈' :
                pos === 3 ? '🥉' :
                `*${pos}.*`;

            response +=
                `${medal} *${name}*\n` +
                `   P ${played} | W ${won} | D ${draw} | L ${lost}\n` +
                `   GF ${goalsFor} | GA ${goalsAgainst} | GD ${gd} | ⭐ ${pts} pts\n\n`;
        });

        response += `${separator()}\n🥶 Powered by *${BOT_NAME}*`;

        await m.reply(response);

    } catch (error) {
        console.error('[Freezer-MD] Standings error:', error);

        await m.reply(
            `❌ *Standings Error*\n\n${error.message}`
        );
    }
});

// ============================================================
// .FIXTURES
// ============================================================

cmd({
    pattern: 'fixtures',
    alias: ['fixture', 'matches', 'schedule'],
    desc: 'Get upcoming fixtures',
    category: 'Football',
    use: '.fixtures <league_code>',
    filename: __filename
}, async (sock, m, text) => {

    const input = getCommandText(text);

    if (!input) {
        return await m.reply(
            `🥶 *${BOT_NAME}*\n\n` +
            `❌ Provide a league code.\n\n` +
            `Example:\n*.fixtures PL*\n\n` +
            `Available:\n${Object.keys(LEAGUES).join(', ')}`
        );
    }

    const leagueCode =
        input.split(/\s+/)[0].toUpperCase();

    if (!LEAGUES[leagueCode]) {
        return await m.reply(
            `❌ Invalid league code.\n\n` +
            `Available:\n${Object.keys(LEAGUES).join(', ')}`
        );
    }

    try {
        await sendComposing(sock, m.chat);

        const data = await fetchFromAPI(
            `/competitions/${leagueCode}/matches`
        );

        const upcoming =
            (data.matches || [])
                .filter(match =>
                    ['SCHEDULED', 'TIMED'].includes(match.status)
                )
                .slice(0, 10);

        if (upcoming.length === 0) {
            return await m.reply(
                `❌ No upcoming fixtures for *${getLeagueName(leagueCode)}*.`
            );
        }

        let response = header(
            `${getLeagueName(leagueCode)} FIXTURES`,
            '📅'
        );

        upcoming.forEach(match => {

            const home =
                match.homeTeam?.name || 'TBD';

            const away =
                match.awayTeam?.name || 'TBD';

            response +=
                `⚔️ *${home}*\n` +
                `       vs\n` +
                `⚔️ *${away}*\n` +
                `📆 ${formatDate(match.utcDate)}\n` +
                `📍 ${match.stage || 'Matchday'}\n` +
                `🆔 Match ID: *${match.id}*\n` +
                `${separator(28)}\n\n`;
        });

        response +=
            `💡 Use *.matchinfo <ID>* for match details.\n\n` +
            `🥶 *${BOT_NAME}*`;

        await m.reply(response);

    } catch (error) {
        console.error('[Freezer-MD] Fixtures error:', error);

        await m.reply(
            `❌ *Fixtures Error*\n\n${error.message}`
        );
    }
});

// ============================================================
// .SCORERS
// ============================================================

cmd({
    pattern: 'scorers',
    alias: ['topscorers', 'goals', 'topscorer'],
    desc: 'Get top scorers',
    category: 'Football',
    use: '.scorers <league_code>',
    filename: __filename
}, async (sock, m, text) => {

    const input = getCommandText(text);

    if (!input) {
        return await m.reply(
            `🥶 *${BOT_NAME}*\n\n` +
            `❌ Provide a league code.\n\n` +
            `Example:\n*.scorers PL*`
        );
    }

    const leagueCode =
        input.split(/\s+/)[0].toUpperCase();

    if (!LEAGUES[leagueCode]) {
        return await m.reply(
            `❌ Invalid league code.\n\n` +
            `Available:\n${Object.keys(LEAGUES).join(', ')}`
        );
    }

    try {
        await sendComposing(sock, m.chat);

        const data = await fetchFromAPI(
            `/competitions/${leagueCode}/scorers`
        );

        const scorers = data.scorers || [];

        if (scorers.length === 0) {
            return await m.reply(
                `❌ No scorer data available for *${getLeagueName(leagueCode)}*.`
            );
        }

        let response = header(
            `${getLeagueName(leagueCode)} TOP SCORERS`,
            '🥅'
        );

        scorers.slice(0, 10).forEach((scorer, index) => {

            const name =
                scorer.player?.name || 'Unknown';

            const team =
                scorer.team?.name || 'Unknown';

            const goals =
                scorer.goals || 0;

            const assists =
                scorer.assists || 0;

            const penalties =
                scorer.penalties || 0;

            response +=
                `${index + 1}. *${name}*\n` +
                `   🏟️ ${team}\n` +
                `   ⚽ ${goals} goals\n` +
                (assists > 0
                    ? `   🅰️ ${assists} assists\n`
                    : '') +
                (penalties > 0
                    ? `   🎯 ${penalties} penalties\n`
                    : '') +
                `\n`;
        });

        response +=
            `${separator()}\n` +
            `🥶 *${BOT_NAME} Football System*`;

        await m.reply(response);

    } catch (error) {
        console.error('[Freezer-MD] Scorers error:', error);

        await m.reply(
            `❌ *Scorers Error*\n\n${error.message}`
        );
    }
});

// ============================================================
// .TEAM
// ============================================================

cmd({
    pattern: 'team',
    alias: ['teaminfo', 'club'],
    desc: 'Get detailed team information',
    category: 'Football',
    use: '.team <league_code> <team_name>',
    filename: __filename
}, async (sock, m, text) => {

    const input = getCommandText(text);

    if (!input) {
        return await m.reply(
            `🥶 *${BOT_NAME}*\n\n` +
            `❌ Usage:\n` +
            '*.team <league_code> <team_name>*\n\n' +
            `Example:\n*.team PL Arsenal*`
        );
    }

    const parts = input.split(/\s+/);

    if (parts.length < 2) {
        return await m.reply(
            `❌ Provide both league and team name.\n\n` +
            `Example:\n*.team PL Arsenal*`
        );
    }

    const leagueCode = parts[0].toUpperCase();

    const teamName =
        parts.slice(1).join(' ');

    if (!LEAGUES[leagueCode]) {
        return await m.reply(
            `❌ Invalid league code.\n\n` +
            `Available:\n${Object.keys(LEAGUES).join(', ')}`
        );
    }

    try {
        await sendComposing(sock, m.chat);

        const teams =
            await getTeamsForLeague(leagueCode);

        const team =
            findTeam(teams, teamName);

        if (!team) {
            return await m.reply(
                `❌ Team *${teamName}* not found in *${getLeagueName(leagueCode)}*.`
            );
        }

        const teamData =
            await fetchFromAPI(`/teams/${team.id}`);

        let response =
            header(teamData.name || team.name, '🏟️');

        response +=
            `🏷️ *Short Name:* ${teamData.tla || 'N/A'}\n` +
            `📍 *Stadium:* ${teamData.venue || 'N/A'}\n` +
            `📅 *Founded:* ${teamData.founded || 'N/A'}\n` +
            `🌍 *Country:* ${teamData.area?.name || 'N/A'}\n` +
            `🎨 *Colors:* ${teamData.clubColors || 'N/A'}\n` +
            `👨‍🏫 *Coach:* ${teamData.coach?.name || 'N/A'}\n`;

        const squad =
            teamData.squad || [];

        if (squad.length > 0) {

            response +=
                `\n👥 *SQUAD*\n` +
                `${separator(28)}\n`;

            response += squad
                .slice(0, 11)
                .map(player =>
                    `• ${player.name} — ${player.position || 'N/A'}`
                )
                .join('\n');

            if (squad.length > 11) {
                response +=
                    `\n\n... and ${squad.length - 11} more`;
            }
        }

        response +=
            `\n\n${separator()}\n` +
            `🥶 *${BOT_NAME}*`;

        await m.reply(response);

    } catch (error) {
        console.error('[Freezer-MD] Team error:', error);

        await m.reply(
            `❌ *Team Error*\n\n${error.message}`
        );
    }
});

// ============================================================
// .MATCHINFO
// ============================================================

cmd({
    pattern: 'matchinfo',
    alias: ['match', 'matchstats', 'md'],
    desc: 'Get detailed match information',
    category: 'Football',
    use: '.matchinfo <match_id>',
    filename: __filename
}, async (sock, m, text) => {

    const input = getCommandText(text);

    if (!input) {
        return await m.reply(
            `🥶 *${BOT_NAME}*\n\n` +
            `❌ Provide a Match ID.\n\n` +
            `Get one using *.fixtures PL*`
        );
    }

    const matchId =
        input.split(/\s+/)[0];

    if (!/^\d+$/.test(matchId)) {
        return await m.reply(
            `❌ Match ID must be a number.`
        );
    }

    try {
        await sendComposing(sock, m.chat);

        const data =
            await fetchFromAPI(`/matches/${matchId}`);

        const home =
            data.homeTeam?.name || 'TBD';

        const away =
            data.awayTeam?.name || 'TBD';

        const competition =
            getLeagueName(data.competition?.code);

        const status =
            data.status || 'UNKNOWN';

        const fullTime =
            data.score?.fullTime || {};

        const halfTime =
            data.score?.halfTime || {};

        let response =
            header(
                `${home} vs ${away}`,
                '📊'
            );

        response +=
            `🏆 *Competition:* ${competition}\n` +
            `🕐 *Status:* ${status}\n\n`;

        if (
            fullTime.home !== null &&
            fullTime.home !== undefined &&
            fullTime.away !== null &&
            fullTime.away !== undefined
        ) {
            response +=
                `⚽ *Full Time*\n` +
                `${home} *${fullTime.home} - ${fullTime.away}* ${away}\n\n`;
        }

        if (
            halfTime.home !== null &&
            halfTime.home !== undefined &&
            halfTime.away !== null &&
            halfTime.away !== undefined
        ) {
            response +=
                `⏱️ *Half Time*\n` +
                `${home} ${halfTime.home} - ${halfTime.away} ${away}\n\n`;
        }

        const stats =
            data.stats || [];

        if (stats.length > 0) {

            response +=
                `📈 *MATCH STATS*\n` +
                `${separator(28)}\n`;

            stats.forEach(stat => {
                response +=
                    `• ${stat.type || 'Stat'}: ` +
                    `${stat.homeValue ?? '—'} - ` +
                    `${stat.awayValue ?? '—'}\n`;
            });

            response += '\n';
        }

        const referees =
            data.referees || [];

        if (referees.length > 0) {

            response +=
                `👨‍⚖️ *REFEREES*\n`;

            response += referees
                .map(ref =>
                    `• ${ref.name} (${ref.role || 'N/A'})`
                )
                .join('\n');

            response += '\n';
        }

        if (data.venue) {
            response +=
                `📍 *Venue:* ${data.venue}\n`;
        }

        response +=
            `\n${separator()}\n` +
            `🥶 *${BOT_NAME} Football System*`;

        await m.reply(response);

    } catch (error) {
        console.error('[Freezer-MD] Match info error:', error);

        await m.reply(
            `❌ *Match Info Error*\n\n${error.message}`
        );
    }
});

// ============================================================
// .FOOTBALL
// ============================================================

cmd({
    pattern: 'football',
    alias: ['futbol', 'soccer', 'foot'],
    desc: 'Show Freezer-MD football commands',
    category: 'Football',
    use: '.football',
    filename: __filename
}, async (sock, m) => {

    const response =
        `🥶 *FREEZER-MD FOOTBALL CENTER* 🥶\n` +
        `${separator(35)}\n\n` +

        `🔴 *LIVE*\n` +
        `• *.livescore [code]*\n` +
        `  Live football scores\n\n` +

        `🏆 *LEAGUES*\n` +
        `• *.standings <code>*\n` +
        `  League table\n\n` +

        `📅 *FIXTURES*\n` +
        `• *.fixtures <code>*\n` +
        `  Upcoming matches + Match IDs\n\n` +

        `🥅 *SCORERS*\n` +
        `• *.scorers <code>*\n` +
        `  Top goal scorers\n\n` +

        `🏟️ *TEAM*\n` +
        `• *.team <code> <name>*\n` +
        `  Club information & squad\n\n` +

        `📊 *MATCH INFO*\n` +
        `• *.matchinfo <id>*\n` +
        `  Match details & statistics\n\n` +

        `${separator(35)}\n` +

        `🌍 *LEAGUE CODES*\n` +
        `${Object.entries(LEAGUES)
            .map(([code, name]) => `• ${code} — ${name}`)
            .join('\n')}\n\n` +

        `${separator(35)}\n` +
        `🥶 *Protected by Freezer-MD*`;

    await m.reply(response);
});
