import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import { Container } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API_URL } from './global';

export type Document = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  Name: string;
};

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleUpdateDocuments = async () => {
    const res = await fetch(`${API_URL}/api/documents/`);
    const data = await res.json();
    setDocuments(data.documents);
  };

  useEffect(() => {
    handleUpdateDocuments();
  }, []);

  return (
    <div className="App">
      <Container>
        <DocumentForm onUpdateDocuments={handleUpdateDocuments} />
        <DocumentList
          documents={documents}
          onUpdateDocuments={handleUpdateDocuments}
        />
      </Container>
    </div>
  );
}

export default App;
