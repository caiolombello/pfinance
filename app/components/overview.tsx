"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { DashboardData } from "../types"
import { useTheme } from "next-themes"

interface OverviewProps {
  data: DashboardData['monthlyOverview']
}

export function Overview({ data }: OverviewProps) {
  const { theme } = useTheme()

  // Função auxiliar para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0 // Remove os centavos para melhor visualização
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 shadow rounded">
          <p className="text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-gray-900 dark:text-gray-100">
            Total: R$ {payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis 
          dataKey="month" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
        <Tooltip 
          content={CustomTooltip}
          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        />
        <Bar 
          dataKey="expenses" 
          fill={theme === "dark" ? "#82ca9d" : "#8884d8"} 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

