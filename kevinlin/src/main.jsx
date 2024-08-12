
import { createRoot } from 'react-dom/client';
import App from './ProductPage.jsx';
import CheckoutPage from './CheckoutPage.jsx'
import { BrowserRouter,Routes,Route } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
 <BrowserRouter>
 <Routes>
    <Route path="/product"  element={<App />}/>
    <Route path='/checkout' element={<CheckoutPage/>}></Route>
    </Routes>
  </BrowserRouter>

);