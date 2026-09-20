// src/models/Review.js
import mongoose from "mongoose";
import registerModel from "@/lib/registerModel";

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Produkti është i detyrueshëm"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User-i është i detyrueshëm"],
    },
    rating: {
      type: Number,
      required: [true, "Rating është i detyrueshëm"],
      min: [1, "Rating minimal është 1"],
      max: [5, "Rating maksimal është 5"],
    },
    title: {
      type: String,
      required: [true, "Titulli është i detyrueshëm"],
      trim: true,
      maxlength: [100, "Titulli nuk mund të jetë më i gjatë se 100 karaktere"],
    },
    comment: {
      type: String,
      required: [true, "Komenti është i detyrueshëm"],
      trim: true,
      maxlength: [
        1000,
        "Komenti nuk mund të jetë më i gjatë se 1000 karaktere",
      ],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    images: [
      {
        url: String,
        alt: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Një user mund të lërë vetëm një review për produkt
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Middleware për të përditësuar rating-un e produktit kur shtohet review
ReviewSchema.post("save", async function () {
  const Product = mongoose.model("Product");
  const product = await Product.findById(this.product);

  if (product) {
    const reviews = await mongoose
      .model("Review")
      .find({ product: product._id });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    product.ratings = {
      average: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      count: reviews.length,
    };

    await product.save();
  }
});

// Middleware për të përditësuar kur fshihet review
ReviewSchema.post("remove", async function () {
  const Product = mongoose.model("Product");
  const product = await Product.findById(this.product);

  if (product) {
    const reviews = await mongoose
      .model("Review")
      .find({ product: product._id });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const averageRating = totalRating / reviews.length;

      product.ratings = {
        average: Math.round(averageRating * 10) / 10,
        count: reviews.length,
      };
    } else {
      product.ratings = {
        average: 0,
        count: 0,
      };
    }

    await product.save();
  }
});

export default registerModel("Review", ReviewSchema);
