# HabitForge

**Forge your future, one habit at a time.**

HabitForge is a modern, full-stack habit tracking application that helps users build strong routines and stay accountable. It features a minimal yet powerful interface for creating, organizing, and completing daily habits with streak tracking and detailed insights.

---

## 🚀 Features

- ✅ Create custom habits with optional descriptions
- 🗂 Organize habits into categories
- 📅 Track completion status for each day
- 🔁 Toggle habit status (completed/incomplete) seamlessly
- 🔥 View streaks for motivation
- 📊 Dashboard to monitor habit progress (coming soon)
- 💬 View details and edit habits easily
- 🧲 Drag-and-drop to reorder habits (sortable)
- 🔐 Secure user authentication
- 🎨 Responsive and polished UI

---

## 🛠 Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Dnd-kit](https://dndkit.com/) for drag-and-drop sorting

**Backend:**
- [Express](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [SQLite](https://www.sqlite.org/) 

**Other:**
- `dayjs` for date handling
- `uuid` for generating unique IDs
- Zod for input validation

---

## 📦 Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/youssefahmed3/habitforge.git
cd habitforge

# Install frontend dependencies
npm install

# Install Backend dependencies
cd backend
npm install
```

## Run The Development Server

```bash
# Start frontend
npm run dev

# Start backend
cd backend
npm run dev

