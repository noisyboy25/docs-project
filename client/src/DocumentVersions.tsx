import { RepeatClockIcon } from '@chakra-ui/icons';
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

const DocumentVersions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>
        <RepeatClockIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>Versions</ModalContent>
      </Modal>
    </>
  );
};

export default DocumentVersions;
