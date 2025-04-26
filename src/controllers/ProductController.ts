import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error });
    }
  };

  getProductsBySource = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getProductsBySource(req.params.sourceId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products by source', error });
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.deleteProduct(req.params.id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  };
} 