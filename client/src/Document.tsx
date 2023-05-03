import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import { Container, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API_URL } from './global';

export type DocumentInfo = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  Name: string;
  Filename: string;
};

const Document = () => {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);

  const handleUpdateDocuments = async () => {
    const res = await fetch(`${API_URL}/api/documents/`);
    const data = await res.json();
    setDocuments(data.documents);
  };

  useEffect(() => {
    handleUpdateDocuments();
  }, []);

  return (
    <>
      <Container>
        <Flex flexDir={'column'} gap={'1em'}>
          <DocumentForm onUpdateDocuments={handleUpdateDocuments} />
          <DocumentList
            documents={documents}
            onUpdateDocuments={handleUpdateDocuments}
          />
        </Flex>
      </Container>
    </>
  );
};

export default Document;
