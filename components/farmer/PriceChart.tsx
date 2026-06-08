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
        <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Market Price Trends (₹/kg)</h3>
                <p className="text-sm text-[#9db8a8]">Historical average prices for top organic crops</p>
            </div>
            
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d4035" />
                        <XAxis dataKey="name" stroke="#9db8a8" />
                        <YAxis stroke="#9db8a8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#112117', border: '1px solid #2d4035', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="OrganicTomatoes" stroke="#ff4d4f" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="OrganicOnions" stroke="#30e87a" strokeWidth={2} />
                        <Line type="monotone" dataKey="Spinach" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
