import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: number;
  productName: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const ItemSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export default mongoose.model<IItem>('Item', ItemSchema);