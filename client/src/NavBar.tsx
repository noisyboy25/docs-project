import { Flex, Link } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <Flex justify={'space-around'}>
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
  );
};

export default NavBar;
