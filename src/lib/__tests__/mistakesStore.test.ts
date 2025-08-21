import { describe, it, expect, beforeEach } from 'vitest';
import { mistakesStore } from '../mistakesStore';

describe('mistakesStore', () => {
  beforeEach(() => {
    mistakesStore.clear();
  });

  describe('add', () => {
    it('should add a new mistake', () => {
      mistakesStore.add('q1');
      expect(mistakesStore.has('q1')).toBe(true);
      expect(mistakesStore.getAll()).toEqual(['q1']);
    });

    it('should not add duplicate mistakes', () => {
      mistakesStore.add('q1');
      mistakesStore.add('q1');
      expect(mistakesStore.getAll()).toEqual(['q1']);
    });

    it('should notify subscribers when adding new mistake', () => {
      let notified = false;
      const unsubscribe = mistakesStore.subscribe(() => {
        notified = true;
      });
      
      mistakesStore.add('q1');
      expect(notified).toBe(true);
      
      unsubscribe();
    });

    it('should not notify subscribers when adding duplicate mistake', () => {
      mistakesStore.add('q1');
      
      let notified = false;
      const unsubscribe = mistakesStore.subscribe(() => {
        notified = true;
      });
      
      mistakesStore.add('q1');
      expect(notified).toBe(false);
      
      unsubscribe();
    });
  });

  describe('remove', () => {
    it('should remove an existing mistake', () => {
      mistakesStore.add('q1');
      mistakesStore.remove('q1');
      expect(mistakesStore.has('q1')).toBe(false);
      expect(mistakesStore.getAll()).toEqual([]);
    });

    it('should not affect store when removing non-existent mistake', () => {
      mistakesStore.remove('q1');
      expect(mistakesStore.getAll()).toEqual([]);
    });

    it('should notify subscribers when removing existing mistake', () => {
      mistakesStore.add('q1');
      
      let notified = false;
      const unsubscribe = mistakesStore.subscribe(() => {
        notified = true;
      });
      
      mistakesStore.remove('q1');
      expect(notified).toBe(true);
      
      unsubscribe();
    });

    it('should not notify subscribers when removing non-existent mistake', () => {
      let notified = false;
      const unsubscribe = mistakesStore.subscribe(() => {
        notified = true;
      });
      
      mistakesStore.remove('q1');
      expect(notified).toBe(false);
      
      unsubscribe();
    });
  });

  describe('clear', () => {
    it('should clear all mistakes', () => {
      mistakesStore.add('q1');
      mistakesStore.add('q2');
      mistakesStore.clear();
      expect(mistakesStore.getAll()).toEqual([]);
    });

    it('should notify subscribers when clearing non-empty store', () => {
      mistakesStore.add('q1');
      
      let notified = false;
      const unsubscribe = mistakesStore.subscribe(() => {
        notified = true;
      });
      
      mistakesStore.clear();
      expect(notified).toBe(true);
      
      unsubscribe();
    });

    it('should not notify subscribers when clearing empty store', () => {
      let notified = false;
      const unsubscribe = mistakesStore.subscribe(() => {
        notified = true;
      });
      
      mistakesStore.clear();
      expect(notified).toBe(false);
      
      unsubscribe();
    });
  });

  describe('has', () => {
    it('should return true for existing mistakes', () => {
      mistakesStore.add('q1');
      expect(mistakesStore.has('q1')).toBe(true);
    });

    it('should return false for non-existing mistakes', () => {
      expect(mistakesStore.has('q1')).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should return empty array when no mistakes', () => {
      expect(mistakesStore.getAll()).toEqual([]);
    });

    it('should return all mistakes as array', () => {
      mistakesStore.add('q1');
      mistakesStore.add('q2');
      const mistakes = mistakesStore.getAll();
      expect(mistakes).toHaveLength(2);
      expect(mistakes).toContain('q1');
      expect(mistakes).toContain('q2');
    });
  });

  describe('subscribe', () => {
    it('should return unsubscribe function', () => {
      const unsubscribe = mistakesStore.subscribe(() => {});
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });

    it('should stop notifications after unsubscribe', () => {
      let notificationCount = 0;
      const unsubscribe = mistakesStore.subscribe(() => {
        notificationCount++;
      });
      
      mistakesStore.add('q1');
      expect(notificationCount).toBe(1);
      
      unsubscribe();
      mistakesStore.add('q2');
      expect(notificationCount).toBe(1);
    });

    it('should support multiple subscribers', () => {
      let count1 = 0;
      let count2 = 0;
      
      const unsubscribe1 = mistakesStore.subscribe(() => count1++);
      const unsubscribe2 = mistakesStore.subscribe(() => count2++);
      
      mistakesStore.add('q1');
      expect(count1).toBe(1);
      expect(count2).toBe(1);
      
      unsubscribe1();
      unsubscribe2();
    });
  });
});