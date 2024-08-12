import { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const initialOrderDetails = {
  name: "",
  phone: "",
  address: "",
  email: "",
  deliveryTime: "",
};

const initialErrors = {
  name: false,
  phone: false,
  address: false,
  email: false,
  deliveryTime: false,
};

const CheckoutDetail = ({ totalAmount, onOrderSubmit }) => {
  const shippingFee = totalAmount > 0 ? 30 : 0;
  const [orderDetails, setOrderDetails] = useState(initialOrderDetails);
  const [errors, setErrors] = useState(initialErrors);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);
  const deliveryTimeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateOrderDetails(name, value);
  };

  const handleDeliveryTimeChange = (time) => {
    updateOrderDetails("deliveryTime", time);
  };

  const updateOrderDetails = (name, value) => {
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !validateField(name, value),
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() !== "";
      case "phone":
        return /^09\d{8}$/.test(value);
      case "address":
        return value.trim() !== "";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "deliveryTime":
        return value !== "";
      default:
        return true;
    }
  };

  const handleErrorFocus = (ref, errorMessages, message) => {
    if (ref.current) {
      errorMessages.push(message);
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.current.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (totalAmount === 0) {
      alert("買點東西吧");
      return;
    }
    const newErrors = {
      name: !validateField("name", orderDetails.name),
      phone: !validateField("phone", orderDetails.phone),
      address: !validateField("address", orderDetails.address),
      email: !validateField("email", orderDetails.email),
      deliveryTime: !validateField("deliveryTime", orderDetails.deliveryTime),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      const errorMessages = [];
      if (newErrors.name) {
        handleErrorFocus(nameRef, errorMessages, "收件人姓名");
      }
      if (newErrors.phone) {
        handleErrorFocus(phoneRef, errorMessages, "手機號碼");
      }
      if (newErrors.address) {
        handleErrorFocus(addressRef, errorMessages, "地址");
      }
      if (newErrors.email) {
        handleErrorFocus(emailRef, errorMessages, "Email");
      }
      if (newErrors.deliveryTime) {
        handleErrorFocus(deliveryTimeRef, errorMessages, "配送時間");
      }

      alert(`請正確填寫以下欄位: ${errorMessages.join(", ")}`);
      return;
    }

    setOrderDetails(initialOrderDetails);
    localStorage.clear();
    alert("已加入購物車");
    onOrderSubmit();
  };

  return (
    <Container>
      <OrderDetailContainer>
        <OrderText>訂購資料</OrderText>
        <NameWrapper ref={nameRef}>
          <DetailText>收件人姓名</DetailText>
          <DetailInputWrapper>
            <DetailInput
              name="name"
              value={orderDetails.name}
              onChange={handleChange}
              error={errors.name}
            ></DetailInput>
            <Note>務必填寫完整收件人姓名，避免包裹無法順利簽收</Note>
          </DetailInputWrapper>
        </NameWrapper>
        <DetailWrapper ref={phoneRef}>
          <DetailText>手機</DetailText>
          <InputWrapper>
            <DetailInput
              name="phone"
              value={orderDetails.phone}
              onChange={handleChange}
              error={errors.phone}
            ></DetailInput>
          </InputWrapper>
        </DetailWrapper>
        <DetailWrapper ref={addressRef}>
          <DetailText>地址</DetailText>
          <InputWrapper>
            <DetailInput
              name="address"
              value={orderDetails.address}
              onChange={handleChange}
              error={errors.address}
            ></DetailInput>
          </InputWrapper>
        </DetailWrapper>
        <DetailWrapper ref={emailRef}>
          <DetailText>Email</DetailText>
          <InputWrapper>
            <DetailInput
              name="email"
              value={orderDetails.email}
              onChange={handleChange}
              error={errors.email}
            ></DetailInput>
          </InputWrapper>
        </DetailWrapper>
        <DeliverTimeWrapper ref={deliveryTimeRef}>
          <DetailText>配送時間</DetailText>
          <Labels>
            <Label>
              <TimeButton
                name="deliveryTime"
                checked={orderDetails.deliveryTime === "08:00-12:00"}
                onClick={() => handleDeliveryTimeChange("08:00-12:00")}
              ></TimeButton>
              <TimeText>08:00-12:00</TimeText>
            </Label>
            <Label>
              <TimeButton
                name="deliveryTime"
                checked={orderDetails.deliveryTime === "14:00-18:00"}
                onClick={() => handleDeliveryTimeChange("14:00-18:00")}
              ></TimeButton>
              <TimeText>14:00-18:00</TimeText>
            </Label>
            <Label>
              <TimeButton
                name="deliveryTime"
                checked={orderDetails.deliveryTime === "不指定"}
                onClick={() => handleDeliveryTimeChange("不指定")}
              ></TimeButton>
              <TimeText>不指定</TimeText>
            </Label>
          </Labels>
        </DeliverTimeWrapper>
      </OrderDetailContainer>
      <PaymentDetailContainer>
        <PaymentText>付款資料</PaymentText>
        <PaymentWrapper>
          <DetailText>信用卡號碼</DetailText>
          <DetailInput placeholder="****    ****    ****    ****"></DetailInput>
        </PaymentWrapper>
        <PaymentWrapper>
          <DetailText>有效期限</DetailText>
          <DetailInput placeholder="MM / YY"></DetailInput>
        </PaymentWrapper>
        <PaymentWrapper>
          <DetailText>安全碼</DetailText>
          <DetailInput placeholder="後三碼"></DetailInput>
        </PaymentWrapper>
      </PaymentDetailContainer>
      <PaymentContainer>
        <PaymentItem>
          <PaymentLabel>總金額</PaymentLabel>
          <PaymentValue>
            <NTDSymbol>NT.</NTDSymbol>
            <PriceNum>{totalAmount}</PriceNum>
          </PaymentValue>
        </PaymentItem>
        <PaymentItem>
          <PaymentLabel>運費</PaymentLabel>
          <PaymentValue>
            <NTDSymbol>NT.</NTDSymbol>
            <PriceNum>{shippingFee}</PriceNum>
          </PaymentValue>
        </PaymentItem>
        <Split></Split>
        <PaymentItem>
          <PaymentLabel>應付金額</PaymentLabel>
          <PaymentValue>
            <TotalNTDSymbol>NT.</TotalNTDSymbol>
            <TotalPrice>{totalAmount + shippingFee}</TotalPrice>
          </PaymentValue>
        </PaymentItem>
        <ConfirmButton onClick={handleSubmit}>確認付款</ConfirmButton>
      </PaymentContainer>
      <MobileConfirmButton onClick={handleSubmit}>確認付款</MobileConfirmButton>
    </Container>
  );
};

CheckoutDetail.propTypes = {
  totalAmount: PropTypes.number.isRequired,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 1160px;
  margin: 3px auto 220px auto;
  @media screen and (max-width: 1279px) {
    width: calc(100% - 48px);
    margin: 0 auto 240px auto;
  }
`;

const OrderDetailContainer = styled.div`
  width: 100%;
`;

const OrderText = styled.div`
  margin-top: 51px;
  padding-bottom: 14px;
  font-weight: 700;
  border-bottom: 1px solid #3f3a3a;
`;

const DetailText = styled.span`
  display: flex;
  position: relative;
  top: 8px;
  width: 120px;
  line-height: 19px;
  @media screen and (max-width: 1279px) {
    margin: 10px 0;
  }
`;

const DetailInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 574px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    flex-direction: column;
  }
`;
const InputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 576px;
  @media screen and (max-width: 1279px) {
    max-width: 100%;
  }
`;

const DetailInput = styled.input`
  width: 576px;
  height: 32px;
  border: 1px solid ${(props) => (props.error ? "red" : "#979797")};
  border-radius: 8px;
  padding: 0 0 0 12px;
  &::placeholder {
    display: flex;
    position: relative;
    top: 2px;
    font-size: 16px;
    padding: 8px;
    color: #d3d3d3;
  }
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  margin: 24px 0 10px 0;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const Note = styled.p`
  width: 100%;
  margin: 6px 0 0 0;
  color: #8b572a;
  text-align: right;
  @media screen and (max-width: 1279px) {
    width: auto;
    text-align: left;
  }
`;

const DetailWrapper = styled.div`
  display: flex;
  margin: 28px 0;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const DeliverTimeWrapper = styled.div`
  display: flex;
  position: relative;
  bottom: 2px;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;
const Labels = styled.div`
  display: flex;
  position: relative;
  top: 5px;
  right: 5px;
`;

const Label = styled.div`
  margin-right: 22px;
`;

const TimeButton = styled.input.attrs({ type: "radio" })`
  height: 16px;
  width: 16px;
  margin-right: 8px;
`;

const TimeText = styled.span`
  font-weight: 400;
`;

const PaymentDetailContainer = styled.div``;

const PaymentText = styled.div`
  margin-top: 51px;
  padding-bottom: 15px;
  font-weight: 700;
  border-bottom: 1px solid #3f3a3a;
`;

const PaymentWrapper = styled.div`
  display: flex;
  position: relative;
  margin: 28px 0;
  bottom: 5px;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  left: 1px;
  width: 242px;
  height: 282px;
  margin-left: auto;
`;

const PaymentItem = styled.div`
  display: flex;
  position: relative;
  bottom: 10px;
  justify-content: space-between;
  height: 36px;
  margin-top: 20px;
`;

const PaymentValue = styled.span`
  display: flex;
`;
const PaymentLabel = styled.span`
  display: flex;
  position: relative;
  bottom: 4px;
  align-self: center;
`;
const NTDSymbol = styled.span`
  position: relative;
  bottom: 4px;
  display: flex;
  margin-right: 8px;
  align-items: center;
`;
const TotalNTDSymbol = styled.span`
  position: relative;
  bottom: 4px;
  display: flex;
  margin-right: 4px;
  align-items: center;
`;

const PriceNum = styled.span`
  line-height: 30px;
  font-size: 30px;
`;

const Split = styled.span`
  position: relative;
  top: 4px;
  height: 1px;
  width: 240px;
  margin-bottom: 19px;
  background-color: #3f3a3a;
`;
const ConfirmButton = styled.button`
  position: relative;
  letter-spacing: 4px;
  padding: 3px 0 0 3px;
  height: 64px;
  top: 35px;
  font-size: 20px;
  color: #fff;
  background-color: #000;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1279px) {
    display: none;
  }
`;
const MobileConfirmButton = styled.button`
  display: none;
  height: 44px;
  font-size: 20px;
  color: #fff;
  background-color: #000;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1279px) {
    display: flex;
  }
`;
const TotalPrice = styled.span`
  position: relative;
  right: 0;
  line-height: 30px;
  font-size: 30px;
`;

export default CheckoutDetail;
