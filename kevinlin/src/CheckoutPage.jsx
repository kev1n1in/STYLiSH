import {useState ,useEffect ,useCallback} from 'react';
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import Footer from './components/Footer';
import MobileFooter from './components/MobileFooter'
import CheckoutCart from './components/CheckoutCart';
import CheckoutDetail from './components/CheckoutDetail';
import GlobalStyle from './GlobalStyle';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const calculateTotalAmount = useCallback((cart) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotalAmount(storedCart);
  }, [calculateTotalAmount]);



  const updateCart = useCallback((newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    calculateTotalAmount(newCart);
  }, [calculateTotalAmount]);
  const handleOrderSubmit = () => {
    setCart([]);
    setTotalAmount(0);
    localStorage.removeItem("cart");
  };
  return (
    <>
      <GlobalStyle/>
      <Header cart={cart}/>
      <MobileHeader />
      <CheckoutCart cart={cart} updateCart={updateCart} ></CheckoutCart>
      <CheckoutDetail totalAmount={totalAmount} onOrderSubmit={handleOrderSubmit}></CheckoutDetail>
      <Footer />
      <MobileFooter cart={cart}/>
    </>
  );
};

export default CheckoutPage;
