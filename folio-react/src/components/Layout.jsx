import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  }

  return (
    <>
      <Navbar />
      <main key={location.pathname + location.search} className="fade-route">
        {location.pathname !== '/' && (
          <div className="global-back-wrap">
            <button className="global-back" type="button" onClick={handleBack}>
              &larr; Back
            </button>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
