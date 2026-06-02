// Exact name → Unsplash photo. Keys are lowercased recipe names.
const RECIPE_IMAGES = {

  /* ── International · Breakfast ──────────────────────────────────────── */
  'oatmeal with berries':
    'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=640&h=420&fit=crop',
  'greek yogurt parfait':
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=640&h=420&fit=crop',
  'scrambled eggs on wholegrain toast':
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=640&h=420&fit=crop',
  'avocado toast with poached egg':
    'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=640&h=420&fit=crop',
  'banana protein smoothie':
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=640&h=420&fit=crop',

  /* ── International · Lunch ───────────────────────────────────────────── */
  'grilled chicken salad':
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&h=420&fit=crop',
  'tuna whole wheat wrap':
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=640&h=420&fit=crop',
  'red lentil soup':
    'https://images.unsplash.com/photo-1547592166-5ca6af2e89c5?w=640&h=420&fit=crop',
  'quinoa buddha bowl':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&h=420&fit=crop',
  'turkey and avocado sandwich':
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=640&h=420&fit=crop',
  'egg and vegetable frittata':
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=640&h=420&fit=crop',

  /* ── International · Dinner ──────────────────────────────────────────── */
  'baked salmon with roasted vegetables':
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=640&h=420&fit=crop',
  'chicken stir-fry with brown rice':
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=640&h=420&fit=crop',
  'lean beef and broccoli':
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=640&h=420&fit=crop',
  'pasta with turkey bolognese':
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=640&h=420&fit=crop',
  'black bean tacos':
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=640&h=420&fit=crop',
  'baked cod with sweet potato mash':
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=640&h=420&fit=crop',

  /* ── International · Snacks ──────────────────────────────────────────── */
  'cottage cheese with pineapple':
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=640&h=420&fit=crop',
  'apple with almond butter':
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=640&h=420&fit=crop',
  'hummus with veggie sticks':
    'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=640&h=420&fit=crop',

  /* ── Sri Lankan · Breakfast ──────────────────────────────────────────── */
  'sri lankan rice and curry':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
  'parippu curry with pol roti':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
  'roti with lunu miris':
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=640&h=420&fit=crop',
  'string hoppers with kiri hodi':
    'https://i.imgur.com/2JvOt3U.jpg',
  'pittu with coconut milk':
    'https://i.imgur.com/xFJyyJL.jpg',
  'kiribath (milk rice)':
    'https://i.imgur.com/iDSSPrG.jpg',

  /* ── Sri Lankan · Lunch / Dinner ─────────────────────────────────────── */
  'chicken kottu roti':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
  'fish ambul thiyal with rice':
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=640&h=420&fit=crop',
  'jackfruit curry (polos) with rice':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
  'devilled chicken with fried rice':
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=640&h=420&fit=crop',
  'prawn curry with rice':
    'https://images.unsplash.com/photo-1565365474-9dc55ca2af1f?w=640&h=420&fit=crop',
  'gotukola mallum with rice':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&h=420&fit=crop',
  'mukunuwenna mallum with rice':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&h=420&fit=crop',
  'sri lankan chicken biryani':
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=640&h=420&fit=crop',
  'lamprais':
    'https://i.imgur.com/iZSBR6Y.jpg',

  /* ── Sri Lankan · Snacks ─────────────────────────────────────────────── */
  'masala vade':
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=640&h=420&fit=crop',
  'thala guli (sesame balls)':
    'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=640&h=420&fit=crop',
  'kadala curry (black chickpea curry)':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
  'kokis':
    'https://i.imgur.com/Y3wAAvK.jpg',
  'pol pani pancakes (pani pol)':
    'https://i.imgur.com/yBcrbsO.jpg',

  /* ── Sri Lankan · Complete plates ───────────────────────────────────── */
  'rice with fish ambul thiyal, parippu & sambol':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
  'rice with prawn curry, parippu & pol sambol':
    'https://images.unsplash.com/photo-1565365474-9dc55ca2af1f?w=640&h=420&fit=crop',
  'rice with jackfruit curry, parippu & pol sambol':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
  'rice with gotukola mallum, parippu & sambol':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&h=420&fit=crop',
  'rice with mukunuwenna mallum, parippu & sambol':
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&h=420&fit=crop',
  'rice with chicken curry, parippu & sambol':
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=640&h=420&fit=crop',
};

// Slot-based fallback when no name match is found
const SLOT_FALLBACK = {
  breakfast: 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=640&h=420&fit=crop',
  lunch:     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&h=420&fit=crop',
  dinner:    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=640&h=420&fit=crop',
  snack:     'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=640&h=420&fit=crop',
};

export function getMealImage(name, slot) {
  const key = (name || '').toLowerCase().trim();
  return RECIPE_IMAGES[key] || SLOT_FALLBACK[slot] || SLOT_FALLBACK.breakfast;
}
