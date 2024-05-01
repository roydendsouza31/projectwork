const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "Customer",
  },
  cartDetails: [
    {
      serviceName: {
        type: String,
      },
      price: {
        mrp: {
          type: Number,
        },
        cost: {
          type: Number,
        },
        discountPercent: {
          type: Number,
        },
      },
      productImage: {
        type: String,
      },
      category: {
        type: String,
      },
      description: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller",
      },
    },
  ],
  address: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    taluka: {
      type: String,
    },
  },
});

module.exports = mongoose.model("customer", customerSchema);
