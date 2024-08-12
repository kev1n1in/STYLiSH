import styled from "styled-components";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProductContent = ({ onAddToCart }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [buttonMessage, setButtonMessage] = useState("請選擇顏色");

  useEffect(() => {
    const url = `https://api.appworks-school.tw/api/1.0/products/details?id=${productId}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setProduct(result.data);
      })
      .catch(() => {});
  }, [productId]);

  const handleColorChange = (colorCode) => {
    setSelectedColor(colorCode);
    setSelectedSize("");
    setQuantity(0);
    setButtonMessage("請選擇尺寸");
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(0);
    setButtonMessage("請選擇數量");
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert("請選擇顏色");
    } else if (!selectedSize) {
      alert("請選擇尺寸");
    } else if (quantity === 0) {
      alert("請選擇數量");
    } else {
      const colorName = product.colors.find(
        (color) => color.code === selectedColor
      ).name;
      const stock = getMaxStock(selectedColor, selectedSize);

      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        color: selectedColor,
        colorName: colorName,
        size: selectedSize,
        quantity: quantity,
        stock: stock,
        maxStock: product.stock,
        image: product.main_image,
      };
      // saveToLocalStorage(cartItem);
      onAddToCart(cartItem);
      setSelectedColor("");
      setSelectedSize("");
      setQuantity(0);
      updateStock(selectedColor, selectedSize, quantity);
      alert("已加入商品");
    }
  };

  const updateStock = (color, size, quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(
      (item) => item.color === color && item.size === size
    );

    if (index !== -1) {
      let existingItem = cart[index];
      existingItem.quantity += quantity;
      existingItem.stock = Math.max(existingItem.stock - quantity, 0);
    } else {
      const variantInCart = product.variants.find(
        (variant) => variant.color_code === color && variant.size === size
      );
      if (variantInCart) {
        let newStock = variantInCart.stock - quantity;
        const colorName = product.colors.find(
          (c) => c.code === color
      )?.name;
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          color: color,
          colorName: colorName,
          size: size,
          quantity: quantity,
          stock: newStock >= 0 ? newStock : 0,
          maxStock: variantInCart.stock,
          image: product.main_image,
        });
      }
    }

    // 更新購物車資料到 localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Updated cart:", cart);
  };

  const getMaxStock = (color, size) => {
    if (!product) return 0;
    const variant = product.variants.find(
      (v) => v.color_code === color && v.size === size
    );
    return variant ? variant.stock : 0;
  };

  const handleQuantityChange = (type) => {
    if (!selectedColor) {
      alert("請選擇顏色");
      return;
    }
    if (!selectedSize) {
      alert("請選擇尺寸");
      return;
    }
    if (!isSizeAvailable(selectedSize)) {
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const variantInCart = cart.find(
      (item) => item.color === selectedColor && item.size === selectedSize
    );

    const maxStock = variantInCart
      ? variantInCart.stock
      : getMaxStock(selectedColor, selectedSize);

    if (type === "increment") {
      if (quantity < maxStock) {
        setQuantity(quantity + 1);
        setButtonMessage("加入購物車");
      } 
    } else if (type === "decrement") {
      if (quantity > 0) {
        setQuantity(quantity - 1);
        if (quantity - 1 === 0) {
          setButtonMessage("請選擇數量");
        }
      }
    }
  };

  const isSizeAvailable = (size) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const variantInCart = cart.find(
      (item) => item.color === selectedColor && item.size === size
    );
    if (variantInCart) {
      return variantInCart.stock > 0;
    }
    const originalVariant = product.variants.find(
      (variant) => variant.color_code === selectedColor && variant.size === size
    );
    return originalVariant ? originalVariant.stock > 0 : false;
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ProductMain>
        <ProductWrapper>
          <ProductImg src={product.main_image}></ProductImg>
          <ProductInfo>
            <ProductTitle>
              <ProductName>{product.title}</ProductName>
              <ProductId>{product.id}</ProductId>
              <Price>
                TWD.{product.price}
                <ProductLine></ProductLine>
              </Price>
            </ProductTitle>
            <ProductSelector>
              <ProductChooseWrapper>
                <ColorWrapper>
                  <ColorText>顏色</ColorText>
                  <BorderRight></BorderRight>
                  <ProductColors>
                    {product.colors.map((color) => (
                      <ProductColor
                        key={color.code}
                        style={{ backgroundColor: `#${color.code}` }}
                        selected={color.code === selectedColor}
                        onClick={() => handleColorChange(color.code)}
                      ></ProductColor>
                    ))}
                  </ProductColors>
                </ColorWrapper>
                <SizeWrapper>
                  <SizeText>尺寸</SizeText>
                  <BorderRight></BorderRight>
                  <ProductSizes>
                    {product.sizes.map((size) => {
                      const available = isSizeAvailable(size);
                      return (
                        <SizeItem
                          key={size}
                          selected={size === selectedSize}
                          available={
                            available ? available.toString() : undefined
                          }
                          onClick={() => available && handleSizeChange(size)}
                          disabled={!available}
                          style={{
                            backgroundColor: available
                              ? size === selectedSize
                                ? "#000"
                                : "#ECECEC"
                              : "#ECECEC40",
                            color: available
                              ? size === selectedSize
                                ? "white"
                                : "#3F3A3A"
                              : "#3F3A3A40",
                            cursor: available ? "pointer" : "not-allowed",
                          }}
                        >
                          {size}
                        </SizeItem>
                      );
                    })}
                  </ProductSizes>
                </SizeWrapper>
                <NumWrapper>
                  <NumText>數量</NumText>
                  <NumBorderRight></NumBorderRight>
                  <CartWrapper>
                    <ProductCounter>
                      <CounterMinus
                        onClick={() => handleQuantityChange("decrement")}
                      >
                        -
                      </CounterMinus>
                      <CounterNum>{quantity}</CounterNum>
                      <CounterPlus
                        onClick={() => handleQuantityChange("increment")}
                      >
                        +
                      </CounterPlus>
                    </ProductCounter>
                  </CartWrapper>
                  <AddCartButtonMobile onClick={handleAddToCart}>
                    {buttonMessage}
                  </AddCartButtonMobile>
                </NumWrapper>
                <AddCartButton onClick={handleAddToCart}>
                  {buttonMessage}
                </AddCartButton>
              </ProductChooseWrapper>
            </ProductSelector>
            <ProductDetailWrapper>
              <ProductDescription>{product.note}</ProductDescription>
              <ProductTexture>{product.texture}</ProductTexture>
              <MaterialInfo>{product.description}</MaterialInfo>
              <ProductWash>清洗：{product.wash}</ProductWash>
              <ProductPlace>產地：{product.place}</ProductPlace>
            </ProductDetailWrapper>
          </ProductInfo>
        </ProductWrapper>
        <MoreInfoWrapper>
          <MoreInfo>
            <MoreInfoTextWrapper>
              <MoreInfoText>更多產品資訊</MoreInfoText>
            </MoreInfoTextWrapper>
          </MoreInfo>
          <MoreDescription>{product.story}</MoreDescription>
          {product.images &&
            product.images.map((src, index) => (
              <MoreImgItem key={index} src={src} />
            ))}
        </MoreInfoWrapper>
      </ProductMain>
    </>
  );
};
ProductContent.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
};
const ProductMain = styled.div`
  position: relative;
  margin-top: 205px;
  @media screen and (max-width: 1279px) {
    margin-top: 50px;
  }
`;

const ProductWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  width: 960px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    flex-direction: column;
  }
`;
const ProductName = styled.h1`
  color: #3f3a3a;
  font-weight: 400;
  font-size: 32px;
  letter-spacing: 6.4px;
  line-height: 38px;
`;
const ProductId = styled.p`
  margin: 0;
  font-size: 20px;
  color: #bababa;
  letter-spacing: 4px;
  line-height: 24px;
`;
const Price = styled.p`
  position: relative;
  color: #3f3a3a;
  font-size: 30px;
  font-weight: 400;
  line-height: 36px;
`;
const BorderRight = styled.span`
  position: absolute;
  top: 20px;
  left: 50px;
  height: 24px;
  width: 1px;
  background-color: #3f3a3a;
`;
const NumBorderRight = styled.span`
  position: absolute;
  top: 20px;
  left: 50px;
  height: 24px;
  width: 1px;
  background-color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    position: relative;
    display: none;
  }
`;
const ProductLine = styled.span`
  position: absolute;
  top: 55px;
  left: 0;
  height: 1px;
  width: 360px;
  background-color: #000;
  @media screen and (max-width: 1279px) {
    width: 95%;
  }
`;
const ProductImg = styled.img`
  width: 560px;
  height: 746px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    height: auto;
  }
`;
const ProductInfo = styled.div`
  margin-left: 40px;
`;
const ProductTitle = styled.div``;
const ProductSelector = styled.div``;
const ProductChooseWrapper = styled.div``;
const ColorText = styled.p``;
const ColorWrapper = styled.div`
  position: relative;
  display: flex;
`;
const ProductColors = styled.ul`
  display: flex;
`;
const ProductColor = styled.li`
  width: 24px;
  height: 24px;
  margin: 0 12px;
  list-style: none;
  border: 6px solid white;
  box-shadow: 0px 0px 1px #bbb;
  outline: ${(props) => (props.selected ? "1px solid #979797" : "none")};
`;
const SizeWrapper = styled.div`
  position: relative;
  display: flex;
`;
const SizeText = styled.p`
  line-height: 24px;
`;
const ProductSizes = styled.ul`
  display: flex;
`;
const SizeItem = styled.li`
  width: 36px;
  height: 36px;
  margin: 0 12px;
  text-align: center;
  line-height: 36px;
  background-color: ${(sizes) => (sizes.selected ? "black" : "#ECECEC")};
  color: ${(textColor) => (textColor.selected ? "white" : "##3F3A3A")};
  list-style: none;
  border-radius: 50%;
`;
const NumWrapper = styled.div`
  position: relative;
  display: flex;
`;
const NumText = styled.p`
  line-height: 24px;
  font-size: 20px;
  font-weight: 400;
  color: #3f3a3a;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;
const CartWrapper = styled.div``;
const ProductCounter = styled.div`
  position: relative;
  width: 160px;
  height: 44px;
  left: 40px;
  margin: 22px 0 26px 0;
  line-height: 44px;
  text-align: center;
  border: 1px solid #979797;
  @media screen and (max-width: 1279px) {
    left: 0px;
    position: absolute;
    width: 95%;
  }
`;
const CounterMinus = styled.span`
  position: absolute;
  left: 15px;
  &:hover {
    cursor: pointer;
  }
`;
const CounterNum = styled.p`
  margin: 0;
  color: #8b572a;
`;
const CounterPlus = styled.span`
  position: absolute;
  right: 15px;
  bottom: 0;
  &:hover {
    cursor: pointer;
  }
`;
const AddCartButton = styled.button`
  width: 360px;
  height: 64px;
  font-size: 20px;
  line-height: 30px;
  color: #fff;
  background-color: #000;
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;
const AddCartButtonMobile = styled.button`
  display: none;
  width: 360px;
  height: 44px;
  font-size: 16px;
  line-height: 30px;
  color: #fff;
  background-color: #000;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1279px) {
    display: block;
    position: absolute;
    top: 80px;
    width: 95%;
  }
`;
const ProductDetailWrapper = styled.div`
  width: 240px;
  height: 200px;
  margin-top: 40px;
  @media screen and (max-width: 1279px) {
    position: relative;
    top: 128px;
    margin-bottom: 28px;
  }
`;
const ProductDescription = styled.div`
  color: #3f3a3a;
`;
const ProductTexture = styled.div`
  position: relative;
  top: 30px;
  color: #3f3a3a;
`;
const MaterialInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 70px;
  margin: 30px 0;
  color: #3f3a3a;
`;
const ProductWash = styled.div`
  color: #3f3a3a;
`;
const ProductPlace = styled.div`
  color: #3f3a3a;
`;
const MoreInfoWrapper = styled.div`
  margin: 0 auto 178px auto;
  width: 960px;
  @media screen and (max-width: 1279px) {
    position: relative;
    margin: 0 auto 300px auto;
    top: 80px;
    width: calc(100% - 48px);
  }
`;
const MoreInfo = styled.div`
  margin: 25px 0;
  display: flex;
  height: 30px;
  width: 960px;
  @media screen and (max-width: 1279px) {
    width: calc(100% - 48px);
  }
`;
const MoreInfoTextWrapper = styled.div`
  position: relative;
  margin-right: 64px;
  @media screen and (max-width: 1279px) {
    width: 95vw;
    margin-right: 0;
  }
`;
const MoreInfoText = styled.div`
  display: flex;
  position: relative;
  margin-right: 64px;
  line-height: 30px;
  color: #8b572a;
  &::after {
    content: "";
    position: absolute;
    bottom: 15px;
    left: 190px;
    width: 761px;
    height: 1px;
    background-color: #000;
    @media screen and (max-width: 1279px) {
      width: 85%;
      left: 25%;
    }
  }
`;

const MoreDescription = styled.div`
  color: #3f3a3a;
  font-size: 20px;
  margin-bottom: 30px;
`;
const MoreImgItem = styled.img`
  margin-bottom: 30px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    height: auto;
  }
`;

export default ProductContent;
