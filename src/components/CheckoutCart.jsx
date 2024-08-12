import styled from "styled-components";
import removeImg from "../images/cart-remove.png";
import { useEffect } from "react";
import PropTypes from "prop-types";

const CheckoutCart = ({ cart, updateCart }) => {
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart(storedCart);
  }, [updateCart]);

  const handleQuantityChange = (item, quantity) => {
    const updatedCart = cart.map((cartItem) => {
      if (
        cartItem.id === item.id &&
        cartItem.color === item.color &&
        cartItem.size === item.size
      ) {
        return { ...cartItem, quantity: quantity };
      }
      return cartItem;
    });
    updateCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id, color, size) => {
    const newCart = cart.filter(
      (item) => !(item.id === id && item.color === color && item.size === size)
    );
    updateCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };
  CheckoutCart.propTypes = {
    cart: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        maxStock: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
    updateCart: PropTypes.func.isRequired,
  };

  return (
    <>
      <Wrapper>
        <CartContainer>
          <CartTexts>
            <CartText>購物車</CartText>
            <CartCategorys>
              <NumText>數量</NumText>
              <UnitPriceText>單價</UnitPriceText>
              <SubtotalText>小計</SubtotalText>
            </CartCategorys>
          </CartTexts>
          <ProductsWrapper>
            {cart.map((item, index) => (
              <CartDetailContainer key={index}>
                <ProductDetailWrapper>
                  <ProductImg src={item.image}></ProductImg>
                  <ProductDetail>
                    <ProductName>{item.title}</ProductName>
                    <ProductId>{item.id}</ProductId>
                    <ProductColor>顏色 | {item.colorName}</ProductColor>
                    <ProductSize>尺寸 | {item.size}</ProductSize>
                  </ProductDetail>
                  <MobileCartWrapper>
                    <MobileTextWrapper>
                      <MobileNumWrapper>
                        <MobileNumText>數量{item.quantity}</MobileNumText>
                        <NumSelect
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item, parseInt(e.target.value))
                          }
                        >
                          {[...Array(item.maxStock).keys()].map((num) => (
                            <SelectOptions key={num + 1} value={num + 1}>
                              {num + 1}
                            </SelectOptions>
                          ))}
                        </NumSelect>
                      </MobileNumWrapper>
                      <MobileUnitPriceWrapper>
                        <MobileUnitPriceText>單價</MobileUnitPriceText>
                        <UnitPrice>TWD.{item.price}</UnitPrice>
                      </MobileUnitPriceWrapper>
                      <MobileSubtotalWrapper>
                        <MobileSubtotalText>小計</MobileSubtotalText>
                        <Subtotal>TWD.{item.price * item.quantity}</Subtotal>
                      </MobileSubtotalWrapper>
                    </MobileTextWrapper>
                    <SelectdOption>
                      <NumSelect
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item, parseInt(e.target.value))
                        }
                      >
                        {[...Array(item.maxStock).keys()].map((num) => (
                          <SelectOptions key={num + 1} value={num + 1}>
                            {num + 1}
                          </SelectOptions>
                        ))}
                      </NumSelect>
                      <UnitPrice>TWD.{item.price}</UnitPrice>
                      <Subtotal>TWD.{item.price * item.quantity}</Subtotal>
                    </SelectdOption>
                  </MobileCartWrapper>
                  <RemoveImgContainer
                    onClick={() =>
                      handleRemoveItem(item.id, item.color, item.size)
                    }
                  >
                    <RemoveImg src={removeImg}></RemoveImg>
                  </RemoveImgContainer>
                </ProductDetailWrapper>
              </CartDetailContainer>
            ))}
          </ProductsWrapper>
        </CartContainer>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 1160px;
  margin: 171px auto 0 auto;

  @media screen and (max-width: 1279px) {
    margin: 121px auto 0 auto;
    width: calc(100% - 48px);
  }
`;

const CartContainer = styled.div`
  height: auto;
  position: relative;
  top: 8px;

  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const CartTexts = styled.div`
  width: 100%;
  display: flex;
`;

const CartText = styled.h2`
  position: relative;
  width: auto;
  margin-right: 430px;
  font-size: 16px;
  top: 1px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    padding-bottom: 10px;
    margin: 0;
    border-bottom: 1px solid #3f3a3a;
  }
`;

const CartCategorys = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  left: 30px;
  align-items: center;
  margin: 0 15px 0 30px;

  @media screen and (max-width: 1279px) {
    display: none;
  }
`;

const NumText = styled.span`
  width: 32px;
`;
const UnitPriceText = styled.span`
  margin: 0 160px;
`;
const SubtotalText = styled.span`
  /* 添加你的樣式 */
`;
const ProductsWrapper = styled.div`
  height: auto;
  padding-top: 10px;
  border: 1px solid #979797;
  @media screen and (max-width: 1279px) {
    border: none;
  }
`;
const CartDetailContainer = styled.div`
  display: flex;
  position: relative;
  left: -1px;
  top: 1px;
  height: 152px;
  align-items: center;
  margin: 30px;
  @media screen and (max-width: 1279px) {
    height: 231px;
    margin: 20px 0;
    border-bottom: 1px solid #000;
  }
`;

const ProductDetailWrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
`;

const ProductImg = styled.img`
  height: 152px;
  width: 114px;
  margin-right: 16px;
`;

const ProductDetail = styled.div`
  position: relative;
  align-self: start;
  margin-right: 243px;
  bottom: 1px;
  @media screen and (max-width: 1279px) {
    margin-right: auto;
  }
`;

const ProductName = styled.div`
  width: 112px;
`;
const ProductId = styled.div`
  margin: 14px 0;
`;
const ProductColor = styled.div`
  margin: 20px 0 6px 0;
`;
const ProductSize = styled.div`
  position: relative;
  left: 2px;
`;
const SelectdOption = styled.div`
  display: flex;
  width: 100%;
  margin-right: 30px;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;
const NumSelect = styled.select`
  display: flex;
  width: 80px;
  height: 32px;
  padding-left: 10px;
  line-height: 16px;
  background-color: #f3f3f3;
  border-radius: 8px;
  @media screen and (max-width: 1279px) {
    margin-left: 12px;
  }
`;
const SelectOptions = styled.option``;

const UnitPrice = styled.div`
  position: relative;
  top: 2px;
  left: 1px;
  width: 192px;
  margin-left: 40px;
  text-align: center;
  @media screen and (max-width: 1279px) {
    width: auto;
  }
`;

const Subtotal = styled.div`
  width: 162px;
  text-align: center;
  @media screen and (max-width: 1279px) {
    width: auto;
  }
`;
const RemoveImgContainer = styled.div`
  display: flex;
  margin-left: 65px;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1279px) {
    position: absolute;
    top: 0;
    right: 0;
  }
`;
const RemoveImg = styled.img`
  display: flex;
  position: relative;
  left: 1px;
  width: 44px;
  height: 44px;
`;
const MobileCartWrapper = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
  }
`;
const MobileTextWrapper = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }
`;

const MobileNumWrapper = styled.div`
  position: relative;
`;
const MobileUnitPriceWrapper = styled.div``;
const MobileSubtotalWrapper = styled.div``;

const MobileNumText = styled.div`
  width: 104px;
  text-align: center;
`;
const MobileUnitPriceText = styled.div`
  width: 104px;
  text-align: center;
`;
const MobileSubtotalText = styled.div`
  width: 104px;
  text-align: center;
`;
export default CheckoutCart;
