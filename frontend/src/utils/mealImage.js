const SLOT_FALLBACK = {
  breakfast: 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=160&h=160&fit=crop',
  lunch:     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=160&h=160&fit=crop',
  dinner:    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=160&h=160&fit=crop',
  snack:     'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=160&h=160&fit=crop',
};

const KEYWORD_IMAGES = [
  ['salmon',     'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=160&h=160&fit=crop'],
  ['cod',        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=160&h=160&fit=crop'],
  ['fish',       'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=160&h=160&fit=crop'],
  ['chicken',    'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=160&h=160&fit=crop'],
  ['beef',       'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=160&h=160&fit=crop'],
  ['steak',      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=160&h=160&fit=crop'],
  ['turkey',     'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=160&h=160&fit=crop'],
  ['egg',        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=160&h=160&fit=crop'],
  ['frittata',   'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=160&h=160&fit=crop'],
  ['smoothie',   'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=160&h=160&fit=crop'],
  ['oat',        'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=160&h=160&fit=crop'],
  ['yogurt',     'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=160&h=160&fit=crop'],
  ['parfait',    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=160&h=160&fit=crop'],
  ['salad',      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=160&h=160&fit=crop'],
  ['pasta',      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=160&h=160&fit=crop'],
  ['bolognese',  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=160&h=160&fit=crop'],
  ['soup',       'https://images.unsplash.com/photo-1547592180-85f173990554?w=160&h=160&fit=crop'],
  ['lentil',     'https://images.unsplash.com/photo-1547592180-85f173990554?w=160&h=160&fit=crop'],
  ['rice',       'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=160&h=160&fit=crop'],
  ['curry',      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=160&h=160&fit=crop'],
  ['biryani',    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=160&h=160&fit=crop'],
  ['wrap',       'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=160&h=160&fit=crop'],
  ['sandwich',   'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=160&h=160&fit=crop'],
  ['taco',       'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=160&h=160&fit=crop'],
  ['hummus',     'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=160&h=160&fit=crop'],
  ['avocado',    'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=160&h=160&fit=crop'],
  ['toast',      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=160&h=160&fit=crop'],
  ['apple',      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=160&h=160&fit=crop'],
  ['fruit',      'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=160&h=160&fit=crop'],
  ['nut',        'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=160&h=160&fit=crop'],
  ['almond',     'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=160&h=160&fit=crop'],
  ['cottage',    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=160&h=160&fit=crop'],
  ['pineapple',  'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=160&h=160&fit=crop'],
  ['hopper',     'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=160&h=160&fit=crop'],
  ['pittu',      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=160&h=160&fit=crop'],
  ['kiribath',   'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=160&h=160&fit=crop'],
  ['kottu',      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=160&h=160&fit=crop'],
  ['roti',       'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=160&h=160&fit=crop'],
  ['pol pani',   'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=160&h=160&fit=crop'],
  ['thala',      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=160&h=160&fit=crop'],
];

export function getMealImage(name, slot) {
  const n = (name || '').toLowerCase();
  for (const [kw, url] of KEYWORD_IMAGES) {
    if (n.includes(kw)) return url;
  }
  return SLOT_FALLBACK[slot] || SLOT_FALLBACK.breakfast;
}
