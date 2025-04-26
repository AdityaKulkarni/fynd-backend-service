import Product, { IProduct } from '../models/Product';

export class ProductService {
  async getAllProducts(): Promise<IProduct[]> {
    return Product.find();
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return Product.findById(id);
  }

  async getProductsBySource(sourceId: string): Promise<IProduct[]> {
    return Product.find({ sourceId });
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(productData);
    return product.save();
  }

  async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id);
  }

  async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true }
    );
  }
} 