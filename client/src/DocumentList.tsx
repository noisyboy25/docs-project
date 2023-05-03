import {
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text,
  Button,
  Flex,
  Spacer,
  Link,
} from '@chakra-ui/react';
import { Document } from './App';
import { API_URL } from './global';

function DocumentList({
  documents,
  onUpdateDocuments: updateDocuments,
}: {
  documents: Document[];
  onUpdateDocuments: Function;
}) {
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) updateDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SimpleGrid spacing={4}>
      {documents.map((document) => (
        <Card key={document.ID}>
          <CardHeader>
            <Flex>
              <Text>Name: {document.Name}</Text>
              <Spacer />
              <Button
                colorScheme={'red'}
                onClick={() => handleDelete(document.ID)}
              >
                X
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Link href={`/files/${document.ID}`}>{document.Filename}</Link>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default DocumentList;
