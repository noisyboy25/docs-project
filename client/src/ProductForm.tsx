import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  code: string;
  price: number;
};

function ProductForm({
  onUpdateProducts: updateProducts,
}: {
  onUpdateProducts: Function;
}) {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const res = await fetch('/api/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(res);
    if (res.ok) {
      reset();
      updateProducts();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel>Code</FormLabel>
        <Input type="text" {...register('code', { required: true })} />
      </FormControl>
      <FormControl>
        <FormLabel>Price</FormLabel>
        <Input
          type="number"
          {...register('price', { required: true, valueAsNumber: true })}
        />
      </FormControl>
      <Button mt={4} type="submit">
        Submit
      </Button>
    </form>
  );
}

export default ProductForm;