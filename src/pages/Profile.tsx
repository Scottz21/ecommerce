import { useProductContext } from '../context/ProductContext';
import type { Product } from '../types/types';

const Profile: React.FC = () => {
  // Get products from context
  const { products } = useProductContext();

  return (
    <div>
      {/* Render each product title as an h1 */}
      {products.map((product: Product) => (
        <h1 key={product.id}>{product.title}</h1>
      ))}
    </div>
  );
};

export default Profile;
