import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Document from './Document';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Home from './Home';
import App from './App';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/docs', element: <Document /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
