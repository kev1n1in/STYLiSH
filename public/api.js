// 載入輪播圖
document.addEventListener("DOMContentLoaded", function () {
  campaignsCarousel();
  initializePage();
  updateCartItemCount();
});
const updateCartItemCount = () => {
  const cartItemCountElements = document.querySelectorAll(".circle");
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = storedCart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  cartItemCountElements.forEach((element) => {
    element.textContent = totalQuantity;
  });
};
// 用來store next paging index
let nextPage = null;
//斷線提醒訊息
let offlineMessage = document.querySelector(".products");
window.addEventListener("offline", () => {
  offlineMessage.innerHTML = `<div class="offline">
    <div class="offline__text-wrapper">
    <p class="offline__text">連線至網際網路</p>
    <p class="offline__text--small">您已離線,請檢查網際網路</p>
    </div>
    </div> `;
});
// timeout function
function setupFetchTimeout(controller) {
  const timeoutId = setTimeout(() => {
    controller.abort();
    const products = document.querySelector(".products");
    products.innerHTML =
      '<p class="timeout__text">連線超時,請確認網路連線狀態</p>';
  }, 3000);

  return timeoutId;
}
// 透過fecth 這支 campaigns API來抓輪播圖
function campaignsCarousel() {
  const url = `https://api.appworks-school.tw/api/1.0/marketing/campaigns`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      preloadImages(result.data);
      displayCarousel(result.data);
    });
}
function preloadImages(campaigns) {
  campaigns.forEach((campaign) => {
    const img = new Image();
    img.src = campaign.picture;
  });
}
function displayCarousel(campaigns) {
  let currentIndex = 0;
  let autoSlide;
  const totalImages = campaigns.length;
  const carouselContainer = document.querySelector(".carousel");
  const dotsContainer = document.querySelector(".carousel__dots");

  carouselContainer.style.backgroundImage = `url(${campaigns[0].picture})`;

  const storyDiv = document.createElement("div");
  storyDiv.className = "story";
  carouselContainer.appendChild(storyDiv);

  campaigns.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "carousel__dot";
    dot.addEventListener("click", () => {
      changeImage(index);
    });
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll(".carousel__dot").forEach((dot, index) => {
      dot.style.backgroundColor =
        index === currentIndex ? "#8B572A" : "#FFFFFF66";
    });
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(updateImage, 3000);
  }

  function changeImage(index) {
    carouselContainer.classList.remove("carousel--active");

    setTimeout(() => {
      currentIndex = index;
      carouselContainer.style.backgroundImage = `url(${campaigns[currentIndex].picture})`;
      updateText(campaigns[currentIndex]);
      carouselContainer.classList.add("carousel--active");
      updateDots();
    }, 500);

    resetAutoSlide();
  }

  function updateText(campaign) {
    storyDiv.innerHTML = "";
    const storyWrapper = document.createElement("h3");
    storyWrapper.className = "story__message story__text";
    storyWrapper.innerHTML = campaign.story.replace(/\r\n/g, "<br/>");

    const storyParagraph = document.createElement("p");
    storyParagraph.className = "story__message story__book";
    storyParagraph.textContent = campaign.story.split("\r\n").pop();

    storyDiv.appendChild(storyWrapper);
    storyDiv.appendChild(storyParagraph);
  }
  carouselContainer.style.backgroundImage = `url(${campaigns[0].picture})`;
  carouselContainer.classList.add("carousel--active");
  updateText(campaigns[0]);
  updateDots();

  function updateImage() {
    carouselContainer.classList.remove("carousel--active");
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % totalImages;
      carouselContainer.style.backgroundImage = `url(${campaigns[currentIndex].picture})`;
      updateText(campaigns[currentIndex]);
      updateDots();

      carouselContainer.classList.add("carousel--active");
    }, 500);
  }

  resetAutoSlide();
}

// 透過fetch 這支 search API來處理搜尋結果
function searchProducts(keyword, updateUrl = true) {
  if (updateUrl) {
    updateURLForSearch(keyword);
  }
  const url = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${encodeURIComponent(
    keyword
  )}`;
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setupFetchTimeout(controller);
  showLoading();

  fetch(url, { signal })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      clearTimeout(timeoutId);
      const productsContainer = document.querySelector(".products");
      productsContainer.innerHTML = "";
      displayProducts(data);
      hideLoading();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
// 透過template string去更改API節點
function fetchData(endpoint, paging = null) {
  let url = `https://api.appworks-school.tw/api/1.0/products/${endpoint}`;
  // 增加next paging判斷式
  if (paging) {
    url += `?paging=${paging}`;
  }

  // 超過3秒的latency就會提醒 並終止fetching
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setupFetchTimeout(controller);

  showLoading();
  fetch(url, { signal })
    .then((response) => response.json())
    .then((data) => {
      clearTimeout(timeoutId);
      displayProducts(data);
      hideLoading();
      nextPage = data.next_paging;
      isLoading = false;
    })
    // 把顯示商品的function單獨抽出來寫成displayProducts

    .catch((error) => {
      console.error("你斷線ㄌ", error);
      isLoading = false; // 錯誤處理，重置標記
    });
}
/**
 * 把原本判斷載入API內容的 eventListener改成這個 有預設的all 也能根據url判斷該fetch哪一個內容
 *
 * @param {string} category - 跳轉到的產品內容
 * @param {string} keyword - 跳轉到的搜尋內容
 *
 */
function getPageStateFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category") || "all"; //如果回傳沒有category 那預設就是all
  const keyword = urlParams.get("q") || null; //如果回傳沒有q 那預設是null
  return { category, keyword };
}
/**
 * 根據網址初始化並重新fetch一次 根據category或是keyword做變動
 *
 * @param {string} category - 跳轉到的產品內容
 * @param {string} keyword - 跳轉到的搜尋內容
 *
 */
function initializePage() {
  const { category, keyword } = getPageStateFromUrl();
  if (keyword) {
    searchProducts(keyword);
  }
  fetchData(category);
}
document.addEventListener("DOMContentLoaded", initializePage);
// desktop search
document.querySelector(".search_img").addEventListener("click", function () {
  const searchInput = document.querySelector(".search__input");
  searchInput.focus();
  triggerSearch();
});

// mobile search
document
  .querySelector(".search__img--hide")
  .addEventListener("click", function () {
    const search = document.querySelector(".search");
    const searchInput = document.querySelector(".search__input");
    if (search.style.display === "none" || !search.style.display) {
      search.style.display = "block";
      searchInput.focus();
      // 使用.focus()就可以引入auto focus
    } else {
      search.style.display = "none";
    }
  });
// enter送出動作偵測
document
  .querySelector(".search__input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      triggerSearch();
    }
  });
// 關鍵字送出
function triggerSearch() {
  const products = document.querySelector(".products");
  const keyword = document.querySelector(".search__input").value;
  if (keyword.trim() === "") {
    products.innerHTML =
      "<div class='no-results'><div class='no-results__wrapper'><p class='no-results__title'>請輸入關鍵字</p></div></div>";
    return;
  }
  searchProducts(keyword);
}
// loading畫面開關
function showLoading() {
  const loading = document.querySelector(".loading");
  loading.style.display = "flex";
}
function hideLoading() {
  const loading = document.querySelector(".loading");
  loading.style.display = "none";
}

// 點擊連結更換網址
function updateUrlForCategory(category) {
  const newUrl = `${window.location.protocol}//${window.location.host}${
    window.location.pathname
  }?category=${encodeURIComponent(category)}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
}
// 搜尋更換網址
function updateURLForSearch(keyword) {
  const newUrl = `${window.location.protocol}//${window.location.host}${
    window.location.pathname
  }?q=${encodeURIComponent(keyword)}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
}

window.addEventListener("popstate", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  const category = urlParams.get("category");

  if (query) {
    fetchData(query);
  } else if (category) {
    fetchData(category);
  } else {
    fetchData("all");
  }
});
// click event 由於做兩套需要抓兩種不同的class

document.getElementById("logo").addEventListener("click", () => {
  updateUrlForCategory("all");
  changeCategory("all");
});
/**
 * click event 分為桌機版跟手機版
 *
 * @param {string} element - DOM element
 * @param {string} category - 跳轉到的產品內容
 *
 */
function addClickListener(element, category) {
  element.addEventListener("click", (event) => {
    event.preventDefault(); // 防止默認的點擊行為 才不會點一次就重整一次
    updateUrlForCategory(category);
    changeCategory(category);
    // setPage(category);
  });
}

/**
 * 根據click event fetch different content
 *
 * @param {string} selector - CSS selector
 * @param {string} category - 跳轉到的產品內容
 *
 */
function setupCategory(selector, category) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    addClickListener(element, category);
  });
}

setupCategory(".women, .women--mobile", "women");
setupCategory(".men, .men--mobile", "men");
setupCategory(".accessories, .accessories--mobile", "accessories");

// 判斷現有分類
let currentCategory = "all";
function changeCategory(newCategory) {
  //  判斷是否和當前頁面一樣 一樣則不動作
  if (currentCategory === newCategory) {
    return;
  }
  currentCategory = newCategory;
  nextPage = null;
  isLoading = false;
  const productsContainer = document.querySelector(".products");
  productsContainer.innerHTML = "";
  updateUrlForCategory(currentCategory);
  fetchData(currentCategory);
}

// sroll 的eventListener
let isLoading = false; // 加入一個變量來控制載入狀況

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (nextPage && !isLoading) {
      isLoading = true; // 標記正在加載
      fetchData(currentCategory, nextPage); // 使用下一頁抓更多數據
    }
  }
});
// 展示商品結果
function displayProducts(result) {
  const productsContainer = document.querySelector(".products");

  if (result.data.length === 0) {
    productsContainer.innerHTML =
      "<div class='no-results'><div class='no-results__wrapper'><p class='no-results__title'>找不到结果</p><p class='no-results__content'>請嘗試不同或是更常見的關鍵字</p></div></div>";
  } else {
    const imagePromises = result.data.map((product) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = product.main_image;
        img.className = "product__img";
      });
    });

    Promise.all(imagePromises).then((images) => {
      result.data.forEach((product, index) => {
        const productElement = document.createElement("div");
        productElement.className = "product";
        productElement.appendChild(images[index]);
        addProductDetails(product, productElement);
        productsContainer.appendChild(productElement);

        const productLink = document.createElement("a");
        productLink.className = "product__link";
        productLink.href = `/product?id=${product.id}`;
        productLink.appendChild(productElement);

        productsContainer.appendChild(productLink);
      });
    });
  }
}

function addProductDetails(product, productElement) {
  const productVariants = document.createElement("ul");
  productVariants.className = "products__variants";
  product.colors.forEach((color) => {
    const productColor = document.createElement("li");
    productColor.className = "products__color";
    productColor.style.backgroundColor = `#${color.code}`;
    productVariants.appendChild(productColor);
  });

  const productTitle = document.createElement("p");
  productTitle.className = "product--spacing product__title";
  productTitle.textContent = product.title;

  const productPrice = document.createElement("p");
  productPrice.className = "product--spacing product__price";
  productPrice.textContent = `TWD.${product.price}`;

  // Append other details
  productElement.appendChild(productVariants);
  productElement.appendChild(productTitle);
  productElement.appendChild(productPrice);
}
