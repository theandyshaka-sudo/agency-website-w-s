import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Reviews from './pages/Reviews';
import Examples from './pages/Examples';
import Admin from './pages/Admin';
import './App.css';

function PageLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`page-loader${hidden ? ' hidden' : ''}`}>
      <div className="loader-content">
        <div className="loader-logo">W&amp;A DIGITAL</div>
        <div className="loader-bar">
          <div className="loader-progress" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <PageLoader />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/admin"   element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
