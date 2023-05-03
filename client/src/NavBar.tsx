import { Flex, Link } from '@chakra-ui/layout';
import { Box, Image, Spacer } from '@chakra-ui/react';
import { NavLink, Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <Flex p={'1em'} bg={'blue.50'} color={'blue.600'} gap={'5em'}>
      <Link as={RouterLink} to={'/'}>
        <Image
          src="https://img.artlebedev.ru/everything/hovansky/hovansky-logo.png"
          boxSize={'36px'}
        />
      </Link>
      <Flex justify={'space-around'} align={'center'} gap={'3em'}>
        <Box>
          <Link to={'/'} as={NavLink}>
            Home
          </Link>
        </Box>
        <Box>
          <Link to={'/docs'} as={NavLink}>
            Documents
          </Link>
        </Box>
      </Flex>
      <Spacer />
    </Flex>
  );
};

export default NavBar;
