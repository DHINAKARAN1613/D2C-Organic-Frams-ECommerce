'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', OrganicTomatoes: 40, OrganicOnions: 24, Spinach: 24 },
  { name: 'Feb', OrganicTomatoes: 30, OrganicOnions: 13, Spinach: 22 },
  { name: 'Mar', OrganicTomatoes: 20, OrganicOnions: 58, Spinach: 22 },
  { name: 'Apr', OrganicTomatoes: 27, OrganicOnions: 39, Spinach: 20 },
  { name: 'May', OrganicTomatoes: 18, OrganicOnions: 48, Spinach: 21 },
  { name: 'Jun', OrganicTomatoes: 23, OrganicOnions: 38, Spinach: 25 },
  { name: 'Jul', OrganicTomatoes: 34, OrganicOnions: 43, Spinach: 21 },
];

export default function PriceChart() {
    return (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-md">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">Market Price Trends (₹/kg)</h3>
                <p className="text-sm font-medium text-muted-foreground">Historical average prices for top organic crops</p>
            </div>
            
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--surface, #112117)', borderColor: 'var(--border, #2d4035)', borderRadius: '8px', color: 'var(--foreground, #fff)' }}
                            itemStyle={{ color: 'var(--foreground, #fff)' }}
                        />
                        <Line type="monotone" dataKey="OrganicTomatoes" stroke="#ff4d4f" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="OrganicOnions" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="Spinach" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
