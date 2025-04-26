import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  sourceUrl: string;
  sourceId: string;
  images: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  sourceUrl: { type: String, required: true },
  sourceId: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema); 