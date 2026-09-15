// src/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User është i detyrueshëm"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Produkti është i detyrueshëm"],
        },
        name: String, // Ruaj emrin në rast se produkti fshihet
        image: String,
        quantity: {
          type: Number,
          required: [true, "Sasia është e detyrueshme"],
          min: [1, "Sasia minimale është 1"],
        },
        price: {
          type: Number,
          required: [true, "Çmimi është i detyrueshëm"],
          min: [0, "Çmimi nuk mund të jetë negativ"],
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Emri i plotë është i detyrueshëm"],
      },
      street: {
        type: String,
        required: [true, "Rruga është e detyrueshme"],
      },
      city: {
        type: String,
        required: [true, "Qyteti është i detyrueshëm"],
      },
      postalCode: {
        type: String,
        required: [true, "Kodi postar është i detyrueshëm"],
      },
      country: {
        type: String,
        required: [true, "Shteti është i detyrueshëm"],
        default: "AL",
      },
      phone: {
        type: String,
        required: [true, "Telefoni është i detyrueshëm"],
      },
    },
    paymentMethod: {
      type: String,
      required: [true, "Metoda e pagesës është e detyrueshme"],
      enum: ["cod", "bank"],
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      email_address: String,
    },
    itemsPrice: {
      type: Number,
      required: [true, "Çmimi i artikujve është i detyrueshëm"],
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: [true, "Çmimi total është i detyrueshëm"],
      default: 0.0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    notes: String,
    trackingNumber: String,
  },
  {
    timestamps: true,
  },
);

// Index për query më të shpejta
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ isPaid: 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
