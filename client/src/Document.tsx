import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API_URL } from './global';
import LogList from './LogList';

export type DocumentInfo = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  Name: string;
  Files: FileInfo[];
};

export type FileInfo = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  Uuid: string;
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
      <Tabs
        variant={'solid-rounded'}
        isLazy
        isManual
        orientation={'vertical'}
        size={'lg'}
      >
        <TabList p={'1em'} gap={'0.5em'}>
          <Tab>Документы</Tab>
          <Tab>Журнал</Tab>
          {/* <Tab>Templates</Tab> */}
          {/* <Tab>Users</Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex flexDir={'column'} gap={'1em'}>
              <DocumentForm onUpdateDocuments={handleUpdateDocuments} />
              <DocumentList
                documents={documents}
                onUpdateDocuments={handleUpdateDocuments}
              />
            </Flex>
          </TabPanel>
          <TabPanel>
            <LogList />
          </TabPanel>
          {/* <TabPanel>Templates</TabPanel> */}
          {/* <TabPanel>Users</TabPanel> */}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Document;
