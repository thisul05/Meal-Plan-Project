# Nutrition & Meal Planning App

An educational tool that calculates BMR, TDEE, BMI, and daily macros, then generates a personalised meal plan from a recipe database.

> **Disclaimer:** This app is for educational purposes only. It is NOT medical or dietary advice. Always consult a qualified healthcare professional before making changes to your diet.

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18 + Vite         |
| Backend    | Node.js + Express 4     |
| Database   | PostgreSQL               |

---

## Project Structure

```
Meal Plan Project/
├── backend/        Express API
├── frontend/       React + Vite app
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Backend

```bash
cd backend
cp .env.example .env        # fill in your DB credentials
npm install
npm run dev                 # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to the backend automatically — no CORS config needed during development.

---

## API Overview

| Method | Path                  | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | /api/nutrition/calculate | Calculate BMR, TDEE, BMI, macros  |
| GET    | /api/recipes          | Fetch all recipes                    |
| POST   | /api/mealplan/generate | Generate a daily meal plan          |

---

## Safety Notes

- Calorie targets are floored at 1200 kcal (women) / 1500 kcal (men) regardless of goal.
- All inputs are validated server-side with sensible range limits.
- Advice text is general and encouraging — never prescriptive.
