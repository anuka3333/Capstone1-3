import NavBar from './components/nav/NavBar';
import { Outlet } from 'react-router-dom';
import './layout.css';

const Layout = () => (
  <div>
    <header className="header-row">
      <img src="/anuka.png" alt="Anuka Photos Banner" className="banner-img" />
      <NavBar />
    </header>

    <main>
      <Outlet />
    </main>
  </div>
);

export default Layout;