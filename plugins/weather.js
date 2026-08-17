'use strict';

const axios = require('axios');
const { cmd } = require('../arslan');

cmd({
    pattern: 'weather',
    name: 'weather',
    category: 'Tools',
    description: 'Check current weather conditions',
    aliases: ['forecast', 'climate'],
    filename: __filename
}, async (sock, m, args) => {

    try {

        const city = args.join(' ').trim();

        if (!city) {
            return m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🌤️ *WEATHER*
┃
┃ Usage:
┃ .weather Nairobi
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        const search = await axios.get(
            'https://geocoding-api.open-meteo.com/v1/search',
            {
                params: {
                    name: city,
                    count: 1,
                    language: 'en',
                    format: 'json'
                },
                timeout: 10000
            }
        );

        const place = search.data?.results?.[0];

        if (!place) {
            return m.reply(
                `❌ *Location not found:* ${city}`
            );
        }

        const weather = await axios.get(
            'https://api.open-meteo.com/v1/forecast',
            {
                params: {
                    latitude: place.latitude,
                    longitude: place.longitude,
                    current:
                        'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
                    timezone: 'auto'
                },
                timeout: 10000
            }
        );

        const current = weather.data?.current;

        if (!current) {
            throw new Error('Weather data unavailable');
        }

        const codes = {
            0: '☀️ Clear sky',
            1: '🌤️ Mainly clear',
            2: '⛅ Partly cloudy',
            3: '☁️ Overcast',
            45: '🌫️ Fog',
            48: '🌫️ Depositing rime fog',
            51: '🌦️ Light drizzle',
            53: '🌦️ Drizzle',
            55: '🌧️ Heavy drizzle',
            61: '🌧️ Light rain',
            63: '🌧️ Rain',
            65: '🌧️ Heavy rain',
            71: '🌨️ Light snow',
            73: '🌨️ Snow',
            75: '❄️ Heavy snow',
            80: '🌦️ Rain showers',
            81: '🌧️ Rain showers',
            82: '⛈️ Heavy rain showers',
            95: '⛈️ Thunderstorm',
            96: '⛈️ Thunderstorm + hail',
            99: '⛈️ Thunderstorm + hail'
        };

        const condition =
            codes[current.weather_code] ||
            '🌡️ Unknown';

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🌤️ *WEATHER*
┃
┃ 📍 *Location:* ${place.name}
┃ 🌡️ *Temperature:* ${current.temperature_2m}°C
┃ 🌡️ *Feels Like:* ${current.apparent_temperature}°C
┃ 💧 *Humidity:* ${current.relative_humidity_2m}%
┃ 💨 *Wind:* ${current.wind_speed_10m} km/h
┃ ☁️ *Condition:* ${condition}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );

    } catch (error) {

        console.error(
            '[FREEZER-MD] Weather Error:',
            error.message
        );

        await m.reply(
`╭━━━━━━━━━━━━━━━━━━━━╮
┃ ❄️ *FREEZER-MD*
┣━━━━━━━━━━━━━━━━━━━━┫
┃
┃ ❌ *Weather unavailable*
┃
┃ Try again shortly.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
