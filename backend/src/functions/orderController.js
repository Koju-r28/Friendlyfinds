const Order = require('./orderModel');
const { markProductAsSold } = require('./productFunctions');

const createOrder = async (buyerId, sellerId, productId, price) => {
  try {
    const newOrder = new Order({
      buyerId,
      sellerId,
      productId,
      price,
      status: 'completed'
    });

    await newOrder.save();
    
    await markProductAsSold(productId);
    
    return { success: true, message: 'Order created successfully', order: newOrder };
  } catch (error) {
    return { success: false, message: 'Error creating order', error: error.message };
  }
};

const getPurchaseHistory = async (buyerId) => {
  try {
    const orders = await Order.find({ buyerId })
      .populate('productId', 'title price category')
      .populate('sellerId', 'email')
      .sort({ orderDate: -1 });
    
    return { success: true, orders };
  } catch (error) {
    return { success: false, message: 'Error fetching purchase history', error: error.message };
  }
};

const getSellingHistory = async (sellerId) => {
  try {
    const orders = await Order.find({ sellerId })
      .populate('productId', 'title price category')
      .populate('buyerId', 'email')
      .sort({ orderDate: -1 });  
    
    return { success: true, orders };
  } catch (error) {
    return { success: false, message: 'Error fetching selling history', error: error.message };
  }
};

const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    
    return { success: true, message: 'Order cancelled', order };
  } catch (error) {
    return { success: false, message: 'Error cancelling order', error: error.message };
  }
};

module.exports = {
  createOrder,
  getPurchaseHistory,
  getSellingHistory,
  cancelOrder
};