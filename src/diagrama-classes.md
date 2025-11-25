# Diagrama de Classes - MyDay

## Visão Geral
Este documento apresenta o diagrama de classes do sistema MyDay, mostrando as estruturas de dados principais: Event (Evento) e User (Usuário), além de suas classes relacionadas.

---

## Diagrama UML

```
┌─────────────────────────────────────────────────┐
│                     User                        │
├─────────────────────────────────────────────────┤
│ - id: string                                    │
│ - name: string                                  │
│ - email: string                                 │
│ - avatar?: string                               │
│ - phone?: string                                │
│ - timezone?: string                             │
└─────────────────────────────────────────────────┘
                      △
                      │
                      │ 1
                      │
                      │ possui
                      │
                      │ 0..*
                      ▼
┌─────────────────────────────────────────────────┐
│                    Event                        │
├─────────────────────────────────────────────────┤
│ - id: string                                    │
│ - title: string                                 │
│ - description: string                           │
│ - startDate: Date                               │
│ - endDate: Date                                 │
│ - startTime: string                             │
│ - endTime: string                               │
│ - type: string                                  │
│ - category: string                              │
│ - priority: 'low' | 'medium' | 'high'          │
│ - location?: string                             │
│ - participants?: string                         │
│ - reminder?: string                             │
│ - repeat?: string                               │
│ - color: string                                 │
│ - notes?: string                                │
└─────────────────────────────────────────────────┘
          │                     │
          │                     │
          │ referencia          │ referencia
          │                     │
          │ 1                   │ 1
          ▼                     ▼
┌──────────────────────┐   ┌──────────────────────┐
│     EventType        │   │   EventCategory      │
├──────────────────────┤   ├──────────────────────┤
│ - id: string         │   │ - id: string         │
│ - name: string       │   │ - name: string       │
│ - color: string      │   │ - color: string      │
│ - icon: string       │   └──────────────────────┘
└──────────────────────┘


┌─────────────────────────────────────────────────┐
│               RepeatOption                      │
├─────────────────────────────────────────────────┤
│ - id: string                                    │
│ - name: string                                  │
│ - value: string                                 │
└─────────────────────────────────────────────────┘
                      △
                      │
                      │ referencia
                      │
                      │ 1
                      │
                  (Event.repeat)
```

---

## Descrição das Classes

### 1. User (Usuário)
Representa um usuário do sistema MyDay.

**Atributos:**
- `id`: Identificador único do usuário
- `name`: Nome completo do usuário
- `email`: Endereço de e-mail (usado para login)
- `avatar` (opcional): URL ou caminho para a foto de perfil
- `phone` (opcional): Número de telefone com código do país
- `timezone` (opcional): Fuso horário do usuário (ex: "America/Sao_Paulo")

**Relacionamentos:**
- Um usuário pode ter vários eventos (0..*)

---

### 2. Event (Evento)
Representa um evento/compromisso na agenda do usuário.

**Atributos:**
- `id`: Identificador único do evento
- `title`: Título/nome do evento
- `description`: Descrição detalhada do evento
- `startDate`: Data de início do evento
- `endDate`: Data de término do evento
- `startTime`: Horário de início (formato HH:MM)
- `endTime`: Horário de término (formato HH:MM)
- `type`: Tipo do evento (referencia EventType)
- `category`: Categoria do evento (referencia EventCategory)
- `priority`: Prioridade ('low', 'medium' ou 'high')
- `location` (opcional): Local onde o evento ocorrerá
- `participants` (opcional): Lista de participantes (string separada por vírgula)
- `reminder` (opcional): Tempo de antecedência do lembrete (ex: "15min", "1hour", "1day")
- `repeat` (opcional): Padrão de repetição (referencia RepeatOption)
- `color`: Cor associada ao evento (formato hexadecimal)
- `notes` (opcional): Notas adicionais sobre o evento

**Relacionamentos:**
- Cada evento pertence a um usuário
- Cada evento referencia um EventType
- Cada evento referencia uma EventCategory
- Cada evento pode referenciar uma RepeatOption

---

### 3. EventType (Tipo de Evento)
Define os tipos predefinidos de eventos disponíveis no sistema.

**Atributos:**
- `id`: Identificador único do tipo
- `name`: Nome do tipo (ex: "Reunião", "Tarefa", "Compromisso")
- `color`: Cor associada em formato hexadecimal
- `icon`: Nome do ícone (usado com lucide-react)

**Exemplos:**
- Reunião (azul, ícone: users)
- Tarefa (verde, ícone: check-circle)
- Compromisso (laranja, ícone: calendar)
- Lembrete (roxo, ícone: bell)
- Pessoal (rosa, ícone: heart)

---

### 4. EventCategory (Categoria de Evento)
Define as categorias predefinidas para organizar eventos.

**Atributos:**
- `id`: Identificador único da categoria
- `name`: Nome da categoria (ex: "Trabalho", "Pessoal", "Saúde")
- `color`: Cor associada em formato hexadecimal

**Exemplos:**
- Trabalho (azul)
- Pessoal (verde)
- Saúde (laranja)
- Educação (roxo)
- Família (rosa)

---

### 5. RepeatOption (Opção de Repetição)
Define as opções de recorrência disponíveis para eventos.

**Atributos:**
- `id`: Identificador único da opção
- `name`: Nome descritivo da opção (ex: "Diariamente", "Semanalmente")
- `value`: Valor usado internamente (ex: "daily", "weekly")

**Exemplos:**
- Não repetir (none)
- Diariamente (daily)
- Semanalmente (weekly)
- Mensalmente (monthly)
- Anualmente (yearly)

---

## Relacionamentos Detalhados

### User → Event (1:N)
- **Cardinalidade:** Um usuário pode ter zero ou muitos eventos
- **Tipo:** Composição (os eventos pertencem ao usuário)
- **Descrição:** Cada evento está associado a um único usuário que o criou

### Event → EventType (N:1)
- **Cardinalidade:** Muitos eventos podem ter o mesmo tipo
- **Tipo:** Associação/Referência
- **Descrição:** O atributo `type` do Event referencia o `name` de um EventType

### Event → EventCategory (N:1)
- **Cardinalidade:** Muitos eventos podem ter a mesma categoria
- **Tipo:** Associação/Referência
- **Descrição:** O atributo `category` do Event referencia o `name` de uma EventCategory

### Event → RepeatOption (N:1)
- **Cardinalidade:** Muitos eventos podem ter a mesma opção de repetição
- **Tipo:** Associação/Referência (opcional)
- **Descrição:** O atributo `repeat` do Event pode referenciar o `value` de uma RepeatOption

---

## Tipos de Dados Utilizados

### TypeScript Types
- `string`: Tipo primitivo para texto
- `Date`: Objeto nativo JavaScript para datas
- `'low' | 'medium' | 'high'`: Union type para prioridades
- `?`: Operador opcional (o atributo pode ser undefined)

---

## Observações de Implementação

1. **Integridade Referencial:**
   - As strings `type`, `category` e `repeat` em Event são valores que correspondem aos nomes/values das classes relacionadas
   - Atualmente implementado como strings simples, mas poderia evoluir para IDs com foreign keys em um banco de dados

2. **Campos Opcionais:**
   - Campos marcados com `?` são opcionais e podem não estar presentes
   - Isso permite flexibilidade na criação de eventos com diferentes níveis de detalhamento

3. **Formato de Dados:**
   - Datas armazenadas como objetos `Date` do JavaScript
   - Horários armazenados como strings no formato "HH:MM"
   - Cores em formato hexadecimal (#RRGGBB)

4. **Escalabilidade:**
   - O modelo permite fácil adição de novos tipos, categorias e opções de repetição
   - Campos como `participants` poderiam evoluir de string para array de User IDs
   - Campo `reminder` poderia se tornar uma entidade própria com múltiplos lembretes

---

## Exemplo de Uso

```typescript
// Usuário
const usuario: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '+55 11 99999-9999',
  timezone: 'America/Sao_Paulo'
};

// Evento
const evento: Event = {
  id: '1',
  title: 'Reunião com Cliente',
  description: 'Discutir proposta do novo projeto',
  startDate: new Date(2025, 10, 21),
  endDate: new Date(2025, 10, 21),
  startTime: '09:00',
  endTime: '10:30',
  type: 'Reunião',
  category: 'Trabalho',
  priority: 'high',
  location: 'Sala de Reuniões 1',
  participants: 'Maria Santos, Pedro Costa',
  reminder: '15min',
  repeat: 'none',
  color: '#3b82f6',
  notes: 'Levar apresentação do projeto'
};
```

---

## Versão
- **Data:** 25 de Novembro de 2025
- **Sistema:** MyDay - Agenda Online
- **Slogan:** "Vá em frente com 'MyDay'!"
