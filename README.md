# Dashboard de Transbordo

Aplicação React para análise de transferências entre depósitos (1-300 ↔ 1-700).

## Pré-requisitos
- Node.js 18+

## Instalação e Execução

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse `http://localhost:5173`.

## Dados
Os dados são carregados do arquivo local:
`public/data/transbordo.json`

Para atualizar os dados, basta substituir este arquivo mantendo a estrutura JSON correta.

## Estrutura
- **App.tsx**: Lógica principal e orquestração.
- **components/ui**: Componentes de interface reutilizáveis (botões, cards, modal).
- **components/Dashboard**: Componentes específicos de negócio (gráficos, listas, filtros).
- **utils/transfers.ts**: Lógica de filtragem, ordenação e cálculo de KPIs.
