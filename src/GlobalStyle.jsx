import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`/* * {
    outline: 1px solid black;
  } */
  
    body {
      position: relative;
      font-family: "Noto Sans TC";
      margin: 0;
      height: auto;
      width: 100%;
    }
    
    /* network problem */
    .offline {
      position: absolute;
      display: flex;
      width: 100%;
      top: 300px;
      justify-content: center;
      z-index: 1;
    }
    .offline__text-wrapper {
      display: flex;
      flex-direction: column;
      background-color: #ffffff88;
      border-radius: 10px;
      width: 500px;
    }
    .offline__text {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
    }
    .offline__text--small {
      margin: 0;
      font-size: 16px;
      font-weight: 300;
      text-align: center;
    }
    .timeout__text {
      display: flex;
      position: absolute;
      justify-content: center;
      width: 100%;
      top: 20px;
      height: 50px;
    }
    
    /* search-result */
    .no-results {
      display: flex;
      flex-direction: column;
      position: absolute;
      text-align: center;
      justify-self: center;
    }
    .no-results__wrapper {
      position: relative;
      bottom: 10px;
    }
    .no-results__title {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }
    .no-results__content {
      font-size: 14px;
      font-weight: 300;
      margin: 0;
    }
    
    /* media query */
    @media screen and (max-width: 1279px) {
      /* network problem */
      .offline {
        position: absolute;
        display: flex;
        width: 100%;
        top: 300px;
        justify-content: center;
        z-index: 1;
      }
      .offline__text-wrapper {
        width: 250px;
      }
      .offline__text {
        font-size: 16px;
      }
      .offline__text--small {
        font-size: 12px;
      }
      .loading {
        top: 195px;
      }
      .timeout__text {
        top: 40px;
      }
      /* mobile header */
    
      .no-results__wrapper {
        position: relative;
        top: 10px;
      }
      /* search__input */
    
      .search_img {
        display: none;
      }
    }
    `
export default GlobalStyle;