const {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  getBMICategory,
  calculateTargetCalories,
  calculateMacros,
  generateAdvice,
  ACTIVITY_FACTORS,
} = require('../src/services/calculations');

// ─── BMR ────────────────────────────────────────────────────────────────────

describe('calculateBMR', () => {
  test('male: 30yo 80kg 180cm → 1780', () => {
    // (10×80) + (6.25×180) - (5×30) + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(calculateBMR(30, 80, 180, 'male')).toBeCloseTo(1780, 0);
  });

  test('female: 30yo 65kg 165cm → 1370.25', () => {
    // (10×65) + (6.25×165) - (5×30) - 161 = 650 + 1031.25 - 150 - 161 = 1370.25
    expect(calculateBMR(30, 65, 165, 'female')).toBeCloseTo(1370, 0);
  });

  test('older age reduces BMR', () => {
    const young = calculateBMR(20, 70, 175, 'male');
    const old   = calculateBMR(60, 70, 175, 'male');
    expect(old).toBeLessThan(young);
  });

  test('heavier weight increases BMR', () => {
    const light = calculateBMR(30, 60, 175, 'male');
    const heavy = calculateBMR(30, 100, 175, 'male');
    expect(heavy).toBeGreaterThan(light);
  });

  test('male BMR is always higher than female at same stats', () => {
    const male   = calculateBMR(25, 70, 170, 'male');
    const female = calculateBMR(25, 70, 170, 'female');
    // Male constant +5 vs female -161 → difference of 166
    expect(male - female).toBeCloseTo(166, 0);
  });
});

// ─── TDEE ────────────────────────────────────────────────────────────────────

describe('calculateTDEE', () => {
  test('sedentary: 1800 × 1.2 = 2160', () => {
    expect(calculateTDEE(1800, 'sedentary')).toBeCloseTo(2160, 0);
  });

  test('very_active: 1800 × 1.9 = 3420', () => {
    expect(calculateTDEE(1800, 'very_active')).toBeCloseTo(3420, 0);
  });

  test('all five activity levels are defined', () => {
    const levels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
    levels.forEach(level => {
      expect(() => calculateTDEE(2000, level)).not.toThrow();
    });
  });

  test('throws for unknown activity level', () => {
    expect(() => calculateTDEE(1800, 'turbo')).toThrow('Unknown activity level: turbo');
  });

  test('higher activity always produces higher TDEE', () => {
    const levels = Object.keys(ACTIVITY_FACTORS);
    const factors = levels.map(l => ACTIVITY_FACTORS[l]);
    const sorted = [...factors].sort((a, b) => a - b);
    expect(factors).toEqual(sorted);
  });
});

// ─── BMI ─────────────────────────────────────────────────────────────────────

describe('calculateBMI', () => {
  test('70kg at 175cm → ~22.9', () => {
    expect(calculateBMI(70, 175)).toBeCloseTo(22.9, 1);
  });

  test('converts cm to metres correctly', () => {
    // 90kg at 180cm → 90 / 1.8² = 90 / 3.24 = 27.78
    expect(calculateBMI(90, 180)).toBeCloseTo(27.78, 1);
  });
});

describe('getBMICategory', () => {
  test('underweight: < 18.5', () => {
    expect(getBMICategory(17)).toBe('underweight');
    expect(getBMICategory(18.4)).toBe('underweight');
  });

  test('normal: 18.5 – 24.9', () => {
    expect(getBMICategory(18.5)).toBe('normal');
    expect(getBMICategory(22.9)).toBe('normal');
    expect(getBMICategory(24.9)).toBe('normal');
  });

  test('overweight: 25 – 29.9', () => {
    expect(getBMICategory(25)).toBe('overweight');
    expect(getBMICategory(27)).toBe('overweight');
    expect(getBMICategory(29.9)).toBe('overweight');
  });

  test('obese: ≥ 30', () => {
    expect(getBMICategory(30)).toBe('obese');
    expect(getBMICategory(40)).toBe('obese');
  });
});

// ─── CALORIE TARGET ──────────────────────────────────────────────────────────

describe('calculateTargetCalories', () => {
  test('maintain returns rounded TDEE', () => {
    expect(calculateTargetCalories(2000, 'maintain', 'male')).toBe(2000);
  });

  test('gain adds 400 kcal', () => {
    expect(calculateTargetCalories(2000, 'gain', 'male')).toBe(2400);
  });

  test('lose subtracts 400 kcal', () => {
    expect(calculateTargetCalories(2000, 'lose', 'female')).toBe(1600);
  });

  test('enforces male floor of 1500', () => {
    // TDEE 1700 - 400 = 1300, below male floor → clamped to 1500
    expect(calculateTargetCalories(1700, 'lose', 'male')).toBe(1500);
  });

  test('enforces female floor of 1200', () => {
    // TDEE 1400 - 400 = 1000, below female floor → clamped to 1200
    expect(calculateTargetCalories(1400, 'lose', 'female')).toBe(1200);
  });

  test('floor does not affect high-calorie users', () => {
    expect(calculateTargetCalories(3000, 'lose', 'female')).toBe(2600);
  });
});

// ─── MACROS ──────────────────────────────────────────────────────────────────

describe('calculateMacros', () => {
  test('protein is 1.8g per kg body weight', () => {
    const macros = calculateMacros(2000, 80);
    expect(macros.protein.grams).toBe(144); // 80 × 1.8
  });

  test('fat is ~25% of calories', () => {
    const macros = calculateMacros(2000, 70);
    // 2000 × 0.25 / 9 ≈ 55.6 → rounded to 56g
    expect(macros.fat.grams).toBe(56);
  });

  test('macro percentages sum to ~100', () => {
    const macros = calculateMacros(2000, 75);
    const total = macros.protein.percent + macros.fat.percent + macros.carbs.percent;
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });

  test('carbs are never negative', () => {
    // Very high protein person on low calories
    const macros = calculateMacros(1500, 150);
    expect(macros.carbs.grams).toBeGreaterThanOrEqual(0);
  });

  test('returns grams and percent for all three macros', () => {
    const macros = calculateMacros(2000, 75);
    ['protein', 'fat', 'carbs'].forEach(macro => {
      expect(macros[macro]).toHaveProperty('grams');
      expect(macros[macro]).toHaveProperty('percent');
    });
  });
});

// ─── ADVICE ──────────────────────────────────────────────────────────────────

describe('generateAdvice', () => {
  test('returns an array', () => {
    expect(Array.isArray(generateAdvice('lose', 'normal'))).toBe(true);
  });

  test('returns advice for each goal', () => {
    ['lose', 'maintain', 'gain'].forEach(goal => {
      const advice = generateAdvice(goal, 'normal');
      expect(advice.length).toBeGreaterThan(0);
    });
  });

  test('adds extra line for underweight users', () => {
    const normal     = generateAdvice('gain', 'normal').length;
    const underweight = generateAdvice('gain', 'underweight').length;
    expect(underweight).toBeGreaterThan(normal);
  });

  test('advice text is never empty strings', () => {
    const advice = generateAdvice('lose', 'normal');
    advice.forEach(line => expect(line.trim().length).toBeGreaterThan(0));
  });
});
