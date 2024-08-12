import styled from "styled-components";
const FooterWrapper = styled.footer`  
  width: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  background-color: #313538;
  justify-content: space-between;
  align-items: center;
@media screen and (max-width: 1279px) {
  height:auto
}`;

const FooterDesktop = styled.div`
  width: 100%;
  margin: 30px 0;
  display: flex;
  position: relative;
  justify-content: center;
  top: 1px;
  right: -13px;
  @media screen and (max-width: 1279px) {
    display: none;
  }`;

const Links = styled.ul`  
  display: flex;
  position: relative;
  width: 670px;
  align-items: center;
  list-style: none;
  color: #f5f5f5;`;

const LinkItem = styled.li`
  width: 134px;
  font-size: 16px;
  text-align: center;
  @media screen and (max-width: 1279px) {
    padding-bottom: 8px;
    font-size: 14px;
    text-align: left;
}`;

const LinksGap = styled.div`
  width: 134px;`;

const IconsRights = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  top: 3px;
  right: 49px;`;

const Icons = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  align-items: center;
  right: 15px;
  bottom: 2px;
  @media screen and (max-width: 1279px) {
    height: 20px;
}`;

const IconImage = styled.img`
 height: 48px;
  width: 48px;
  padding-left: 32px;
  @media screen and (max-width: 1279px) {
    width: 20px;
    height: 20px;
    justify-self: center;
}`;

const IconsGap = styled.div`
  width: 30px;`;

const Rights = styled.div`
  display: flex;
  position: relative;
  text-align: left;
  color: #828282;
  font-size: 12px;
  line-height: 17.38px;
  right: 16px;
`

const BorderGray = styled.div`
  position: relative;
  top: 0;
  right: 2px;
  height: 16px;
  width: 1px;
  background-color: #828282`;


  const Footer = () =>{
    return(    
      <FooterWrapper>
      <FooterDesktop>
        <Links>
          <LinkItem>關於 STYLiSH</LinkItem>
          <BorderGray/>
          <LinkItem>服務條款</LinkItem>
          <BorderGray/>
          <LinkItem>隱私政策</LinkItem>
          <BorderGray/>
          <LinkItem>聯絡我們</LinkItem>
          <BorderGray/>
          <LinkItem>FAQ</LinkItem>
        </Links>
        <LinksGap></LinksGap>
        <IconsRights>
          <Icons>
            <IconImage src="images/line.png" alt="line" />
            <IconImage
              src="images/twitter.png"
              alt="twitter"
            />
            <IconImage
              src="images/facebook.png"
              alt="facebook"
            />
          </Icons>
          <IconsGap></IconsGap>
          <Rights>
            <p>© 2018. All rights reserved.</p>
          </Rights>
        </IconsRights>
      </FooterDesktop>
    </FooterWrapper>)
}
export default Footer;