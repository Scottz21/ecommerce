import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { removeFromCart, updateCount, clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom'; // <-- Add this

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- Add this

  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.count * item.price, 0);

  const handleCheckout = () => {
    dispatch(clearCart());
    alert('Checkout complete! Your cart has been cleared.');
  };

  return (
    <div className="container py-4">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div className="d-flex align-items-center mb-3" key={item.id}>
              <img src={item.image} alt={item.title} width={50} height={50} style={{ objectFit: 'contain' }} />
              <div className="ms-3 me-auto">
                <div className="fw-bold">{item.title}</div>
                <div>Price: ${item.price}</div>
                <div>Count: {item.count}</div>
              </div>
              <button className="btn btn-outline-danger btn-sm"
                onClick={() => dispatch(removeFromCart(item.id))}>
                Remove
              </button>
            </div>
          ))}
          <div className="mt-3">
            <b>Total items:</b> {totalCount}
          </div>
          <div>
            <b>Total price:</b> ${totalPrice.toFixed(2)}
          </div>
          <button className="btn btn-primary mt-3 me-2" onClick={handleCheckout}>
            Checkout
          </button>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/")}
          >
            ⬅️ Continue Shopping
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
