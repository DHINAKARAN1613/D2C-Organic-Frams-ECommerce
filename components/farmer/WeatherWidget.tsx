'use client';

import { useEffect, useState } from 'react';
import { CloudRain, Sun, Wind, Droplets, Loader2, ThermometerSun } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WeatherWidget() {
    const { t } = useLanguage();
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
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
            <div className="bg-surface border border-border rounded-2xl p-6 h-48 flex items-center justify-center shadow-md">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!weather) return null;

    const current = weather.current;
    const isDay = current.is_day === 1;

    return (
        <div className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden shadow-md">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                {isDay ? <Sun className="w-48 h-48 text-amber-500" /> : <CloudRain className="w-48 h-48 text-blue-500" />}
            </div>

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <ThermometerSun className="w-5 h-5 text-primary" />
                        {t.farmWeatherForecast}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">{t.liveDataFrom}</p>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-foreground">{current.temperature_2m}°C</p>
                    <p className="text-sm text-primary font-bold">
                        {current.precipitation > 0 ? t.raining : isDay ? t.sunny : t.clearNight}
                    </p>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4">
                <div className="bg-muted/60 backdrop-blur-sm border border-border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                    <Droplets className="w-5 h-5 text-blue-500 mb-1" />
                    <p className="text-xs font-semibold text-muted-foreground">{t.humidity}</p>
                    <p className="text-sm font-bold text-foreground">{current.relative_humidity_2m}%</p>
                </div>
                
                <div className="bg-muted/60 backdrop-blur-sm border border-border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                    <Wind className="w-5 h-5 text-muted-foreground mb-1" />
                    <p className="text-xs font-semibold text-muted-foreground">{t.wind}</p>
                    <p className="text-sm font-bold text-foreground">{current.wind_speed_10m} km/h</p>
                </div>

                <div className="bg-muted/60 backdrop-blur-sm border border-border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                    <CloudRain className="w-5 h-5 text-blue-400 mb-1" />
                    <p className="text-xs font-semibold text-muted-foreground">{t.rainProb}</p>
                    <p className="text-sm font-bold text-foreground">{weather.daily.precipitation_probability_max[0]}%</p>
                </div>
            </div>
        </div>
    );
}
