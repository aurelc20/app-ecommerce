// src/models/Product.js
import mongoose from "mongoose";
import registerModel from "@/lib/registerModel";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Emri i produktit është i detyrueshëm"],
      trim: true,
      maxlength: [200, "Emri nuk mund të jetë më i gjatë se 200 karaktere"],
    },
    slug: {
      type: String,
      // required: [true, "Slug është i detyrueshëm"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [200, "Slug nuk mund të jetë më i gjatë se 200 karaktere"],
    },
    description: {
      type: String,
      required: [true, "Përshkrimi është i detyrueshëm"],
      maxlength: [
        2000,
        "Përshkrimi nuk mund të jetë më i gjatë se 2000 karaktere",
      ],
    },
    price: {
      type: Number,
      required: [true, "Çmimi është i detyrueshëm"],
      min: [0, "Çmimi nuk mund të jetë negativ"],
    },
    salePrice: {
      type: Number,
      min: [0, "Çmimi i zbritjes nuk mund të jetë negativ"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Kategoria është e detyrueshme"],
      enum: ["Necklaces", "Earrings", "Bracelets", "Rings", "Sets", "Other"],
    },
    brand: {
      type: String,
      default: "Perlë",
    },
    stock: {
      type: Number,
      required: [true, "Stock është i detyrueshëm"],
      default: 0,
      min: [0, "Stock nuk mund të jetë negativ"],
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating nuk mund të jetë negativ"],
        max: [5, "Rating maksimal është 5"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Count nuk mund të jetë negativ"],
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual për discount percentage
ProductSchema.virtual("discountPercentage").get(function () {
  if (this.salePrice && this.price) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Index për search dhe performancë
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1, brand: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });

// Pre-save middleware për të gjeneruar slug nëse nuk ekziston
ProductSchema.pre("save", async function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  // Nuk thirret next() kur përdor async
});

export default registerModel("Product", ProductSchema);
