import { describe, it, expect } from 'vitest';
import {
  createListFromTemplate,
  getTemplateList,
  LIST_TEMPLATES,
  TemplateKey
} from './listTemplates';
import { ShoppingList } from '../types';

describe('List Templates', () => {
  describe('LIST_TEMPLATES', () => {
    it('should have all required templates', () => {
      expect(LIST_TEMPLATES.weekly).toBeDefined();
      expect(LIST_TEMPLATES.mealPrep).toBeDefined();
      expect(LIST_TEMPLATES.bbq).toBeDefined();
      expect(LIST_TEMPLATES.keto).toBeDefined();
      expect(LIST_TEMPLATES.vegan).toBeDefined();
      expect(LIST_TEMPLATES.family).toBeDefined();
    });

    it('should have correct structure for each template', () => {
      Object.entries(LIST_TEMPLATES).forEach(([_key, template]) => {
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(Array.isArray(template.items)).toBe(true);
        expect(template.items.length).toBeGreaterThan(0);
      });
    });

    it('should have items with name and category', () => {
      Object.entries(LIST_TEMPLATES).forEach(([_key, template]) => {
        template.items.forEach(item => {
          expect(item.name).toBeDefined();
          expect(typeof item.name).toBe('string');
          expect(item.category).toBeDefined();
        });
      });
    });
  });

  describe('createListFromTemplate', () => {
    it('should create a valid shopping list from template', () => {
      const list = createListFromTemplate('weekly');
      
      expect(list).toBeDefined();
      expect(list.id).toBeDefined();
      expect(list.name).toBe(LIST_TEMPLATES.weekly.name);
      expect(Array.isArray(list.items)).toBe(true);
      expect(list.items.length).toBe(LIST_TEMPLATES.weekly.items.length);
    });

    it('should create unique IDs for each list', () => {
      const list1 = createListFromTemplate('weekly');
      const list2 = createListFromTemplate('weekly');
      
      expect(list1.id).not.toBe(list2.id);
    });

    it('should create items with all required properties', () => {
      const list = createListFromTemplate('weekly');
      
      list.items.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.category).toBeDefined();
        expect(item.quantity).toBe(1);
        expect(item.unit).toBe('pcs');
        expect(item.isCompleted).toBe(false);
        expect(item.dateAdded).toBeDefined();
      });
    });

    it('should set total cost to 0 initially', () => {
      const list = createListFromTemplate('weekly');
      expect(list.totalCost).toBe(0);
    });

    it('should set dates correctly', () => {
      const before = new Date();
      const list = createListFromTemplate('weekly');
      const after = new Date();
      
      expect(list.dateCreated.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(list.dateCreated.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(list.dateModified).toEqual(list.dateCreated);
    });

    it('should set isCompleted to false', () => {
      const list = createListFromTemplate('weekly');
      expect(list.isCompleted).toBe(false);
    });

    it('should work with all template types', () => {
      const templates: TemplateKey[] = ['weekly', 'mealPrep', 'bbq', 'keto', 'vegan', 'family'];
      
      templates.forEach(templateKey => {
        const list = createListFromTemplate(templateKey);
        expect(list).toBeDefined();
        expect(list.items.length).toBeGreaterThan(0);
        expect(list.name).toBe(LIST_TEMPLATES[templateKey].name);
      });
    });

    it('should create unique item IDs within a list', () => {
      const list = createListFromTemplate('weekly');
      const ids = list.items.map(item => item.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should preserve item names from template', () => {
      const list = createListFromTemplate('weekly');
      const templateNames = LIST_TEMPLATES.weekly.items.map(item => item.name);
      const listNames = list.items.map(item => item.name);
      
      expect(listNames).toEqual(templateNames);
    });

    it('should categorize items correctly', () => {
      const list = createListFromTemplate('keto');
      
      list.items.forEach(item => {
        expect(item.category).toBeDefined();
        expect(typeof item.category).toBe('string');
      });
    });

    it('should create shopping list with correct structure', () => {
      const list = createListFromTemplate('mealPrep');
      
      expect(list).toHaveProperty('id');
      expect(list).toHaveProperty('name');
      expect(list).toHaveProperty('items');
      expect(list).toHaveProperty('totalCost');
      expect(list).toHaveProperty('dateCreated');
      expect(list).toHaveProperty('dateModified');
      expect(list).toHaveProperty('isCompleted');
    });
  });

  describe('getTemplateList', () => {
    it('should return array of templates', () => {
      const templates = getTemplateList();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should have correct structure for each template in list', () => {
      const templates = getTemplateList();
      
      templates.forEach(template => {
        expect(template.key).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
      });
    });

    it('should return 6 templates', () => {
      const templates = getTemplateList();
      expect(templates).toHaveLength(6);
    });

    it('should include all template keys', () => {
      const templates = getTemplateList();
      const keys = templates.map(t => t.key);
      
      expect(keys).toContain('weekly');
      expect(keys).toContain('mealPrep');
      expect(keys).toContain('bbq');
      expect(keys).toContain('keto');
      expect(keys).toContain('vegan');
      expect(keys).toContain('family');
    });

    it('should have matching names with LIST_TEMPLATES', () => {
      const templates = getTemplateList();
      
      templates.forEach(template => {
        expect(template.name).toBe(LIST_TEMPLATES[template.key].name);
      });
    });

    it('should have matching descriptions with LIST_TEMPLATES', () => {
      const templates = getTemplateList();
      
      templates.forEach(template => {
        expect(template.description).toBe(LIST_TEMPLATES[template.key].description);
      });
    });
  });

  describe('Template variations', () => {
    it('weekly template should include dairy items', () => {
      const list = createListFromTemplate('weekly');
      const dairyItems = list.items.filter(item => 
        item.name.toLowerCase().includes('milk') || 
        item.name.toLowerCase().includes('cheese') ||
        item.name.toLowerCase().includes('yogurt')
      );
      expect(dairyItems.length).toBeGreaterThan(0);
    });

    it('meal prep template should include vegetables', () => {
      const list = createListFromTemplate('mealPrep');
      const veggies = list.items.filter(item =>
        item.name.toLowerCase().includes('broccoli') ||
        item.name.toLowerCase().includes('carrot') ||
        item.name.toLowerCase().includes('pepper')
      );
      expect(veggies.length).toBeGreaterThan(0);
    });

    it('bbq template should include meats', () => {
      const list = createListFromTemplate('bbq');
      const meats = list.items.filter(item =>
        item.name.toLowerCase().includes('beef') ||
        item.name.toLowerCase().includes('chicken') ||
        item.name.toLowerCase().includes('sausage')
      );
      expect(meats.length).toBeGreaterThan(0);
    });

    it('keto template should include high-fat items', () => {
      const list = createListFromTemplate('keto');
      const fatItems = list.items.filter(item =>
        item.name.toLowerCase().includes('butter') ||
        item.name.toLowerCase().includes('cheese') ||
        item.name.toLowerCase().includes('oil')
      );
      expect(fatItems.length).toBeGreaterThan(0);
    });

    it('vegan template should not include meat', () => {
      const list = createListFromTemplate('vegan');
      const meatItems = list.items.filter(item =>
        item.name.toLowerCase().includes('beef') ||
        item.name.toLowerCase().includes('chicken') ||
        item.name.toLowerCase().includes('fish') ||
        item.name.toLowerCase().includes('meat')
      );
      expect(meatItems).toHaveLength(0);
    });

    it('family template should include breakfast items', () => {
      const list = createListFromTemplate('family');
      const breakfastItems = list.items.filter(item =>
        item.name.toLowerCase().includes('milk') ||
        item.name.toLowerCase().includes('bread') ||
        item.name.toLowerCase().includes('cereal')
      );
      expect(breakfastItems.length).toBeGreaterThan(0);
    });
  });
});
