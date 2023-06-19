import { DeleteIcon, DownloadIcon, RepeatClockIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  List,
  ListItem,
  Modal,
  ModalContent,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { DocumentInfo } from './Document';
import { API_URL } from './global';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';

type Inputs = {
  file: any;
};

const DocumentVersions = ({
  document,
  onUpdateDocuments: updateDocuments,
}: {
  document: DocumentInfo;
  onUpdateDocuments: Function;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, handleSubmit, reset, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      if (!data.file) return;

      const formData = new FormData();
      formData.append('file', data.file[0]);
      reset({ file: null });

      const res = await fetch(`${API_URL}/api/documents/${document.ID}/files`, {
        method: 'POST',
        body: formData,
      });

      console.log(res);

      if (res.ok) updateDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/documents/files/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) updateDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <>
      <Button onClick={onOpen}>
        <RepeatClockIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay />
        <ModalContent p={'1em'}>
          <FormControl>
            <FormLabel>Добавить файл</FormLabel>
            <Input type="file" {...register('file', { required: true })} />
          </FormControl>
          <TableContainer>
            <Table>
              <Tbody>
                {document.Files.map((f) => (
                  <Tr key={f.ID}>
                    <Td maxW={'20ch'} overflow={'hidden'} title={f.Filename}>
                      {`${f.Filename.substring(0, 18)}${
                        f.Filename.length > 18 ? '...' : ''
                      }`}
                    </Td>
                    <Td>
                      {new Date(Date.parse(f.UpdatedAt)).toLocaleString()}
                    </Td>
                    <Td>
                      <Link
                        href={`/files/${f.ID}`}
                        title={f.Filename}
                        p={'0.5em'}
                      >
                        <DownloadIcon mr={'0.5em'} />
                      </Link>
                      <Button
                        color={'red.500'}
                        onClick={() => handleDelete(f.ID)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DocumentVersions;
