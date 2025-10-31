import { Category } from '../models/category.model';

export class CategoryService {
  private categories: Map<string, Category> = new Map();

  async listCategories(): Promise<Category[]> {
    // TODO: Implement with MedusaJS
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | null> {
    // TODO: Implement with MedusaJS
    return this.categories.get(id) || null;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    // TODO: Implement with MedusaJS
    const categories = Array.from(this.categories.values());
    return categories.find((c) => c.slug === slug) || null;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    // TODO: Implement with MedusaJS
    const category = {
      id: `cat_${Date.now()}`,
      ...data,
    } as Category;
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    // TODO: Implement with MedusaJS
    const category = this.categories.get(id);
    if (!category) {
      throw new Error(`Category ${id} not found`);
    }
    const updated = { ...category, ...data };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    // TODO: Implement with MedusaJS
    this.categories.delete(id);
  }

  async getChildCategories(parentId: string): Promise<Category[]> {
    // TODO: Implement with MedusaJS
    return Array.from(this.categories.values()).filter(
      (c) => c.parent_category_id === parentId
    );
  }
}
