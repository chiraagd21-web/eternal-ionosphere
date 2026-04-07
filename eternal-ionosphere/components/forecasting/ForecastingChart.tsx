
'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine,
  ReferenceDot,
  Brush
} from 'recharts'
import { DataPoint } from '@/lib/forecasting'

interface ForecastingChartProps {
  historical: DataPoint[]
  forecast: DataPoint[]
  outliers?: string[]
}

export function ForecastingChart({ historical, forecast, outliers = [] }: ForecastingChartProps) {
  const lastHist = historical[historical.length - 1]
  
  // Combine for shading groups
  const chartData = [
    ...historical.map(d => ({ ...d, type: 'Historical', confidence: [d.value, d.value] })),
    ...forecast.map((d, i) => {
      // Mock confidence spread for visualization
      const spread = (i + 1) * (d.value * 0.05);
      return { 
        ...d, 
        type: 'Forecast', 
        upper: d.value + spread, 
        lower: Math.max(0, d.value - spread) 
      }
    })
  ]

  const formatXAxis = (val: string) => {
    const d = new Date(val)
    if (isNaN(d.getTime())) return val
    return d.toLocaleDateString(undefined, { 
      month: 'short', 
      day: historical.length > 30 ? undefined : 'numeric',
      year: '2-digit' 
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <p className="text-[10px] font-black text-white/30 uppercase mb-4 tracking-[0.3em] border-b border-white/5 pb-2">{formatXAxis(label)}</p>
          <div className="space-y-4">
            {payload.filter((p: any) => p.dataKey === 'value').map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-black text-white leading-none tracking-tighter">
                    {entry.value.toLocaleString()} <span className="text-[10px] text-white/40">UNITS</span>
                  </span>
                  <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">{entry.name}</span>
                </div>
              </div>
            ))}
          </div>
          {payload[0]?.payload?.type === 'Forecast' && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
                <span>Confidence Range</span>
                <span className="text-indigo-400">± {(payload[0].payload.upper - payload[0].value).toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[600px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.05)" />
          
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={formatXAxis}
            minTickGap={40}
            dy={20}
          />
          
          <YAxis 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
            dx={-15}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'rgba(99, 102, 241, 0.4)', strokeWidth: 2, strokeDasharray: '5 5' }} 
            animationDuration={200}
          />

          {/* Confidence Shading Band */}
          <Area
            type="monotone"
            dataKey={"upper" as any}
            stroke="none"
            fill="url(#colorShade)"
            fillOpacity={1}
            data={chartData.filter(d => d.type === 'Forecast' || d === lastHist)}
          />
          <Area
            type="monotone"
            dataKey={"lower" as any}
            stroke="none"
            fill="#050505"
            fillOpacity={1}
            data={chartData.filter(d => d.type === 'Forecast' || d === lastHist)}
          />
          
          <Area 
            name="Neural History"
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorHist)" 
            data={chartData.filter(d => d.type === 'Historical')}
            activeDot={{ r: 8, strokeWidth: 4, stroke: '#050505', fill: '#6366f1' }}
          />
          
          <Area 
            name="AI Prediction"
            type="monotone" 
            dataKey="value" 
            stroke="#a78bfa" 
            strokeWidth={4}
            strokeDasharray="12 8"
            fillOpacity={1} 
            fill="url(#colorFore)" 
            data={chartData.filter(d => d.type === 'Forecast' || d === lastHist)} 
            activeDot={{ r: 8, strokeWidth: 4, stroke: '#050505', fill: '#a78bfa' }}
          />

          {outliers.map(date => (
            <ReferenceLine 
              key={date} 
              x={date} 
              stroke="#f43f5e" 
              strokeWidth={2}
              strokeDasharray="4 4" 
              label={{ position: 'top', value: '∑ ANOMALY', fill: '#f43f5e', fontSize: 9, fontWeight: 900 }}
            />
          ))}

          {forecast.length > 0 && (
            <ReferenceDot 
              x={forecast[forecast.length - 1].date} 
              y={forecast[forecast.length - 1].value} 
              r={6} 
              fill="#a78bfa" 
              stroke="#050505" 
              strokeWidth={3}
            />
          )}

          <Brush 
            dataKey="date" 
            height={30} 
            stroke="#6366f1" 
            fill="rgba(255,255,255,0.02)"
            travellerWidth={10}
            gap={1}
            className="brush-custom"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
