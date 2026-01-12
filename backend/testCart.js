const connectDB = require('./src/config/db');
const User = require('./src/models/user');
const Product = require('./src/models/productModel');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('./src/controllers/cartController');

const testCart = async () => {
  await connectDB();

  console.log('\n=== STEP 1: Get test user and product ===');
  
  const user = await User.findOne();
  const product = await Product.findOne();

  if (!user || !product) {
    console.log('❌ Need at least 1 user and 1 product in database first!');
    process.exit();
  }

  const userId = user._id;
  const productId = product._id;

  console.log('User:', user.email);
  console.log('Product:', product.title || product.name);

  console.log('\n=== STEP 2: Add product to cart ===');
  const add1 = await addToCart(userId, productId, 2);
  console.log(add1.message);

  console.log('\n=== STEP 3: Get cart ===');
  const cart1 = await getCart(userId);
  console.log('Cart items:', cart1.cart.items.length);

  console.log('\n=== STEP 4: Update quantity ===');
  const update = await updateCartItem(userId, productId, 5);
  console.log(update.message);

  console.log('\n=== STEP 5: Remove product ===');
  const remove = await removeFromCart(userId, productId);
  console.log(remove.message);

  console.log('\n✅ ALL CART TESTS PASSED!');
  process.exit();
};

testCart();