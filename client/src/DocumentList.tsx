import {
  Text,
  Button,
  Flex,
  Spacer,
  Link,
  ListItem,
  Box,
  List,
  TableContainer,
  Table,
  Tr,
  Td,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { DocumentInfo } from './Document';
import { API_URL } from './global';
import DocumentVersions from './DocumentVersions';
import { parseDate } from './util';

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
    <TableContainer>
      <Table>
        {documents.map((document) => (
          <Tr key={document.ID}>
            <Td>
              <Text fontWeight={'semibold'}>{document.Name}</Text>
            </Td>
            <Td>
              <Text color={'gray.500'}>
                {parseDate(document.UpdatedAt).toLocaleTimeString()}{' '}
              </Text>
            </Td>
            <Td textAlign={'end'}>
              <Flex justify={'end'} gap={'1em'}>
                <DocumentVersions
                  document={document}
                  onUpdateDocuments={updateDocuments}
                />
                <Button
                  color={'red.500'}
                  onClick={() => handleDelete(document.ID)}
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            </Td>
          </Tr>
        ))}
      </Table>
    </TableContainer>
  );
};

export default DocumentList;
