import { ticks, todos } from '../../../src/data/climbs';

describe('climbs.ts schema', () => {
  /* ── ticks ── */
  describe('ticks', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(ticks)).toBe(true);
      expect(ticks.length).toBeGreaterThan(0);
    });

    it('every tick has all required fields', () => {
      for (const tick of ticks) {
        expect(typeof tick.date).toBe('string');
        expect(tick.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(typeof tick.route).toBe('string');
        expect(tick.route.length).toBeGreaterThan(0);
        expect(typeof tick.grade).toBe('string');
        expect(tick.grade.length).toBeGreaterThan(0);
        expect(typeof tick.location).toBe('string');
        expect(tick.location.length).toBeGreaterThan(0);
        expect(typeof tick.url).toBe('string');
        expect(tick.url).toMatch(/^https:\/\//);
      }
    });
  });

  /* ── todos ── */
  describe('todos', () => {
    it('exports a non-empty array', () => {
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
    });

    it('every todo has all required fields', () => {
      for (const todo of todos) {
        expect(typeof todo.route).toBe('string');
        expect(todo.route.length).toBeGreaterThan(0);
        expect(typeof todo.grade).toBe('string');
        expect(todo.grade.length).toBeGreaterThan(0);
        expect(typeof todo.location).toBe('string');
        expect(todo.location.length).toBeGreaterThan(0);
        expect(typeof todo.url).toBe('string');
        expect(todo.url).toMatch(/^https:\/\//);
      }
    });
  });
});
