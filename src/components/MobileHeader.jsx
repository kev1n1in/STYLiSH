import styled from "styled-components";
import { useState, useRef } from "react";
import search from '../images/search.png';


const MobileHeader = () => {
  const [isNavRightVisible, setIsNavRightVisible] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearchImgClick = () => {
    setIsNavRightVisible((prev) => !prev);
    if (!isNavRightVisible) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  };

  return (
    <MobileHeaderWrapper>
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
      <NavRight visible={isNavRightVisible}>
        <SearchInput type="text" placeholder="西裝" />
      </NavRight>
      <SearchImgHide
        src={search}
        alt="search__img"
        onClick={handleSearchImgClick}
      />
    </MobileHeaderWrapper>
  );
};

const MobileHeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  top: 52px;
  right: 2px;
  height: 50px;
  background-color: #313538;
  color: #828282;
  z-index: 2;
  display: none;
  @media screen and (max-width: 1279px) {
    display: flex;
  }
`;
const Categories = styled.ul`
  display: flex;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  justify-content: space-evenly;
  cursor: pointer;
`;

const Category = styled.li`
  display: flex;
  position: relative;
  left: 0;
  font-size: 16px;
  letter-spacing: 0;
`;

const CategoryLink = styled.a`
  text-decoration: none;
  color: #828282;
  &:hover {
    color: #fff;
  }
`;
const SearchImgHide = styled.img`
  position: absolute;
  top: 4px;
  right: 18px;
  opacity: 0;
  @media screen and (max-width: 1279px) {
    display: flex;
    position: absolute;
    top: -47px;
    right: 17px;
    opacity: 1;
  }
  &:hover {
    cursor: pointer;
  }
`;
const BorderGray = styled.div`
  position: relative;
  top: 18x;
  height: 16px;
  width: 1px;
  background-color: #828282;
`;

const NavRight = styled.div`
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  align-items: center;
  bottom: 54px;
  right: 66px;
  width: 98%;
  left: 13px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 2px 50px 0 19px;
  font-size: 20px;
  border: 1px solid #979797;
  box-sizing: border-box;
  border-radius: 22px;
  color: #8b572a;

  &::placeholder {
    font-size: 20px;
    color: #8b572a;
  }
`;

export default MobileHeader;
