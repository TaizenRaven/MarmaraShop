import Joi from 'joi';

// Product validation schema
export const productSchema = Joi.object({
  title: Joi.string().required().max(255),
  description: Joi.string().optional(),
  sku: Joi.string().required().max(100),
  barcode: Joi.string().optional().max(100),
  price: Joi.number().required().min(0),
  stock_quantity: Joi.number().required().min(0).integer(),
  category_id: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  active: Joi.boolean().optional(),
  metadata: Joi.object().optional(),
});

// Category validation schema
export const categorySchema = Joi.object({
  name: Joi.string().required().max(255),
  slug: Joi.string().required().max(255),
  description: Joi.string().optional(),
  image_url: Joi.string().optional(),
  parent_category_id: Joi.string().optional(),
  display_order: Joi.number().optional().integer().min(0),
  active: Joi.boolean().optional(),
  metadata: Joi.object().optional(),
});

// Order validation schema
export const orderSchema = Joi.object({
  customer_id: Joi.string().optional(),
  guest_email: Joi.string().email().optional(),
  guest_phone: Joi.string().optional(),
  delivery_address: Joi.string().required(),
  delivery_city: Joi.string().required(),
  delivery_postal_code: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string().required(),
      quantity: Joi.number().required().min(1).integer(),
    })
  ).required(),
});

// Admin login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export function validateProductData(data: any): { error?: any; value?: any } {
  return productSchema.validate(data, { abortEarly: false });
}

export function validateCategoryData(data: any): { error?: any; value?: any } {
  return categorySchema.validate(data, { abortEarly: false });
}

export function validateOrderData(data: any): { error?: any; value?: any } {
  return orderSchema.validate(data, { abortEarly: false });
}

export function validateLoginData(data: any): { error?: any; value?: any } {
  return loginSchema.validate(data, { abortEarly: false });
}

export function formatValidationErrors(error: any): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (error?.details) {
    error.details.forEach((detail: any) => {
      const path = detail.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(detail.message);
    });
  }
  return errors;
}
