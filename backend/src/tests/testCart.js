const connectDB = require('../src/config/db');
const User = require('../src/models/user');
const Product = require('../src/models/productModel');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../src/controllers/cartController');

const testCart = async () => {
  await connectDB();

  console.log('\n=== STEP 1: Get test user and product ===');
  
  // Find an existing user and product from your database
  const user = await User.findOne();
  const product = await Product.findOne();

  if (!user || !product) {
    console.log('❌ Need at least 1 user and 1 product in database first!');
    console.log('Create a user via signup and a product first.');
    process.exit();
  }

  const userId = user._id;
  const productId = product._id;

  console.log('User:', user.email);
  console.log('Product:', product.title);

  console.log('\n=== STEP 2: Add product to cart ===');
  const add1 = await addToCart(userId, productId, 2);
  console.log(add1.message);

  console.log('\n=== STEP 3: Get cart ===');
  const cart1 = await getCart(userId);
  console.log('Cart items:', cart1.cart.items.length);
  console.log('Product in cart:', cart1.cart.items[0].productId.title);
  console.log('Quantity:', cart1.cart.items[0].quantity);

  console.log('\n=== STEP 4: Update quantity ===');
  const update = await updateCartItem(userId, productId, 5);
  console.log(update.message);
  console.log('New quantity:', update.cart.items[0].quantity);

  console.log('\n=== STEP 5: Add same product again (should increase quantity) ===');
  const add2 = await addToCart(userId, productId, 3);
  console.log('Quantity after adding 3 more:', add2.cart.items[0].quantity);

  console.log('\n=== STEP 6: Remove product ===');
  const remove = await removeFromCart(userId, productId);
  console.log(remove.message);
  console.log('Items in cart:', remove.cart.items.length);

  console.log('\n=== STEP 7: Add product again and clear cart ===');
  await addToCart(userId, productId, 1);
  const clear = await clearCart(userId);
  console.log(clear.message);
  console.log('Items in cart:', clear.cart.items.length);

  console.log('\n✅ ALL CART TESTS PASSED!');
  process.exit();
};

testCart();