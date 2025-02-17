import type { Expense } from "../types"

// Sistema de categorização expandido com mais palavras-chave
const categoryKeywords: Record<string, string[]> = {
  Alimentação: [
    "restaurante", "supermercado", "lanchonete", "café", "ifood", "rappi", 
    "padaria", "mercado", "açougue", "food", "burger", "pizza", "alimentação"
  ],
  Transporte: [
    "uber", "taxi", "ônibus", "metrô", "combustível", "99", "cabify", 
    "posto", "estacionamento", "pedágio", "passagem", "transporte"
  ],
  Moradia: [
    "aluguel", "condomínio", "luz", "água", "gás", "internet", "iptu", 
    "manutenção", "reforma", "móveis", "moradia"
  ],
  Saúde: [
    "farmácia", "hospital", "médico", "dentista", "plano de saúde", 
    "academia", "psicólogo", "exames", "saúde"
  ],
  Entretenimento: [
    "cinema", "teatro", "show", "streaming", "netflix", "spotify", "amazon", 
    "disney", "hbo", "jogos", "game", "steam", "playstation", "entretenimento"
  ],
  Educação: [
    "escola", "faculdade", "curso", "livro", "udemy", "alura", 
    "coursera", "material escolar", "educação"
  ],
  Serviços: [
    "assinatura", "mensalidade", "serviço", "manutenção", 
    "limpeza", "lavanderia", "serviços"
  ],
  Compras: [
    "shopping", "loja", "roupa", "calçado", "acessório", "eletrônico",
    "amazon", "mercadolivre", "magazine", "americanas", "compras"
  ]
}

export function categorizarDespesa(despesa: Omit<Expense, "id" | "category">): string {
  const descricaoLowerCase = despesa.description.toLowerCase()

  // Primeiro tenta categorizar pela descrição
  for (const [categoria, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => descricaoLowerCase.includes(keyword.toLowerCase()))) {
      return categoria
    }
  }

  return "Outros"
}

