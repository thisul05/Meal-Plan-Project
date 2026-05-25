const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nutrition & Meal Planner API',
      version: '1.0.0',
      description: 'REST API for calculating nutrition targets and generating meal plans.',
    },
    servers: [{ url: 'http://localhost:3001' }],
    components: {
      schemas: {
        UserProfile: {
          type: 'object',
          required: ['age', 'weight', 'height', 'sex', 'activityLevel', 'goal'],
          properties: {
            age:           { type: 'integer', example: 28 },
            weight:        { type: 'number',  example: 75, description: 'kg' },
            height:        { type: 'number',  example: 175, description: 'cm' },
            sex:           { type: 'string',  enum: ['male', 'female'], example: 'male' },
            activityLevel: { type: 'string',  enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'], example: 'moderate' },
            goal:          { type: 'string',  enum: ['lose', 'maintain', 'gain'], example: 'maintain' },
          },
        },
        MacroDetail: {
          type: 'object',
          properties: {
            grams:   { type: 'number' },
            percent: { type: 'integer' },
          },
        },
        NutritionResult: {
          type: 'object',
          properties: {
            bmr:            { type: 'integer', description: 'Basal Metabolic Rate (kcal/day)' },
            tdee:           { type: 'integer', description: 'Total Daily Energy Expenditure (kcal/day)' },
            bmi:            { type: 'number',  description: 'Body Mass Index' },
            bmiCategory:    { type: 'string',  enum: ['underweight', 'normal', 'overweight', 'obese'] },
            targetCalories: { type: 'integer', description: 'Daily calorie target after goal adjustment' },
            macros: {
              type: 'object',
              properties: {
                protein: { '$ref': '#/components/schemas/MacroDetail' },
                fat:     { '$ref': '#/components/schemas/MacroDetail' },
                carbs:   { '$ref': '#/components/schemas/MacroDetail' },
              },
            },
            advice: { type: 'array', items: { type: 'string' } },
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            ingredients: { type: 'array', items: { type: 'string' } },
            steps:       { type: 'array', items: { type: 'string' } },
            calories:    { type: 'integer' },
            protein:     { type: 'number' },
            carbs:       { type: 'number' },
            fat:         { type: 'number' },
            tags:        { type: 'array', items: { type: 'string' } },
          },
        },
        MealPlanRequest: {
          type: 'object',
          required: ['targetCalories', 'macros'],
          properties: {
            targetCalories: { type: 'integer', example: 1800 },
            macros: {
              type: 'object',
              properties: {
                protein: { '$ref': '#/components/schemas/MacroDetail' },
                fat:     { '$ref': '#/components/schemas/MacroDetail' },
                carbs:   { '$ref': '#/components/schemas/MacroDetail' },
              },
            },
          },
        },
      },
    },
  },
  // Scan these files for JSDoc @swagger annotations on each route
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
