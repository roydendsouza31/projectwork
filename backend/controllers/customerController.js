const bcrypt = require("bcrypt");
const Customer = require("../models/customerSchema.js");
const { createNewToken } = require("../utils/token.js");

const customerRegister = async (req, res) => {
  try {
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const customer = new Customer({
      ...req.body,
      password: hashedPassword,
    });

    const existingCustomerByEmail = await Customer.findOne({
      email: req.body.email,
    });

    if (existingCustomerByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const result = await customer.save();
    result.password = undefined;

    const token = createNewToken(result._id);

    const response = {
      ...result._doc,
      token: token,
    };

    res.send(response);
  } catch (err) {
    console.error("Error registering customer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const customerLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    let customer = await Customer.findOne({ email: req.body.email });
    if (customer) {
      const validated = await bcrypt.compare(
        req.body.password,
        customer.password
      );
      if (validated) {
        customer.password = undefined;

        const token = createNewToken(customer._id);

        customer = {
          ...customer._doc,
          token: token,
        };

        res.send(customer);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "User not found" });
    }
  } else {
    res.send({ message: "Email and password are required" });
  }
};

const getCartDetail = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (customer) {
      res.send(customer.cartDetails);
    } else {
      res.send({ message: "No customer found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const cartUpdate = async (req, res) => {
  try {
    let customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(customer.cartDetails);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  customerRegister,
  customerLogIn,
  getCartDetail,
  cartUpdate,
};
