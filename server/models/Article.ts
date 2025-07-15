import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  title: string;
  author: string;
  is_public: boolean;
  tags: string[];
  content: string;
  date: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// 建立 Article 的 Schema
const ArticleSchema: Schema<IArticle> = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    is_public: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    content: { type: String, required: true },
    date: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true }, // 自動維護 createdAt 和 updatedAt
  }
);

export default (mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema)) as mongoose.Model<IArticle>;
