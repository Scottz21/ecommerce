import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { removeFromCart, updateCount, clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // Access cart state from Redux store
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate total number of items in cart
  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
  // Calculate total price for all items in cart
  const totalPrice = cart.reduce((sum, item) => sum + item.count * item.price, 0);

  // Handler for checkout button; clears cart and shows confirmation
  const handleCheckout = () => {
    dispatch(clearCart());
    alert('Checkout complete! Your cart has been cleared.');
  };

  return (
    <div className="container py-4">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        // Show message if cart is empty
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* Render each cart item */}
          {cart.map(item => (
            <div className="d-flex align-items-center mb-3" key={item.id}>
              <img src={item.image} alt={item.title} width={50} height={50} style={{ objectFit: 'contain' }} />
              <div className="ms-3 me-auto">
                <div className="fw-bold">{item.title}</div>
                <div>Price: ${item.price}</div>
                <div>Count: {item.count}</div>
              </div>
              {/* Button to remove item from cart */}
              <button className="btn btn-outline-danger btn-sm"
                onClick={() => dispatch(removeFromCart(item.id))}>
                Remove
              </button>
            </div>
          ))}
          {/* Show total items and total price */}
          <div className="mt-3">
            <b>Total items:</b> {totalCount}
          </div>
          <div>
            <b>Total price:</b> ${totalPrice.toFixed(2)}
          </div>
          {/* Checkout button */}
          <button className="btn btn-primary mt-3 me-2" onClick={handleCheckout}>
            Checkout
          </button>
          {/* Button to go back to product listing */}
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
