import { Router, Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { validateCategoryData, formatValidationErrors } from '../utils/validation';
import { handleError, NotFoundError, ValidationError } from '../utils/errors';

const router = Router();
const categoryService = new CategoryService();

/**
 * GET /api/store/categories
 * List all categories
 */
router.get('/api/store/categories', async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.listCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/store/categories/:slug
 * Get category by slug
 */
router.get('/api/store/categories/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      throw new NotFoundError('Category', slug);
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/store/categories/:categoryId/products
 * Get all products in a category
 */
router.get('/api/store/categories/:categoryId/products', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    // TODO: Implement with ProductService to get products by category
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/admin/categories
 * Create new category (Admin only)
 * Body: { name, slug, description, image_url, parent_category_id, display_order }
 */
router.post('/api/admin/categories', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { error, value } = validateCategoryData(req.body);

    if (error) {
      throw new ValidationError('Category validation failed', formatValidationErrors(error));
    }

    const category = await categoryService.createCategory(value);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * PATCH /api/admin/categories/:id
 * Update category (Admin only)
 */
router.patch('/api/admin/categories/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { id } = req.params;
    const { error, value } = validateCategoryData(req.body);

    if (error) {
      throw new ValidationError('Category validation failed', formatValidationErrors(error));
    }

    const category = await categoryService.updateCategory(id, value);

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * DELETE /api/admin/categories/:id
 * Delete category (Admin only)
 */
router.delete('/api/admin/categories/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/categories/:parentId/children
 * Get child categories
 */
router.get('/api/admin/categories/:parentId/children', async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    const categories = await categoryService.getChildCategories(parentId);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

export default router;
