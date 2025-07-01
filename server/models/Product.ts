import mongoose, { Document, Schema } from "mongoose";
import type { ICategory } from "./Category";

// 定義 Product 的 interface
export interface IProduct extends Document {
  name: string;
  image?: string;
  description?: string;
  quantity?: number;
  price: number;
  isEnabled?: boolean;
  content?: string;
  imagesUrl?: string[]; // 改為陣列
  unit?: string;
  category: mongoose.Types.ObjectId | ICategory;
  createdAt: Date;
}

// 建立 Product 的 Schema
const ProductSchema: Schema<IProduct> = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: '',
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  content: {
    type: String,
    default: '',
    trim: true,
  },
  imagesUrl: {
    type: [String], // 使用陣列方式定義
    default: [],
  },
  unit: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IProduct>("Product", ProductSchema);   