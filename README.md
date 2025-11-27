# 📅 MyDay - Agenda Online

Uma aplicação moderna de agenda online para organização de eventos e compromissos, desenvolvida com React e TypeScript.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)

## 📋 Sobre o Projeto

O **MyDay** é uma aplicação de agenda online que permite aos usuários gerenciar seus eventos e compromissos de forma intuitiva e eficiente. Com uma interface moderna e responsiva, o sistema oferece diversas funcionalidades para organização do dia a dia.

## ✨ Funcionalidades

### Gerenciamento de Eventos
- ✅ Criar, editar e excluir eventos
- ✅ Definir data, horário, tipo e categoria
- ✅ Configurar prioridade (baixa, média, alta)
- ✅ Adicionar localização e participantes
- ✅ Configurar lembretes e repetições
- ✅ Personalizar cores dos eventos

### Visualizações do Calendário
- 📆 **Visualização por Dia** - Detalhes completos do dia selecionado
- 📅 **Visualização por Semana** - Visão geral da semana com horários
- 🗓️ **Visualização por Mês** - Calendário mensal com indicadores de eventos
- 🔄 Eventos sobrepostos são exibidos lado a lado

### Sistema de Notificações
- 🔔 Notificações de lembretes configuráveis
- 📢 Alertas de eventos do dia
- ⏰ Avisos de eventos próximos (amanhã)
- 👆 Navegação fácil entre múltiplas notificações

### Configurações Personalizáveis
- ⚙️ Tipos de evento customizáveis
- 🏷️ Categorias personalizadas
- 🔁 Opções de repetição configuráveis
- 🎨 Temas e preferências gerais

### Busca e Filtros
- 🔍 Busca textual por título, descrição e localização
- 📊 Filtros por tipo, categoria e prioridade
- 📅 Filtro por intervalo de datas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Framework CSS utilitário

### Componentes e UI
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Biblioteca de ícones
- **Motion (Framer Motion)** - Animações fluidas
- **Sonner** - Sistema de notificações toast
- **shadcn/ui** - Componentes estilizados

### Outras Bibliotecas
- **React Hook Form** - Gerenciamento de formulários
- **React Day Picker** - Seletor de datas
- **Recharts** - Gráficos e visualizações
- **class-variance-authority** - Variantes de componentes
- **clsx / tailwind-merge** - Utilitários para classes CSS

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/mydayagendaonlinefront.git
cd mydayagendaonlinefront
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do projeto
VITE_API_URL=sua_url_da_api
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

5. Acesse no navegador:
```
http://localhost:5173
```

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Visualiza a build de produção |

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI reutilizáveis
│   ├── Dashboard.tsx   # Página principal
│   ├── CalendarView.tsx # Visualizações do calendário
│   ├── CreateEventPage.tsx # Criação de eventos
│   ├── EventDialog.tsx # Modal de detalhes/edição
│   ├── SearchEventsPage.tsx # Busca de eventos
│   ├── NotificationsPage.tsx # Página de notificações
│   ├── ProfilePage.tsx # Perfil do usuário
│   ├── SettingsPage.tsx # Configurações
│   └── ...
├── lib/                # Utilitários e configurações
│   ├── api.ts         # Serviços de API
│   ├── types.ts       # Tipos TypeScript
│   └── notifications.ts # Lógica de notificações
├── styles/            # Estilos globais
│   └── globals.css    # CSS global e variáveis
├── App.tsx            # Componente raiz
└── main.tsx           # Ponto de entrada
```

## 📱 Responsividade

A aplicação foi desenvolvida com foco em responsividade, oferecendo uma experiência otimizada para:

- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

### Recursos Mobile
- Menu de navegação inferior
- Layout adaptativo
- Touch-friendly
- Safe areas para dispositivos com notch

## 🔒 Autenticação

O sistema possui autenticação completa com:
- Login com email e senha
- Registro de novos usuários
- Validação de token JWT
- Persistência de sessão

## 🎨 Design

- Interface moderna e limpa
- Paleta de cores consistente
- Gradientes e sombras sutis
- Animações suaves
- Feedback visual para interações

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

## 👥 Autores

Desenvolvido como projeto da 4ª Fase do curso de Análise e Desenvolvimento de Sistemas.

---

**MyDay** - *Vá em frente e organize seu dia com estilo!* ✨
