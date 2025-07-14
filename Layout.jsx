import NavBar from './components/nav/NavBar';
import { Outlet } from 'react-router-dom'
import './layout.css'

const Layout = () => (
  <div>
    <img src="/anuka.png" alt="Anuka Photos Banner" className="banner-img" />

    <NavBar />
    <div>
      <Outlet />
    </div>
  </div>
);

export default Layout;
