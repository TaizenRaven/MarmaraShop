import { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { validateProductData, formatValidationErrors } from '../utils/validation';
import { handleError, NotFoundError, ValidationError } from '../utils/errors';

const router = Router();
const productService = new ProductService();

/**
 * GET /api/store/products
 * List all products with optional filtering
 * Query params: category, min_price, max_price, search, page, limit
 */
router.get('/api/store/products', async (req: Request, res: Response) => {
  try {
    const { category, min_price, max_price, search, page = 1, limit = 20 } = req.query;

    const filters = {
      category: category as string,
      min_price: min_price ? parseFloat(min_price as string) : undefined,
      max_price: max_price ? parseFloat(max_price as string) : undefined,
      search: search as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    };

    const products = await productService.listProducts(filters);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: products.length,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/store/products/:id
 * Get product details by ID
 */
router.get('/api/store/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/admin/products
 * Create new product (Admin only)
 * Body: { title, description, sku, barcode, price, stock_quantity, category_id, images }
 */
router.post('/api/admin/products', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { error, value } = validateProductData(req.body);

    if (error) {
      throw new ValidationError('Product validation failed', formatValidationErrors(error));
    }

    const product = await productService.createProduct(value);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * PATCH /api/admin/products/:id
 * Update product (Admin only)
 */
router.patch('/api/admin/products/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { id } = req.params;
    const { error, value } = validateProductData(req.body);

    if (error) {
      throw new ValidationError('Product validation failed', formatValidationErrors(error));
    }

    const product = await productService.updateProduct(id, value);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete product (Admin only)
 */
router.delete('/api/admin/products/:id', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware check
    const { id } = req.params;
    await productService.deleteProduct(id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
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
    const products = await productService.getProductsByCategory(categoryId);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

export default router;
