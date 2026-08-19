'use strict';

const { cmd } = require('../arslan');
const axios = require('axios');

// ============================================================
// CONFIGURATION – set these in your .env file
// ============================================================
const API_URL = process.env.FOOTBALL_API_URL || 'https://v3.football.api-sports.io';
const API_KEY = process.env.FOOTBALL_API_KEY || '';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const TIMEZONE = 'Africa/Nairobi';
const MAX_WIDTH = 40;

// ============================================================
// LEAGUE MAPPING
// ============================================================
const LEAGUE_MAP = {
    epl: 39,
    'premier league': 39,
    'la liga': 140,
    bundesliga: 78,
    'serie a': 135,
    'ligue 1': 61,
    'champions league': 2,
    'europa league': 3,
    'conference league': 848,
};
const TOP_LEAGUES = [39, 140, 78, 135, 61];

// ============================================================
// IN‑MEMORY CACHE
// ============================================================
const cache = {};

function getCached(key) {
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        delete cache[key];
        return null;
    }
    return entry.data;
}

function setCached(key, data) {
    cache[key] = { data, timestamp: Date.now() };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getSeason() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return month >= 8 ? year : year - 1;
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function formatTime(datetime) {
    const d = new Date(datetime);
    return d.toLocaleString('en-KE', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

function getLeagueId(name) {
    const key = name.toLowerCase().trim();
    return LEAGUE_MAP[key] || null;
}

function getLeagueNameFromId(id) {
    for (const [name, lid] of Object.entries(LEAGUE_MAP)) {
        if (lid === id) return name;
    }
    return 'Unknown';
}

// ============================================================
// API FETCH WITH CACHING
// ============================================================
async function fetchAPI(endpoint, params = {}) {
    if (!API_KEY) {
        throw new Error('API key not configured. Please set FOOTBALL_API_KEY in .env');
    }

    const cacheKey = endpoint + JSON.stringify(params);
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await axios.get(`${API_URL}${endpoint}`, {
            params,
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io',
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = response.data;
        if (data.errors && Object.keys(data.errors).length > 0) {
            const errMsg = Object.values(data.errors).join(', ');
            throw new Error(`API error: ${errMsg}`);
        }

        setCached(cacheKey, data);
        return data;
    } catch (err) {
        if (err.code === 'ECONNABORTED') {
            throw new Error('API request timed out. Please try again later.');
        }
        if (err.response) {
            throw new Error(`API error: ${err.response.status} - ${err.response.statusText}`);
        }
        throw err;
    }
}

// ============================================================
// DATA RETRIEVAL
// ============================================================

async function getFixtures(leagueId, date, status = null) {
    const params = {
        league: leagueId,
        season: getSeason(),
        date: formatDate(date),
    };
    if (status) params.status = status;
    const data = await fetchAPI('/fixtures', params);
    return data.response || [];
}

async function getLiveFixtures() {
    const data = await fetchAPI('/fixtures', { live: 'all' });
    return data.response || [];
}

async function getStandings(leagueId) {
    const params = {
        league: leagueId,
        season: getSeason(),
    };
    const data = await fetchAPI('/standings', params);
    const standings = data.response?.[0]?.league?.standings?.[0] || [];
    return standings;
}

async function searchTeam(name) {
    const data = await fetchAPI('/teams', { search: name });
    return data.response || [];
}

async function getTeamFixtures(teamId, fromDate, toDate) {
    const params = {
        team: teamId,
        season: getSeason(),
        from: formatDate(fromDate),
        to: formatDate(toDate),
    };
    const data = await fetchAPI('/fixtures', params);
    return data.response || [];
}

// ============================================================
// FORMATTING
// ============================================================

function createBorder(title, lines) {
    const sep = '━'.repeat(MAX_WIDTH - 2);
    const header = `╭${sep}╮`;
    const footer = `╰${sep}╯`;
    const titleLine = `┃ ❄️ FREEZER-MD${' '.repeat(MAX_WIDTH - 19)}┃`;
    const divider = `┣${sep}┫`;
    const content = lines.map(line => `┃ ${line.padEnd(MAX_WIDTH - 4)} ┃`);

    return [header, titleLine, divider, ...content, footer].join('\n');
}

function formatMatch(match) {
    const home = match.teams?.home?.name || 'Unknown';
    const away = match.teams?.away?.name || 'Unknown';
    const status = match.fixture?.status || {};
    const short = status.short || '';
    const elapsed = status.elapsed || '';
    const date = match.fixture?.date;
    const time = date ? formatTime(date) : '';

    let score = '';
    let statusText = '';
    const goalsHome = match.goals?.home;
    const goalsAway = match.goals?.away;

    if (short === 'FT' || short === 'PEN' || short === 'AET') {
        score = `${goalsHome ?? '?'} - ${goalsAway ?? '?'}`;
        statusText = '✅ Finished';
    } else if (short === 'LIVE' || short === '1H' || short === '2H' || short === 'HT' || short === 'ET') {
        score = `${goalsHome ?? '0'} - ${goalsAway ?? '0'}`;
        statusText = `🟢 LIVE • ${elapsed ? elapsed + "'" : ' '}`;
    } else if (short === 'NS' || short === 'TBD') {
        score = '🆚';
        statusText = `🕐 ${time}`;
    } else {
        score = '🆚';
        statusText = `⏳ ${short || 'Scheduled'}`;
    }

    const homeShort = home.length > 16 ? home.slice(0, 14) + '…' : home;
    const awayShort = away.length > 16 ? away.slice(0, 14) + '…' : away;
    return `${homeShort} ${score} ${awayShort}   ${statusText}`;
}

function formatStandings(standings) {
    if (!standings || standings.length === 0) return ['No standings available.'];
    return standings.slice(0, 10).map((team, idx) => {
        const pos = (idx + 1).toString().padStart(2);
        const name = team.team?.name || 'Unknown';
        const shortName = name.length > 14 ? name.slice(0, 12) + '…' : name;
        const pts = team.points ?? 0;
        const played = team.all?.played ?? 0;
        return `${pos}. ${shortName.padEnd(16)} P:${played}  Pts:${pts}`;
    });
}

// ============================================================
// COMMAND HANDLER
// ============================================================

cmd({
    pattern: 'football',
    name: 'football',
    category: 'Tools',
    description: 'Get live football fixtures, scores, standings and more',
    aliases: ['soccer', 'fixtures', 'matches', 'scores'],
    filename: __filename,
}, async (sock, m, args) => {
    try {
        const sub = args[0] ? args[0].toLowerCase() : '';
        const rest = args.slice(1);

        // If sub is a known league, show today's fixtures for that league
        if (getLeagueId(sub) !== null) {
            const leagueId = getLeagueId(sub);
            const fixtures = await getFixtures(leagueId, new Date());
            if (fixtures.length === 0) {
                return await sock.sendMessage(m.chat, { text: '❌ No matches found for today.' });
            }
            const leagueName = getLeagueNameFromId(leagueId);
            const lines = fixtures.map(f => formatMatch(f));
            const title = `📅 TODAY'S MATCHES • ${leagueName.toUpperCase()}`;
            const box = createBorder(title, lines);
            return await sock.sendMessage(m.chat, { text: box });
        }

        // Subcommands
        switch (sub) {
            case 'live': {
                const fixtures = await getLiveFixtures();
                if (fixtures.length === 0) {
                    return await sock.sendMessage(m.chat, { text: '🟢 No live matches at the moment.' });
                }
                const lines = fixtures.map(f => formatMatch(f));
                const box = createBorder('🔴 LIVE MATCHES', lines);
                return await sock.sendMessage(m.chat, { text: box });
            }

            case 'tomorrow': {
                const tomorrow = addDays(new Date(), 1);
                let allFixtures = [];
                for (const lid of TOP_LEAGUES) {
                    const f = await getFixtures(lid, tomorrow);
                    allFixtures = allFixtures.concat(f);
                }
                allFixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
                if (allFixtures.length === 0) {
                    return await sock.sendMessage(m.chat, { text: '📅 No matches found for tomorrow.' });
                }
                const lines = allFixtures.map(f => formatMatch(f));
                const box = createBorder('📅 TOMORROW\'S FIXTURES', lines);
                return await sock.sendMessage(m.chat, { text: box });
            }

            case 'table': {
                let leagueName = rest[0] || 'epl';
                const leagueId = getLeagueId(leagueName);
                if (!leagueId) {
                    return await sock.sendMessage(m.chat, { text: `❌ Unknown league: "${leagueName}". Available: epl, la liga, bundesliga, serie a, ligue 1, champions league` });
                }
                const standings = await getStandings(leagueId);
                if (standings.length === 0) {
                    return await sock.sendMessage(m.chat, { text: `❌ No standings found for ${leagueName}.` });
                }
                const lines = formatStandings(standings);
                const title = `🏆 STANDINGS • ${leagueName.toUpperCase()}`;
                const box = createBorder(title, lines);
                return await sock.sendMessage(m.chat, { text: box });
            }

            case 'team': {
                if (!rest.length) {
                    return await sock.sendMessage(m.chat, { text: '❌ Please provide a team name. Example: .football team Arsenal' });
                }
                const teamName = rest.join(' ');
                const teams = await searchTeam(teamName);
                if (teams.length === 0) {
                    return await sock.sendMessage(m.chat, { text: `❌ Team "${teamName}" not found.` });
                }
                const team = teams[0];
                const teamId = team.team.id;
                const now = new Date();
                const from = addDays(now, -7);
                const to = addDays(now, 14);
                const fixtures = await getTeamFixtures(teamId, from, to);
                if (fixtures.length === 0) {
                    return await sock.sendMessage(m.chat, { text: `📅 No recent or upcoming fixtures for ${team.team.name}.` });
                }
                fixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
                const lines = fixtures.map(f => formatMatch(f));
                const title = `⚽ ${team.team.name.toUpperCase()} • FIXTURES`;
                const box = createBorder(title, lines);
                return await sock.sendMessage(m.chat, { text: box });
            }

            default: {
                // If sub is non‑empty, treat as team search
                if (sub.length > 0) {
                    const teamName = args.join(' ');
                    const teams = await searchTeam(teamName);
                    if (teams.length === 0) {
                        return await sock.sendMessage(m.chat, { text: `❌ Team "${teamName}" not found.` });
                    }
                    const team = teams[0];
                    const teamId = team.team.id;
                    const now = new Date();
                    const from = addDays(now, -7);
                    const to = addDays(now, 14);
                    const fixtures = await getTeamFixtures(teamId, from, to);
                    if (fixtures.length === 0) {
                        return await sock.sendMessage(m.chat, { text: `📅 No recent or upcoming fixtures for ${team.team.name}.` });
                    }
                    fixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
                    const lines = fixtures.map(f => formatMatch(f));
                    const title = `⚽ ${team.team.name.toUpperCase()}`;
                    const box = createBorder(title, lines);
                    return await sock.sendMessage(m.chat, { text: box });
                }

                // Default: show today's top league fixtures
                let allFixtures = [];
                for (const lid of TOP_LEAGUES) {
                    const f = await getFixtures(lid, new Date());
                    allFixtures = allFixtures.concat(f);
                }
                allFixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
                if (allFixtures.length === 0) {
                    return await sock.sendMessage(m.chat, { text: '📅 No matches scheduled for today.' });
                }
                const lines = allFixtures.map(f => formatMatch(f));
                const box = createBorder('📅 TODAY\'S TOP FIXTURES', lines);
                return await sock.sendMessage(m.chat, { text: box });
            }
        }
    } catch (error) {
        console.error('Football plugin error:', error);
        let msg = '❌ An error occurred while fetching football data.';
        if (error.message.includes('API key')) {
            msg = '❌ ' + error.message;
        } else if (error.message.includes('timeout')) {
            msg = '⏰ API request timed out. Please try again later.';
        } else if (error.message.includes('rate limit')) {
            msg = '⏳ API rate limit exceeded. Please wait a moment.';
        } else if (error.message.includes('not found') || error.message.includes('404')) {
            msg = '❌ Data not found. Please check your input.';
        }
        await sock.sendMessage(m.chat, { text: msg });
    }
});
