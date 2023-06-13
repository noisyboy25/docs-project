import {
  Text,
  Button,
  Flex,
  Spacer,
  Link,
  ListItem,
  Box,
  List,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { DocumentInfo } from './Document';
import { API_URL } from './global';
import DocumentVersions from './DocumentVersions';

const DocumentList = ({
  documents,
  onUpdateDocuments: updateDocuments,
}: {
  documents: DocumentInfo[];
  onUpdateDocuments: Function;
}) => {
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
    <List spacing={'1em'}>
      {documents.map((document) => (
        <ListItem key={document.ID}>
          <Flex align={'center'} gap={'1em'}>
            <Text>{document.Name}</Text>
            <Spacer />
            <DocumentVersions document={document} />
            <Button color={'red.500'} onClick={() => handleDelete(document.ID)}>
              <DeleteIcon />
            </Button>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
};

export default DocumentList;
