function addCart(product) {
  let name = `${product.name}`;
  let item_id = `${product.id}`;

  let cart = getCookie("cart");
  if (cart) {
    cart = JSON.parse(cart); // JSON to js
    if (item_id in cart) {
      cart[item_id] += 1;
    } else {
      cart[item_id] = 1;
    }
  } else {
    cart = {};
    cart[item_id] = 1;
  }
  console.log(cart);

  setCookie("cart", JSON.stringify(cart), 7 * 24 * 60 * 60);
}

function setCookie(name, value, maxAge) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; max-age=${maxAge}`;
}
function getCookie(name) {
  let cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === decodeURIComponent(name)) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

function getProductCard(product) {
  let div = document.createElement("div");
  div.classList.add("product-card");
  div.innerHTML = `
    <img src="${product.image}" alt="" />
    <h3>${product.title}</h3>
    <p class='product-description'>${product.description}</p>
    <p class="price">Ціна: $ ${product.price}</p>
    <p class='id'>${product.id}</p>`;
  let addToCart = document.createElement("button");
  addToCart.classList.add("add-to-cart-btn");
  let icon = document.createElement("i");
  icon.classList.add("ti", "ti-shopping-cart");
  addToCart.appendChild(icon);
  div.appendChild(addToCart);
  let elementId = document.querySelector(".id");
  addToCart.addEventListener("click", () => addCart(product));
  return div;
}

const productList = document.querySelector(".product-list");
const categoryButtons = document.querySelector(".category-buttons");

async function fetchData() {
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  let url;
  if (category) {
    url = `https://fakestoreapi.com/products/category/${category}`;
  } else {
    url = "https://fakestoreapi.com/products";
  }
  const response = await fetch(url);
  const products = await response.json();
  products.forEach((product) => {
    let card = getProductCard(product);
    card.addEventListener("mouseenter", function () {
      card.querySelector(".product-description").classList.add("hovered");
    });
    card.addEventListener("mouseleave", function () {
      card.querySelector(".product-description").classList.remove("hovered");
    });
    productList.appendChild(card);
  });
}

async function fetchCategory() {
  const response = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await response.json();
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.innerText = category;
    button.addEventListener("click", () => {
      location.search = `?category=${category}`;
    });
    categoryButtons.appendChild(button);
  });
}

fetchData();
fetchCategory();
