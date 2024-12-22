'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  {
    name: "1月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "2月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "3月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "4月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "5月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "6月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "7月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "8月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "9月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "10月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "11月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "12月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
] as const

type DataItem = {
  name: string
  total: number
}

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="hsl(var(--border))"
          opacity={0.3}
        />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          dy={8}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          tickFormatter={(value: number) => `¥${value}`}
          width={80}
        />
        <Tooltip 
          cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '12px'
          }}
          labelStyle={{
            color: 'hsl(var(--foreground))',
            fontWeight: 500,
            marginBottom: '4px'
          }}
          itemStyle={{
            color: 'hsl(var(--muted-foreground))',
            fontSize: '12px'
          }}
          formatter={(value: number) => [`¥${value.toLocaleString()}`, '销售额']}
        />
        <Bar
          dataKey="total"
          fill="url(#colorTotal)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 