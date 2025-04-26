import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  selected: boolean;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  selected: { type: Boolean, default: true }
});

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<ICart>('Cart', CartSchema); 