import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { useTheme } from "next-themes"
import type { Expense } from "@/app/types"

interface GastosMensaisProps {
  expenses: Expense[]
}

export function GastosMensais({ expenses }: GastosMensaisProps) {
  const { theme } = useTheme()

  const gastosPorMes = expenses.reduce(
    (acc, expense) => {
      const date = new Date(expense.date)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
      acc[monthYear] = (acc[monthYear] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(gastosPorMes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const [monthA, yearA] = a.name.split("/")
      const [monthB, yearB] = b.name.split("/")
      return (
        new Date(Number(yearA), Number(monthA) - 1).getTime() - 
        new Date(Number(yearB), Number(monthB) - 1).getTime()
      )
    })

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
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `R$${value}`} />
        <Tooltip 
          content={CustomTooltip}
          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        />
        <Bar 
          dataKey="value" 
          fill={theme === "dark" ? "#82ca9d" : "#8884d8"}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

