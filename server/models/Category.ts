import mongoose, { Document, Schema } from "mongoose";

// 定義 Category 的 interface
export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
}

// 建立 Category 的 Schema
const CategorySchema: Schema<ICategory> = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 匯出 Mongoose model
export default mongoose.model<ICategory>("Category", CategorySchema);