# CLAUDE.md — FinControl Frontend (fin.jcrlabs.net)

> Extiende: `SHARED-CLAUDE.md` (sección React + Vite + Tailwind)

## Project Overview

Dashboard financiero personal estilo banking. Visualiza cuentas, transacciones double-entry, presupuestos, e informes financieros (P&L, balance sheet, cash flow). Formularios complejos con N entries dinámicas donde debit + credit siempre cuadran. UI orientada a datos con tablas, filtros, y gráficas interactivas.

## Tech Stack

- **Framework**: React 19 con TypeScript 5.x (strict mode)
- **Build tool**: Vite 6.x
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts (line, bar, area, pie, sunburst para categorías)
- **Data fetching**: TanStack React Query v5 (cache + refetch + optimistic updates)
- **HTTP client**: Axios con interceptor JWT refresh (patrón inventory-front)
- **State management**: Zustand (auth store, UI preferences, currency selection)
- **Router**: React Router v7
- **Forms**: React Hook Form + Zod (validación de transacciones)
- **Dates**: date-fns (formateo de periodos contables, rangos mes/trimestre/año)
- **Tables**: TanStack Table v8 (sorting, filtering, pagination server-side)
- **Numbers**: dinero.js o formateo custom con Intl.NumberFormat (NUNCA float para display de dinero)
- **Linter**: ESLint + Prettier

## Architecture

```
fincontrol-front/
├── public/
├── src/
│   ├── api/
│   │   ├── client.ts                    # Axios instance + Bearer token + 401 refresh interceptor
│   │   ├── accounts.ts                  # CRUD cuentas: GET/POST/PUT /api/v1/accounts
│   │   ├── transactions.ts              # Journal entries: GET/POST /api/v1/transactions
│   │   ├── categories.ts               # Árbol categorías: GET/POST/PUT /api/v1/categories
│   │   ├── budgets.ts                   # Presupuestos: GET/POST/PUT /api/v1/budgets
│   │   ├── reports.ts                   # Informes: GET /api/v1/reports/{type}
│   │   ├── scheduled.ts                # Recurrentes: GET/POST/PUT/DELETE /api/v1/scheduled
│   │   ├── import.ts                    # Import CSV/OFX: POST /api/v1/import
│   │   └── auth.ts                      # Login/register/refresh: /api/v1/auth/*
│   │
│   ├── components/
│   │   ├── common/                      # ── Reutilizables ──
│   │   │   ├── Modal.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── MoneyDisplay.tsx         # Formatea dinero con currency symbol + locale
│   │   │   │                            # SIEMPRE usar Intl.NumberFormat, NUNCA .toFixed(2)
│   │   │   ├── DateRangePicker.tsx      # Selector de rango: mes, trimestre, año, custom
│   │   │   └── CurrencySelect.tsx       # Selector EUR/USD/GBP
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx               # Shell con sidebar + navbar
│   │   │   ├── Sidebar.tsx              # Nav: Dashboard, Cuentas, Transacciones, Presupuestos, Informes, Import
│   │   │   └── Navbar.tsx               # User menu, currency selector, periodo actual
│   │   │
│   │   ├── dashboard/                   # ── Dashboard financiero ──
│   │   │   ├── BalanceCard.tsx          # Balance neto (assets - liabilities)
│   │   │   ├── IncomeExpenseCard.tsx    # Ingresos vs gastos periodo actual
│   │   │   ├── BurnRateCard.tsx         # Gasto diario promedio + proyección fin de mes
│   │   │   ├── TrendChart.tsx           # Line chart: ingresos vs gastos 12 meses (Recharts)
│   │   │   ├── CategoryBreakdown.tsx    # Pie/sunburst chart: gasto por categoría
│   │   │   ├── AccountsList.tsx         # Mini lista de cuentas con balances
│   │   │   ├── RecentTransactions.tsx   # Últimas 10 transacciones
│   │   │   └── BudgetAlerts.tsx         # Presupuestos al 80%+ con progress bars
│   │   │
│   │   ├── accounts/                    # ── Gestión de cuentas ──
│   │   │   ├── AccountsTable.tsx        # Tabla con tipo, balance, currency, acciones
│   │   │   ├── AccountForm.tsx          # Crear/editar cuenta (nombre, tipo, currency, balance inicial)
│   │   │   └── AccountDetail.tsx        # Detalle con historial de movimientos
│   │   │
│   │   ├── transactions/               # ── Transacciones (double-entry) ──
│   │   │   ├── TransactionsTable.tsx    # Tabla principal: fecha, descripción, entries, total
│   │   │   ├── TransactionForm.tsx      # ⭐ COMPONENTE CLAVE — ver sección dedicada abajo
│   │   │   ├── TransactionDetail.tsx    # Vista detalle: journal entry + entries[] + audit info
│   │   │   ├── EntryRow.tsx             # Una línea de entry: cuenta + monto (debit/credit)
│   │   │   ├── BalanceIndicator.tsx     # Muestra sum en tiempo real: verde si = 0, rojo si ≠ 0
│   │   │   └── TransactionFilters.tsx   # Filtros: rango fechas, cuenta, categoría, tipo
│   │   │
│   │   ├── categories/                  # ── Categorías jerárquicas ──
│   │   │   ├── CategoryTree.tsx         # Árbol expandible/colapsable (N niveles)
│   │   │   ├── CategoryForm.tsx         # Crear/editar con parent selector
│   │   │   └── CategorySelect.tsx       # Dropdown con indentación por nivel
│   │   │
│   │   ├── budgets/                     # ── Presupuestos ──
│   │   │   ├── BudgetsTable.tsx         # Tabla: categoría, presupuesto, gastado, % con progress bar
│   │   │   ├── BudgetForm.tsx           # Crear/editar: categoría, monto, mes
│   │   │   └── BudgetProgress.tsx       # Progress bar con colores: verde < 80%, amber 80-100%, rojo > 100%
│   │   │
│   │   ├── reports/                     # ── Informes financieros ──
│   │   │   ├── ProfitAndLoss.tsx        # P&L: ingresos - gastos = resultado (tabla + bar chart)
│   │   │   ├── BalanceSheet.tsx         # Assets vs liabilities vs equity (tabla agrupada)
│   │   │   ├── CashFlow.tsx             # Cash flow por periodo (waterfall chart)
│   │   │   ├── CategoryReport.tsx       # Desglose por categoría (sunburst + tabla drill-down)
│   │   │   └── ReportDateSelector.tsx   # Selector: mes, trimestre, año, rango custom
│   │   │
│   │   ├── scheduled/                   # ── Transacciones recurrentes ──
│   │   │   ├── ScheduledTable.tsx       # Lista de recurrentes: próxima ejecución, frecuencia
│   │   │   └── ScheduledForm.tsx        # Crear: template transaction + frecuencia (diaria/semanal/mensual)
│   │   │
│   │   └── import/                      # ── Import CSV/OFX ──
│   │       ├── ImportUpload.tsx         # Drag & drop + file select
│   │       ├── ImportPreview.tsx        # Preview filas parseadas, mapeo columnas
│   │       ├── ImportMapping.tsx        # Asignar columnas CSV → campos (fecha, monto, descripción)
│   │       └── ImportResult.tsx         # Resultado: importadas, duplicadas, errores
│   │
│   ├── hooks/
│   │   ├── useAccounts.ts               # React Query: list, get, create, update accounts
│   │   ├── useTransactions.ts           # React Query: list (paginated), create, void transaction
│   │   ├── useCategories.ts             # React Query: tree, create, update categories
│   │   ├── useBudgets.ts                # React Query: list, create, update, progress
│   │   ├── useReports.ts                # React Query: P&L, balance sheet, cash flow, category
│   │   ├── useScheduled.ts              # React Query: list, create, update, delete scheduled
│   │   ├── useImport.ts                 # Mutation: upload + preview + confirm import
│   │   ├── useDateRange.ts              # State: periodo seleccionado (mes/trimestre/año/custom)
│   │   ├── useCurrency.ts               # Zustand: currency activa + format helpers
│   │   ├── useBalanceCheck.ts           # Calcula sum de entries en tiempo real para formulario
│   │   ├── useDebounce.ts               # Debounce para filtros de búsqueda
│   │   └── usePermissions.ts            # Role check (extensible si multi-user futuro)
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx            # Grid de cards + charts (vista principal)
│   │   ├── AccountsPage.tsx             # Tabla cuentas + CRUD
│   │   ├── TransactionsPage.tsx         # Tabla transacciones + filtros + crear
│   │   ├── CategoriesPage.tsx           # Árbol categorías + CRUD
│   │   ├── BudgetsPage.tsx              # Tabla presupuestos + progress
│   │   ├── ReportsPage.tsx              # Tabs: P&L | Balance Sheet | Cash Flow | Categorías
│   │   ├── ScheduledPage.tsx            # Tabla recurrentes + CRUD
│   │   ├── ImportPage.tsx               # Wizard import CSV/OFX
│   │   ├── LoginPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── store/
│   │   ├── authStore.ts                 # Zustand: user, tokens, role, login/logout actions
│   │   └── uiStore.ts                   # Zustand: sidebar collapsed, dark mode, currency, periodo
│   │
│   ├── types/
│   │   ├── account.ts                   # Account, AccountType (asset/liability/equity/income/expense)
│   │   ├── transaction.ts               # JournalEntry, Entry, TransactionType
│   │   ├── category.ts                  # Category (con parent_id, children[])
│   │   ├── budget.ts                    # Budget, BudgetProgress
│   │   ├── report.ts                    # ProfitAndLoss, BalanceSheet, CashFlow, CategoryReport
│   │   ├── scheduled.ts                # ScheduledTransaction, Frequency
│   │   ├── import.ts                    # ImportPreview, ImportResult, ColumnMapping
│   │   └── common.ts                    # PaginatedResponse<T>, ApiError, DateRange, Money
│   │
│   ├── utils/
│   │   ├── money.ts                     # formatMoney(amount, currency) → "€1,234.56"
│   │   │                                # USAR Intl.NumberFormat con locale + currency code
│   │   │                                # NUNCA: amount.toFixed(2), NUNCA: `€${amount}`
│   │   ├── dates.ts                     # formatDate, getMonthRange, getQuarterRange, getYearRange
│   │   ├── categories.ts               # buildTree(flat[]) → nested[], flattenTree(), getAncestors()
│   │   └── validation.ts               # Zod schemas para forms
│   │
│   ├── App.tsx                          # Router setup + QueryClientProvider + auth guard
│   └── main.tsx                         # Entry point
│
├── nginx.conf                           # SPA routing + proxy /api/ → backend service
├── Dockerfile                           # Multi-stage: node build → nginx serve
├── .env.example                         # VITE_API_URL=http://localhost:8080
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## ⭐ TransactionForm — Componente Clave

Este es el componente más complejo. Implementa double-entry con N entries dinámicas:

```tsx
// Estructura del formulario
interface TransactionFormData {
  date: string;                    // ISO date
  description: string;
  category_id: string;
  entries: EntryFormData[];        // Mínimo 2, dinámicas
}

interface EntryFormData {
  account_id: string;              // Select de cuentas
  amount: string;                  // String para evitar floating point — parsear con parseFloat solo al submit
  type: 'debit' | 'credit';       // Toggle o selector
}

// REGLAS DEL FORMULARIO:
// 1. Mínimo 2 entries (no se puede borrar si solo quedan 2)
// 2. Botón "Add Entry" para splits (1 ingreso → N cuentas)
// 3. BalanceIndicator en tiempo real:
//    - Suma debits y credits por separado
//    - Muestra diferencia: verde "Balanced ✓" si diff = 0, rojo "Unbalanced: €X.XX" si ≠ 0
// 4. Submit DESHABILITADO si balance ≠ 0
// 5. Shortcut: para gasto simple, auto-completar 2 entries (cuenta gasto + cuenta pago)
// 6. Amounts SIEMPRE como string en el form, convertir a number solo al submit
```

```tsx
// Hook useBalanceCheck — calcular balance en tiempo real
function useBalanceCheck(entries: EntryFormData[]) {
  return useMemo(() => {
    let debits = 0;
    let credits = 0;
    for (const entry of entries) {
      const amount = parseFloat(entry.amount) || 0;
      if (entry.type === 'debit') debits += amount;
      else credits += amount;
    }
    const balance = debits - credits;
    return {
      debits,
      credits,
      balance,
      isBalanced: Math.abs(balance) < 0.001,  // Tolerance para floating point
    };
  }, [entries]);
}
```

## Quick Transaction Mode

Para el 90% de transacciones (gasto simple, ingreso simple, transferencia) ofrecer un modo simplificado:

```
┌─ Quick Transaction ──────────────────────────────────────┐
│  Tipo:  [Gasto ▼]                                        │
│  Cuenta pago:  [Cuenta corriente ▼]                      │
│  Categoría:    [Alimentación > Supermercado ▼]           │
│  Monto:        [€ 45.80]                                 │
│  Descripción:  [Compra Mercadona]                        │
│  Fecha:        [2026-03-26]                              │
│                                                          │
│  → Auto-genera 2 entries:                                │
│    Debit:  Alimentación:Supermercado  €45.80             │
│    Credit: Cuenta corriente           €45.80             │
│                                                          │
│  [Modo avanzado ↗]              [Guardar]                │
└──────────────────────────────────────────────────────────┘
```

El "Modo avanzado" abre el TransactionForm completo con N entries.

## API Endpoints (match con backend)

```
Auth:
  POST   /api/v1/auth/register         → { email, password, name }
  POST   /api/v1/auth/login            → { email, password } → { access_token, refresh_token }
  POST   /api/v1/auth/refresh           → { refresh_token } → { access_token }

Accounts:
  GET    /api/v1/accounts               → Account[] (con balance calculado)
  POST   /api/v1/accounts               → { name, type, currency, initial_balance }
  PUT    /api/v1/accounts/:id           → { name }
  GET    /api/v1/accounts/:id/entries   → Entry[] paginated (movimientos de la cuenta)

Transactions:
  GET    /api/v1/transactions           → JournalEntry[] paginated + filtros (date_from, date_to, account_id, category_id)
  POST   /api/v1/transactions           → { date, description, category_id, entries[] }
  GET    /api/v1/transactions/:id       → JournalEntry con entries[] expandidas
  POST   /api/v1/transactions/:id/void  → Crear reverse entry (NUNCA delete)

Categories:
  GET    /api/v1/categories             → Category[] (flat, frontend construye árbol)
  POST   /api/v1/categories             → { name, parent_id? }
  PUT    /api/v1/categories/:id         → { name, parent_id? }

Budgets:
  GET    /api/v1/budgets                → Budget[] con progress (spent, percentage)
  POST   /api/v1/budgets                → { category_id, month, amount }
  PUT    /api/v1/budgets/:id            → { amount }

Reports:
  GET    /api/v1/reports/pnl            → { income, expenses, net } + breakdown por categoría
  GET    /api/v1/reports/balance-sheet   → { assets[], liabilities[], equity, net_worth }
  GET    /api/v1/reports/cash-flow       → { periods[]: { month, inflow, outflow, net } }
  GET    /api/v1/reports/categories      → { categories[]: { name, total, percentage, children[] } }
  // Todos aceptan query params: from, to, currency

Scheduled:
  GET    /api/v1/scheduled              → ScheduledTransaction[]
  POST   /api/v1/scheduled              → { frequency, next_run, template_transaction }
  PUT    /api/v1/scheduled/:id          → { frequency, next_run, active }
  DELETE /api/v1/scheduled/:id          → Soft delete (active = false)

Import:
  POST   /api/v1/import/preview         → multipart file → { rows[], suggested_mapping }
  POST   /api/v1/import/confirm         → { mapping, rows_to_import[] } → { imported, duplicates, errors }
```

## Auth Pattern (copiar de inventory-front)

```typescript
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { data } = await axios.post('/api/v1/auth/refresh', { refresh_token: refreshToken });
        useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
        error.config.headers.Authorization = `Bearer ${data.access_token}`;
        return api(error.config);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Money Display Rules

```typescript
// utils/money.ts
// REGLA ABSOLUTA: NUNCA usar .toFixed(2) ni template literals para dinero

export function formatMoney(amount: number, currency: string = 'EUR', locale: string = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Colores por contexto:
// - Positivo (ingreso/asset): text-green-600
// - Negativo (gasto/liability): text-red-600
// - Neutro (transferencia): text-gray-700

// MoneyDisplay component
// <MoneyDisplay amount={1234.56} currency="EUR" />  → "1.234,56 €"
// <MoneyDisplay amount={-50} currency="EUR" colored /> → rojo "-50,00 €"
```

## Recharts Patterns (gráficas financieras)

```tsx
// TrendChart — Ingresos vs Gastos 12 meses
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={monthlyData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis tickFormatter={(v) => formatMoney(v, currency)} />
    <Tooltip formatter={(v) => formatMoney(v as number, currency)} />
    <Area type="monotone" dataKey="income" stroke="#16a34a" fill="#bbf7d0" />
    <Area type="monotone" dataKey="expenses" stroke="#dc2626" fill="#fecaca" />
  </AreaChart>
</ResponsiveContainer>

// CategoryBreakdown — Sunburst/Treemap por categoría
// Usar PieChart con datos nested para drill-down

// BudgetProgress — Progress bars con thresholds
// < 80%: bg-green-500
// 80-100%: bg-amber-500
// > 100%: bg-red-500 + pulse animation
```

## Category Tree Utils

```typescript
// utils/categories.ts
interface CategoryNode {
  id: string;
  name: string;
  parent_id: string | null;
  children: CategoryNode[];
}

// API devuelve flat → frontend construye árbol
export function buildTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }
  for (const node of map.values()) {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// CategorySelect: mostrar con indentación
// "Alimentación"
// "  └ Supermercado"
// "    └ Mercadona"
// "  └ Restaurantes"
```

## React Query Patterns

```typescript
// hooks/useTransactions.ts
export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.list(filters),
    placeholderData: keepPreviousData,  // Evitar flash en paginación
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      // Invalidar transacciones Y cuentas (balances cambian) Y reports
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });  // Progress cambia
    },
  });
}

export function useVoidTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsApi.void(id),
    onSuccess: () => {
      // Mismo invalidation que create — void genera reverse entries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
```

## Routing

```tsx
// App.tsx routes
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route index element={<DashboardPage />} />
    <Route path="accounts" element={<AccountsPage />} />
    <Route path="accounts/:id" element={<AccountDetail />} />
    <Route path="transactions" element={<TransactionsPage />} />
    <Route path="transactions/:id" element={<TransactionDetail />} />
    <Route path="categories" element={<CategoriesPage />} />
    <Route path="budgets" element={<BudgetsPage />} />
    <Route path="reports" element={<ReportsPage />} />
    <Route path="scheduled" element={<ScheduledPage />} />
    <Route path="import" element={<ImportPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

## Docker (multi-stage)

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA routing
    }

    location /api/ {
        proxy_pass http://fincontrol-back:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Commands

```bash
npm run dev        # Dev server Vite (port 5173)
npm run build      # Build producción
npm run lint       # ESLint
npm run preview    # Preview del build
```

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
# Trigger: push to develop (→ test), push to main (→ prod)
# Steps:
# 1. npm ci
# 2. npm run lint
# 3. npm run build
# 4. docker build -t ghcr.io/jonathancaamano/fincontrol-front:$TAG .
# 5. docker push
# 6. ArgoCD sync fincontrol-front-{test|prod}
```

## K8s / Helm

```
Namespace: fincontrol (prod), fincontrol-test (test)
Ingress: fin.jcrlabs.net (prod), fin-test.jcrlabs.net (test)
Replicas: 1 (test), 2 (prod)
Service: fincontrol-front → port 80 (nginx)
```

## Design Guidelines

- **Dark mode**: toggle con persistencia en localStorage, clases Tailwind `dark:`
- **Responsive**: sidebar colapsable en móvil, tablas con scroll horizontal
- **Color palette financiera**:
  - Green (#16a34a): ingresos, assets, positive, balanced
  - Red (#dc2626): gastos, liabilities, negative, unbalanced, over-budget
  - Amber (#d97706): warnings, budget 80-100%
  - Blue (#2563eb): transfers, neutral actions
  - Gray (#6b7280): disabled, secondary text
- **Loading states**: Skeleton en todas las cards y tablas
- **Empty states**: Ilustración + CTA para crear primer recurso
- **Toast notifications**: react-hot-toast para success/error de mutations
- **Confirmación**: ConfirmDialog antes de void transaction (es irreversible conceptualmente)

## Dev Workflow con Claude Code

```bash
# Sesión 1: Setup + Auth + Layout
# - Scaffold Vite + React + Tailwind + React Router
# - authStore + login page + protected route
# - Layout con sidebar + navbar

# Sesión 2: Accounts + Categories
# - AccountsTable + AccountForm + AccountDetail
# - CategoryTree + CategoryForm + CategorySelect
# - React Query hooks para ambos

# Sesión 3: Transactions (core)
# - TransactionForm con entries dinámicas + BalanceIndicator
# - Quick Transaction mode
# - TransactionsTable con filtros + paginación
# - TransactionDetail + void action

# Sesión 4: Dashboard + Charts
# - Dashboard grid con todas las cards
# - Recharts: TrendChart, CategoryBreakdown
# - BudgetAlerts con progress bars

# Sesión 5: Reports + Budgets + Scheduled
# - ReportsPage con tabs (P&L, Balance Sheet, Cash Flow, Categories)
# - BudgetsTable + BudgetForm + BudgetProgress
# - ScheduledTable + ScheduledForm

# Sesión 6: Import + Polish
# - ImportPage wizard (upload → preview → mapping → confirm)
# - Dark mode toggle
# - Empty states, loading states, error boundaries
# - Responsive ajustes
```

## CI local

Ejecutar **antes de cada commit** para evitar que lleguen errores a GitHub Actions:

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```
## Git

- Ramas: `feature/`, `bugfix/`, `hotfix/`, `release/` — sin prefijos adicionales
- Commits: convencional (`feat:`, `fix:`, `chore:`, etc.) — sin mencionar herramientas externas ni agentes en el mensaje
- PRs: título y descripción propios del cambio — sin mencionar herramientas externas ni agentes
- Comentarios y documentación: redactar en primera persona del equipo — sin atribuir autoría a herramientas
