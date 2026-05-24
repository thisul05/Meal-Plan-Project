// All fetch calls to the backend live here.
// Components import these functions — they never call fetch() directly.

const BASE = '/api';

// Helper: builds headers, attaching the JWT if a token is provided
function headers(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.errors?.join(', ') || body.error || 'Request failed');
    err.needsVerification = body.needsVerification || false;
    throw err;
  }
  return body;
}

// ── Nutrition ────────────────────────────────────────────────────────────────

export async function calculateNutrition(profileData) {
  const res = await fetch(`${BASE}/nutrition/calculate`, {
    method: 'POST', headers: headers(), body: JSON.stringify(profileData),
  });
  return handleResponse(res);
}

// ── Recipes ──────────────────────────────────────────────────────────────────

export async function fetchRecipes() {
  const res = await fetch(`${BASE}/recipes`);
  return handleResponse(res);
}

// ── Meal Plan ────────────────────────────────────────────────────────────────

export async function generateMealPlan(targetCalories, macros, country = 'all') {
  const res = await fetch(`${BASE}/mealplan/generate`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ targetCalories, macros, country }),
  });
  return handleResponse(res);
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function register(name, email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function verifyEmail(token) {
  const res = await fetch(`${BASE}/auth/verify?token=${encodeURIComponent(token)}`);
  return handleResponse(res);
}

export async function resendVerification(email) {
  const res = await fetch(`${BASE}/auth/resend-verification`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

// ── Saved Plans ──────────────────────────────────────────────────────────────

export async function savePlan(plan, token) {
  const res = await fetch(`${BASE}/saved-plans`, {
    method: 'POST', headers: headers(token), body: JSON.stringify({ plan }),
  });
  return handleResponse(res);
}

export async function fetchSavedPlans(token) {
  const res = await fetch(`${BASE}/saved-plans`, { headers: headers(token) });
  return handleResponse(res);
}

export async function deleteSavedPlan(id, token) {
  const res = await fetch(`${BASE}/saved-plans/${id}`, {
    method: 'DELETE', headers: headers(token),
  });
  return handleResponse(res);
}

// ── Diary / Logs ─────────────────────────────────────────────────────────────

export async function fetchLogs(token, date) {
  const q = date ? `?date=${date}` : '';
  const res = await fetch(`${BASE}/logs${q}`, { headers: headers(token) });
  return handleResponse(res);
}

export async function fetchLogsSummary(token, days = 7) {
  const res = await fetch(`${BASE}/logs/summary?days=${days}`, { headers: headers(token) });
  return handleResponse(res);
}

export async function addLog(token, entry) {
  const res = await fetch(`${BASE}/logs`, {
    method: 'POST', headers: headers(token), body: JSON.stringify(entry),
  });
  return handleResponse(res);
}

export async function addBulkLogs(token, meals, date) {
  const res = await fetch(`${BASE}/logs/bulk`, {
    method: 'POST', headers: headers(token), body: JSON.stringify({ meals, date }),
  });
  return handleResponse(res);
}

export async function deleteLog(token, id) {
  const res = await fetch(`${BASE}/logs/${id}`, {
    method: 'DELETE', headers: headers(token),
  });
  return handleResponse(res);
}

// ── Food Search (USDA proxy) ──────────────────────────────────────────────────

export async function searchFood(token, query) {
  const res = await fetch(`${BASE}/food/search?q=${encodeURIComponent(query)}`, {
    headers: headers(token),
  });
  return handleResponse(res);
}
