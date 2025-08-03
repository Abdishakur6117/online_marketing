import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";

// Create New Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get user from token
    const { products, shippingAddress, paymentMethod } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Fadlan buuxi dhammaan macluumaadka" });
    }

    // Calculate total amount and update product stock
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Alaabta ID ${item.productId} lama helin` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Qadarka la heli karo ${product.name} waa ${product.stock}`,
        });
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();

      // Add to order products
      orderProducts.push({
        product: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Calculate total
      totalAmount += product.price * item.quantity;
    }

    // Create order
    const newOrder = new Order({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Dalabka si guul leh ayaa loo sameeyay",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      message: "Qalad sameynta dalabka",
      error: error.message,
    });
  }
};

// Get User Orders
// export const getUserOrders = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const orders = await Order.find({ user: userId })
//       .populate("user", "username email")
//       .populate("products.product", "name price");

//     // 1. Filter out product: null
//     // 2. Ka saar orders-ka leh status Cancelled
//     const cleanedOrders = orders
//       .map((order) => ({
//         ...order.toObject(),
//         products: order.products.filter((p) => p.product !== null),
//       }))
//       .filter(
//         (order) =>
//           order.products.length > 0 && order.orderStatus !== "Cancelled"
//       );

//     res.json(cleanedOrders);
//   } catch (error) {
//     res.status(500).json({ message: "Qalad helista dalabka" });
//   }
// };
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId })
      .populate("user", "username email")
      .populate("products.product", "name price createdBy"); // <- Halkan ku dar 'createdBy'

    const cleanedOrders = orders
      .map((order) => ({
        ...order.toObject(),
        products: order.products.filter((p) => p.product !== null),
      }))
      .filter(
        (order) =>
          order.products.length > 0 && order.orderStatus !== "Cancelled"
      );

    res.json(cleanedOrders);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista dalabka" });
  }
};


// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.product", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Qalad helista dalabka" });
  }
};
// Controller: getOrdersFromMyProducts
export const getOrdersFromMyProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get all products owned by current marketer
    const myProducts = await Product.find({ createdBy: userId });
    const myProductIds = myProducts.map((p) => p._id.toString());

    // 2. Find orders that contain any of those products
    const orders = await Order.find({ "products.product": { $in: myProductIds } })
      .populate("user", "username email")
      .populate("products.product", "name price");

    // 3. Filter out products not belonging to this marketer & remove nulls
    const cleanedOrders = orders
      .map((order) => ({
        ...order.toObject(),
        products: order.products.filter(
          (p) => p.product !== null && myProductIds.includes(p.product._id.toString())
        ),
      }))
      .filter((order) => order.products.length > 0); // Ensure only orders with valid products

    res.json(cleanedOrders);
  } catch (error) {
    console.error("Error fetching marketer orders:", error);
    res.status(500).json({ message: "Qalad helista orders" });
  }
};
// backend
// controllers/orderController.js
export const getOrdersFromMyProductsByCustomer = async (req, res) => {
  try {
    const marketerId = req.user._id; // suuqgeeyaha
    const customerId = req.params.userId;

    // 1. Get all products owned by current marketer
    const myProducts = await Product.find({ createdBy: marketerId });
    const myProductIds = myProducts.map((p) => p._id.toString());

    // 2. Find orders by that customer that include marketer's products
    const orders = await Order.find({ 
      user: customerId,
      "products.product": { $in: myProductIds }
    })
      .populate("user", "username email")
      .populate("products.product", "name price createdBy");

    // 3. Clean orders: filter out non-marketer products
    const cleanedOrders = orders
      .map((order) => ({
        ...order.toObject(),
        products: order.products.filter(
          (p) =>
            p.product &&
            myProductIds.includes(p.product._id.toString())
        ),
      }))
      .filter((order) => order.products.length > 0);

    res.json(cleanedOrders);
  } catch (error) {
    console.error("Error filtering customer orders:", error);
    res.status(500).json({ message: "Qalad helista amarada macmiilka" });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Dalabka lama helin" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();

    await order.save();

    res.json({
      message: "Xaaladda dalabka si guul leh ayaa loo cusboonaysiiyay",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error); // 👈 Kani waa muhiim
    res
      .status(500)
      .json({ message: "Qalad cusboonaysiinta", error: error.message });
  }
};

// Update Order Details with Validation
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { products, shippingAddress, paymentMethod } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Dalabka lama helin' });
    }

    // Validate order can be updated
    if (order.orderStatus !== 'Processing') {
      return res.status(400).json({
        message: 'Kaliya dalabka Processing ayaa la cusboonaysan karaa'
      });
    }
    
    // Validate time (24 hours)
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const currentTime = new Date();
    if (currentTime - order.createdAt > TWENTY_FOUR_HOURS) {
      return res.status(400).json({
        message: 'Waqtiga cusboonaysiinta wuu dhacay (24 saac)'
      });
    }
    
    // Validate user ownership (customer can only update their own orders)
    const userId = req.user.id;
    if (order.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Ogolaansho la\'aan! Kaliya isticmaaluhu ama admin ayaa cusboonaysan kara'
      });
    }

    // Restore original stock quantities
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    let totalAmount = 0;
    const updatedProducts = [];

    // Process new products
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          message: `Alaabta ID ${item.productId} lama helin` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Qadarka la heli karo ${product.name} waa ${product.stock}` 
        });
      }
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
      
      // Add to order products
      updatedProducts.push({
        product: item.productId,
        quantity: item.quantity,
        price: product.price
      });
      
      // Calculate total
      totalAmount += product.price * item.quantity;
    }

    // Update order
    order.products = updatedProducts;
    order.totalAmount = totalAmount;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    order.updatedAt = new Date();
    
    await order.save();
    
    res.json({
      message: 'Dalabka si guul leh ayaa loo cusboonaysiiyay',
      order: {
        _id: order._id,
        user: order.user,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }
    });
    
  } catch (error) {
    console.error('Update Order Error:', error);
    res.status(500).json({
      message: 'Qalad cusboonaysiinta dalabka',
      error: error.message
    });
  }
};
// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Dalabka lama helin" });

    // Restore product stock
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update order status
    order.orderStatus = "Cancelled";
    order.paymentStatus = "Refunded";
    await order.save();

    res.json({ message: "Dalabka si guul leh ayaa loo joojiyay" });
  } catch (error) {
    res.status(500).json({ message: "Qalad joojinta dalabka" });
  }
};
// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Ololaha lama helin" });
    res.json({ message: "Ololaha si guul leh ayaa loo tirtiray" });
  } catch (error) {
    res.status(500).json({ message: "Qalad tirtirida" });
  }
};