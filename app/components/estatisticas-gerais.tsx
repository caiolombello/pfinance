import type { Expense } from "./types"

interface EstatisticasGeraisProps {
  expenses: Expense[]
}

export function EstatisticasGerais({ expenses }: EstatisticasGeraisProps) {
  const totalGasto = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const mediaGasto = totalGasto / expenses.length
  const maiorDespesa = Math.max(...expenses.map((expense) => expense.amount))
  const menorDespesa = Math.min(...expenses.map((expense) => expense.amount))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-primary/10 p-4 rounded-lg">
        <h3 className="font-semibold text-lg">Total Gasto</h3>
        <p className="text-2xl font-bold">R$ {totalGasto.toFixed(2)}</p>
      </div>
      <div className="bg-primary/10 p-4 rounded-lg">
        <h3 className="font-semibold text-lg">Média de Gastos</h3>
        <p className="text-2xl font-bold">R$ {mediaGasto.toFixed(2)}</p>
      </div>
      <div className="bg-primary/10 p-4 rounded-lg">
        <h3 className="font-semibold text-lg">Maior Despesa</h3>
        <p className="text-2xl font-bold">R$ {maiorDespesa.toFixed(2)}</p>
      </div>
      <div className="bg-primary/10 p-4 rounded-lg">
        <h3 className="font-semibold text-lg">Menor Despesa</h3>
        <p className="text-2xl font-bold">R$ {menorDespesa.toFixed(2)}</p>
      </div>
    </div>
  )
}

