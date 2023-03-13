import {
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text,
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { Product } from './App';
import { API_URL } from './global';

function ProductList({
  products,
  onUpdateProducts: updateProducts,
}: {
  products: Product[];
  onUpdateProducts: Function;
}) {
  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) updateProducts();
  };

  return (
    <SimpleGrid spacing={4}>
      {products.map((product) => (
        <Card key={product.ID}>
          <CardHeader>
            <Flex>
              <Text>Code: {product.Code}</Text>
              <Spacer />
              <Button
                colorScheme={'red'}
                onClick={() => handleDelete(product.ID)}
              >
                X
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>Price: {product.Price}</Text>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default ProductList;
