import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { API_URL } from './global';

type Inputs = {
  name: string;
  file: any;
};

function DocumentForm({
  onUpdateDocuments: updateDocuments,
}: {
  onUpdateDocuments: Function;
}) {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('file', data.file[0]);

      const res = await fetch(`${API_URL}/api/documents/`, {
        method: 'POST',
        body: formData,
      });
      console.log(res);
      if (res.ok) {
        reset();
        updateDocuments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input type="text" {...register('name', { required: true })} />
      </FormControl>
      <FormControl>
        <FormLabel>File</FormLabel>
        <Input
          type="file"
          {...register('file', { required: true, valueAsNumber: true })}
        />
      </FormControl>
      <Button mt={4} type="submit">
        Submit
      </Button>
    </form>
  );
}

export default DocumentForm;
