import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { Container } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API_URL } from './global';

export type Product = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  Code: string;
  Price: number;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const handleUpdateProducts = async () => {
    const res = await fetch(`${API_URL}/api/products/`);
    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => {
    handleUpdateProducts();
  }, []);

  return (
    <div className="App">
      <Container>
        <ProductForm onUpdateProducts={handleUpdateProducts} />
        <ProductList
          products={products}
          onUpdateProducts={handleUpdateProducts}
        />
      </Container>
    </div>
  );
}

export default App;
