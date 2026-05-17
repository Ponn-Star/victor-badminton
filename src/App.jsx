import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import News from './components/News';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import Cards from './components/Cards';
import CampaignCarousel from './components/CampaignCarousel';
import CompareTool from './components/CompareTool';
import MiniChat from './components/MiniChat';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import AthleteList from './components/AthleteList';
import AthleteDetail from './components/AthleteDetail';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AuthCallback from './components/AuthCallback';
import AdminPage from './components/AdminPage';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import { useEffect, useRef } from "react";
import Favico from "favico.js";

function AthleteDetailWithKey() {
  const { slug } = useParams();
  return <AthleteDetail key={slug} />;
}

function App() {
  const [compareItems, setCompareItems] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState('rackets');
  const navigate = useNavigate();
  const location = useLocation();
  const favicoRef = useRef(null);

  useEffect(() => {
    favicoRef.current = new Favico({ animation: 'none', bgColor: '#e8412a' });
    return () => { favicoRef.current?.reset(); };
  }, []);

  useEffect(() => {
    if (!favicoRef.current) return;
    if (compareItems.length > 0) {
      favicoRef.current.badge(compareItems.length);
    } else {
      favicoRef.current.reset();
    }
  }, [compareItems.length]);

  const noLayoutRoutes = ['/admin', '/login', '/register', '/auth/callback', '/sso-callback'];
  const showHeader = !noLayoutRoutes.some(path => location.pathname.startsWith(path));
  const showFooter = !noLayoutRoutes.some(path => location.pathname.startsWith(path));

  const addToCompare = (product) => {
    if (compareItems.length < 3 && !compareItems.find(p => p.id === product.id)) {
      setCompareItems([...compareItems, product]);
    }
  };

  const removeFromCompare = (productId) => {
    setCompareItems(compareItems.filter(p => p.id !== productId));
  };

  const viewProductDetail = (product, productType = 'rackets') => {
    setSelectedProduct(product);
    setSelectedProductType(productType);
    navigate(`/detail/${product.id}?type=${productType}&name=${encodeURIComponent(product.name)}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProductsClick = () => {
    navigate('/catalog');
  };

  const handleTeamVictorClick = () => {
    navigate('/athletes');
  };

  return (
    <div className="app-container">
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>
      
      {showHeader && (
      <Header
        compareCount={compareItems.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onProductsClick={handleProductsClick}
        onLogoClick={handleLogoClick}
        onOpenSearch={() => setIsSearchOpen(true)}
        onTeamVictorClick={handleTeamVictorClick}
      />
      )}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Cards />
              <CampaignCarousel />
              <News />
            </>
          } />
          <Route path="/catalog" element={
            <ProductCatalog 
              onCompare={addToCompare}
              onViewDetail={viewProductDetail}
            />
          } />
          <Route path="/detail/:productId" element={
            <ProductDetail 
              product={selectedProduct}
              productType={selectedProductType}
              onCompare={addToCompare}
            />
          } />
          <Route path="/athletes" element={<AthleteList />} />
          <Route path="/athletes/:slug" element={<AthleteDetailWithKey />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/*" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <CompareTool
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        items={compareItems}
        onRemove={removeFromCompare}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onViewDetail={viewProductDetail}
      />

      <MiniChat />

      {showFooter && <Footer />}
    </div>
  );
}

export default App;

