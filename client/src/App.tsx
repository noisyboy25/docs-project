import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const App = () => {
  return (
    <>
      <NavBar />
      <Container p={'1em'} maxW={'4xl'}>
        <Outlet />
      </Container>
    </>
  );
};

export default App;
