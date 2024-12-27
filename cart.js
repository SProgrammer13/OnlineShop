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

async function getProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();
  return products;
}
let cartBlock = document.querySelector(".cart-list");
let orderBlock = document.querySelector(".order");

function getCard(cartList) {
  cartList.forEach((product) => {
    let div = document.createElement("div");
    div.classList.add("cart-card");
    div.innerHTML = `
    <img src="${product.image}" alt="" />
    <h3>${product.title}</h3>
    <p class='quantity'>Кількість: ${product.quantity}</p>
    <p class="price">Ціна: $ ${product.price}</p>`;

    cartBlock.appendChild(div);
  });
}

async function loadCart() {
  let cart = getCookie("cart");
  if (cart) {
    cart = JSON.parse(cart); // JSON to js
    let productsData = await getProducts();
    let cartList = [];
    productsData.forEach((product) => {
      if (product["id"] in cart) {
        product["quantity"] = cart[product["id"]];
        cartList.push(product);
        orderBlock.style.display = "block";
      }
    });
    getCard(cartList);
  } else {
    cartBlock.textContent = "У кошику немає товарів!";
    orderBlock.style.display = "none";
  }
}

loadCart();
