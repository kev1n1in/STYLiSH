import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Header = ({ cart }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = storedCart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    setCartItemCount(totalQuantity);
  }, [cart]);
  return (
    <HeaderWrapper>
      <LogoLink href="./home.html?category=all">
        <Logo src="images/logo.png" alt="web_logo" />
      </LogoLink>
      <CategoriesGap></CategoriesGap>
      <Categories>
        <Category>
          <CategoryLink href="./home.html?category=women">女裝</CategoryLink>
        </Category>
        <BorderGray></BorderGray>
        <Category>
          <CategoryLink href="./home.html?category=men">男裝</CategoryLink>
        </Category>
        <BorderGray></BorderGray>
        <Category>
          <CategoryLink href="./home.html?category=accessories">
            配件
          </CategoryLink>
        </Category>
      </Categories>
      <NavRight>
        <SearchWrapper>
          <SearchInput type="text" placeholder="西裝" />
          <SearchImg src="images/search.png" alt="search__img" />
        </SearchWrapper>
        <UtilityDesktop>
          <Cart>
            <Link to="/checkout">
              <CartImg src="images/cart.png" alt="" />
              <Circle>{cartItemCount}</Circle>
            </Link>
          </Cart>
          <Member src="images/member.png" alt="" />
        </UtilityDesktop>
      </NavRight>
    </HeaderWrapper>
  );
};
Header.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      colorName: PropTypes.string,
      size: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const HeaderWrapper = styled.header`
  position: fixed;
  display: flex;
  height: 100px;
  width: 100%;
  top: 0px;
  background-color: #fff;
  border-bottom: 40px solid #313538;
  z-index: 2;
  @media screen and (max-width: 1279px) {
    position: fixed;
    display: flex;
    justify-content: center;
    right: 1px;
    height: 52px;
    border-bottom: none;
  }
`;
const LogoLink = styled.a``;
const Logo = styled.img`
  position: relative;
  top: 26px;
  left: 60px;
  height: 48px;
  width: 258px;
  cursor: pointer;
  @media screen and (max-width: 1279px) {
    top: 13px;
    left: 0;
    bottom: 26px;
    height: 24px;
    width: 129px;
  }
`;
const CategoriesGap = styled.div`
  width: 32px;
`;
const Categories = styled.ul`
  flex: 1;
  display: flex;
  position: relative;
  width: 451px;
  margin: 0;
  align-items: center;
  list-style: none;
  left: 1px;
  @media screen and (max-width: 1279px) {
    display: none;
  }
  &:hover {
    cursor: pointer;
  }
`;
const Category = styled.li`
  display: flex;
  position: relative;
  letter-spacing: 30px;
  padding-left: 50px;
  top: 9.5px;
  left: 34.5px;
  font-size: 20px;
`;
const CategoryLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    color: #8b572a;
  }
`;

const BorderGray = styled.div`
  position: relative;
  height: 20px;
  top: 9px;
  left: 44px;
  width: 1px;
  background-color: #828282;
`;

const NavRight = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  top: 3px;
  right: 66px;
  @media screen and (max-width: 1279px) {
    display: block;
    position: absolute;
    width: 98%;
    left: 13px;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  bottom: 2px;
  left: 13px;
  @media screen and (max-width: 1279px) {
    display: none;
    position: relative;
    top: 3px;
  }
`;

const SearchInput = styled.input`
  width: 215px;
  height: 46px;
  padding: 2px 50px 0 19px;
  font-size: 20px;
  border: 1px solid #979797;
  box-sizing: border-box;
  border-radius: 22px;
  color: #8b572a;
  @media screen and (max-width: 1279px) {
    width: 100%;
    height: 42px;
  }
  &::placeholder {
    font-size: 20px;
    color: #8b572a;
  }
`;

const SearchImg = styled.img`
  position: absolute;
  top: 1px;
  right: 12px;
  z-index: 10;
  &:hover {
    cursor: pointer;
  }
`;

const UtilityDesktop = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-evenly;
  top: -2px;
  left: 12px;
`;
const Cart = styled.div`
  position: relative;
  padding: 0 42px;
  @media screen and (max-width: 1279px) {
    display: none;
  }
  &:hover {
    cursor: pointer;
  }
`;
const CartImg = styled.img`
  opacity: 1;
`;
const Circle = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  right: 42px;
  bottom: 3px;
  line-height: 24px;
  background-color: #8b572a;
  border-radius: 100%;
  text-align: center;
  color: #ffffff;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;
const Member = styled.img`
  @media screen and (max-width: 1279px) {
    display: none;
  }
  &:hover {
    cursor: pointer;
  }
`;

export default Header;
