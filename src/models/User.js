// src/models/User.js
import mongoose from "mongoose";
import registerModel from "@/lib/registerModel";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Emri është i detyrueshëm"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email-i është i detyrueshëm"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email-i nuk është valid"],
    },

    password: {
      type: String,
      minlength: [6, "Fjalëkalimi duhet të jetë së paku 6 karaktere"],
      select: false,
      default: null,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "seller"],
      default: "customer",
    },

    avatar: {
      type: String,
      default: null,
    },

    avatarPublicId: {
      type: String,
      default: null,
    },

    emailVerified: {
      type: Date,
      default: null,
    },

    emailVerificationTokenHash: {
      type: String,
      select: false,
      default: null,
    },

    emailVerificationTokenExpires: {
      type: Date,
      default: null,
    },

    passwordResetTokenHash: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },

    addresses: [
      {
        type: {
          type: String,
          enum: ["home", "work", "other"],
          default: "home",
        },
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: {
          type: String,
          default: "AL",
        },
        phone: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    marketingOptIn: {
      type: Boolean,
      default: false,
    },

    marketingOptInAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

export default registerModel("User", UserSchema);
