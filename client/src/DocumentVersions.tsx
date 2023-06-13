import { DownloadIcon, RepeatClockIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Link,
  List,
  ListItem,
  Modal,
  ModalContent,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import { DocumentInfo } from './Document';

const DocumentVersions = ({ document }: { document: DocumentInfo }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>
        <RepeatClockIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <List>
            <ListItem>
              <Flex p={'1em'}>
                <Box>{document.File.Filename}</Box>
                <Box>
                  {new Date(
                    Date.parse(document.File.UpdatedAt)
                  ).toLocaleString()}
                </Box>
                <Link
                  href={`/files/${document.File.ID}`}
                  title={document.File.Filename}
                >
                  <DownloadIcon />
                </Link>
              </Flex>
            </ListItem>
          </List>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DocumentVersions;
