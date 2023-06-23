import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { API_URL } from './global';
import { useState } from 'react';
import { ErrorMessage } from '@hookform/error-message';

type Inputs = {
  name: string;
};

const DocumentForm = ({
  onUpdateDocuments: updateDocuments,
}: {
  onUpdateDocuments: Function;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append('name', data.name);

      const res = await fetch(`${API_URL}/api/documents/`, {
        method: 'POST',
        body: formData,
      });

      console.log(res);
      if (!res.ok) {
        const text = await res.text();
        let error = 'Неизвестная ошибка';
        if (text.includes('duplicate')) error = 'Имя уже используется';
        setError('name', { type: 'server', message: error });
        return;
      }
      reset();
      updateDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel>Имя документа</FormLabel>
        <Input
          type="text"
          {...register('name', { required: 'Введите имя документа' })}
        />
        <ErrorMessage
          name={'name'}
          errors={errors}
          render={({ message }) => <Box color={'red.600'}>{message}</Box>}
        />
      </FormControl>
      <Button mt={4} type="submit">
        Добавить
      </Button>
    </form>
  );
};

export default DocumentForm;
