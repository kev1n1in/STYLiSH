import {useState} from 'react';
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import Footer from './components/Footer';
import MobileFooter from './components/MobileFooter'
import ProductContent from './ProductContent';
import GlobalStyle from './GlobalStyle';

function App() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (cartItem) => {
      setCart((prevCart) => [...prevCart, cartItem]);
  };
  return (
    <>
      <GlobalStyle/>
      <Header cart={cart}/>
      <MobileHeader />
      <ProductContent onAddToCart={handleAddToCart}/>
      <Footer />
      <MobileFooter cart={cart}/>
    </>
  );
}

export default App;