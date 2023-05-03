import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const App = () => {
  return (
    <Container>
      <NavBar />
      <Outlet />
    </Container>
  );
};

export default App;
