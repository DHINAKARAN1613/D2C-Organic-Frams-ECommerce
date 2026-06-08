'use client';

import { useEffect, useState } from 'react';
import { CloudRain, Sun, Wind, Droplets, Loader2, ThermometerSun } from 'lucide-react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch weather for a central agricultural location (e.g., Tamil Nadu, India)
        // Using Open-Meteo API which is 100% Free and Open Source (No API key needed)
        const fetchWeather = async () => {
            try {
                // Coordinates for Tamil Nadu (Example farm location)
                const lat = 11.1271;
                const lon = 78.6569;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`;
                
                const res = await fetch(url);
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.error("Failed to fetch weather data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#30e87a] animate-spin" />
            </div>
        );
    }

    if (!weather) return null;

    const current = weather.current;
    const isDay = current.is_day === 1;

    return (
        <div className="bg-gradient-to-br from-[#1c2e24] to-[#112117] border border-[#2d4035] rounded-2xl p-6 relative overflow-hidden shadow-xl">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 opacity-10">
                {isDay ? <Sun className="w-48 h-48 text-amber-500" /> : <CloudRain className="w-48 h-48 text-blue-500" />}
            </div>

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ThermometerSun className="w-5 h-5 text-[#30e87a]" />
                        Farm Weather Forecast
                    </h3>
                    <p className="text-sm text-[#9db8a8]">Live data from Open-Meteo</p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-white">{current.temperature_2m}°C</p>
                    <p className="text-sm text-[#30e87a] font-bold">
                        {current.precipitation > 0 ? 'Raining' : isDay ? 'Sunny' : 'Clear Night'}
                    </p>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4">
                <div className="bg-[#112117]/80 backdrop-blur-sm border border-[#2d4035] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <Droplets className="w-5 h-5 text-blue-400 mb-1" />
                    <p className="text-xs text-[#9db8a8]">Humidity</p>
                    <p className="text-sm font-bold text-white">{current.relative_humidity_2m}%</p>
                </div>
                
                <div className="bg-[#112117]/80 backdrop-blur-sm border border-[#2d4035] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <Wind className="w-5 h-5 text-gray-400 mb-1" />
                    <p className="text-xs text-[#9db8a8]">Wind</p>
                    <p className="text-sm font-bold text-white">{current.wind_speed_10m} km/h</p>
                </div>

                <div className="bg-[#112117]/80 backdrop-blur-sm border border-[#2d4035] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <CloudRain className="w-5 h-5 text-blue-300 mb-1" />
                    <p className="text-xs text-[#9db8a8]">Rain Prob.</p>
                    <p className="text-sm font-bold text-white">{weather.daily.precipitation_probability_max[0]}%</p>
                </div>
            </div>
        </div>
    );
}
