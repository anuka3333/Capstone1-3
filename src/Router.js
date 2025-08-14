import { createHashRouter } from 'react-router';
import Layout from './Layout';
import Home from './home';
import About from './About';
import Contact from './contact';
import Portraits from './Potraits';
import LiveEvents from './LiveEvents';
import Hospitality from './Hospitality';
import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import Albums from './components/Albums';
import AlbumForm from './components/AlbumForm';

export const Router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'portraits', element: <Portraits /> },
      { path: 'live_events', element: <LiveEvents /> },
      { path: 'hospitality', element: <Hospitality /> },
      { path: 'my-account', element: <Home /> }, // or some public page
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      { path: 'shop', element: <h1>Coming Soon!</h1> },
      { path: 'albums', element: <Albums /> },
      { path: 'album-form', element: <AlbumForm /> },
    ],
  },
]);