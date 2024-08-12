import styled from "styled-components";
import line from "../images/line.png";
import facebook from "../images/facebook.png";
import twitter from "../images/twitter.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const MobileFooter = ({ cart }) => {
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
    <FooterWrapper>
      <FooterMobileWrapper className="hide">
        <LinksWrapperMobile>
          <Links>
            <LinkItem>關於 STYLiSH</LinkItem>
            <LinkItem>服務條款</LinkItem>
            <LinkItem>隱私政策</LinkItem>
          </Links>
          <LinksGapMobile />
          <Links>
            <LinkItem>聯絡我們</LinkItem>
            <LinkItem>FAQ</LinkItem>
          </Links>
        </LinksWrapperMobile>
        <IconsMobile>
          <IconImage src={line} alt="line" />
          <IconImage src={twitter} alt="twitter" />
          <IconImage src={facebook} alt="facebook" />
        </IconsMobile>
        <IconsGap />
        <RightsMobile>
          <p>©2018.All rights reserved.</p>
        </RightsMobile>
      </FooterMobileWrapper>
      <UtilityMobile>
        <CartMobile>
          <CartMobileWrapper>
            <Link to="/checkout">
              <CartImageMobile src="images/cart-mobile.png" alt="" />
              <CircleMobile>{cartItemCount}</CircleMobile>
            </Link>
          </CartMobileWrapper>
          <p>購物車</p>
        </CartMobile>

        <BorderWhite></BorderWhite>
        <MemberMobile>
          <MemberImageMobile src="images/member-mobile.png" alt="" />
          <p>會員</p>
        </MemberMobile>
      </UtilityMobile>
    </FooterWrapper>
  );
};
MobileFooter.propTypes = {
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

const FooterWrapper = styled.footer`
  width: 100%;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  background-color: #313538;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1279px) {
    height: auto;
  }
`;
const FooterMobileWrapper = styled.div`
  display: none;
  position: sticky;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 296px;
  height: 111px;
  margin-top: 40px;
  margin-bottom: 52px;
  @media screen and (max-width: 1279px) {
    display: flex;
  }
`;

const LinksWrapperMobile = styled.div`
  display: flex;
  position: relative;
  width: 177px;
  right: 8px;
  bottom: 31px;
`;
const Links = styled.ul`
  position: relative;
  list-style: none;
  color: #f5f5f5;
  display: flex;
  padding: 0;
  width: 80px;
  flex-direction: column;
  align-items: start;
`;

const LinkItem = styled.li`
  font-size: 16px;
  text-align: start;
  width: auto;
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
  padding-left: 14px;
  justify-self: center;
`;

const IconsGap = styled.div`
  width: 30px;
`;

const LinksGapMobile = styled.div`
  width: 30px;
`;

const IconsMobile = styled.div`
  position: relative;
  justify-self: center;
  height: auto;
  bottom: -1px;
  left: 8px;
`;

const RightsMobile = styled.div`
  display: flex;
  color: #828282;
  font-size: 12px;
  text-align: center;
  position: absolute;
  bottom: 13px;
  font-size: 10px;
`;

const UtilityMobile = styled.div`
  display: none;
  position: fixed;
  width: 100%;
  height: 60px;
  background-color: #313538;
  color: #ffffff;
  justify-content: space-evenly;
  right: 7px;
  bottom: -8px;
  @media screen and (max-width: 1279px) {
    display: flex;
  }
`;

const CartMobile = styled.div`
  display: flex;
  position: relative;
  bottom: 1px;
  left: 2px;
`;

const CartMobileWrapper = styled.div`
  display: flex;
  position: relative;
  top: 3px;
`;

const CartImageMobile = styled.img`
  position: relative;
  height: 44px;
  width: 44px;
  top: 2px;
`;

const CircleMobile = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background-color: #8b572a;
  border-radius: 100%;
  text-align: center;
  color: #ffffff;
  bottom: 12px;
  right: 0px;
`;

const BorderWhite = styled.div`
  position: relative;
  top: 13px;
  right: 2px;
  height: 24px;
  width: 1px;
  background-color: #fff;
`;

const MemberMobile = styled.div`
  display: flex;
  position: relative;
  bottom: 2px;
`;

const MemberImageMobile = styled.img`
  position: relative;
  height: 44px;
  width: 44px;
  top: 4px;
`;

export default MobileFooter;
