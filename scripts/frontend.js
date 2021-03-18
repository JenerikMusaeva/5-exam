import { getSweets } from "./helper.js";

let $sweets = document.querySelector("#sweets");
let $cart = document.querySelector("#cart");
let $cartItemsDiv = document.querySelector(".cart-items");
let $menu = document.querySelector("#menu");

//открытие меню
let $openMenuBtn = document.querySelector(".menu-icon");
$openMenuBtn.addEventListener("click", () => {
  $menu.style.left = "0";
});

// //закрытие меню
let $closeMenuBtn = document.querySelector(".menu-close-icon");
$closeMenuBtn.addEventListener("click", () => {
  $menu.style.left = "-316px";
});

//открытие корзины
let $openCartBtn = document.querySelector(".header__cart");
$openCartBtn.addEventListener("click", () => {
  $cart.style.right = "0";
});

//закрытие корзины
let $closeCartBtn = document.querySelector(".close-icon");
$closeCartBtn.addEventListener("click", () => {
  $cart.style.right = "-316px";
});

//удаление с корзины
const removeFromCart = (id) => {
  cart = cart.filter((item) => {
    return item.id == id ? false : true;
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

// отображение содержимого корзины
const renderCart = () => {
  $cartItemsDiv.innerHTML = "";
  cart.forEach(({ id, name, cost, quantity }) => {
    let $cartDiv = document.createElement("div");
    $cartDiv.className = "cart__item row";
    $cartDiv.innerHTML = `
      <div class="name__item col-7">
        <p>${name} ($${cost})</p>
        <p>${quantity} items</p>
      </div>
      <div class="col-3">
        $${(cost * quantity).toFixed(2)}
      </div>
      <div class="col-2 cart__remove">
      </div>
    `;

    //удаление с корзины
    let $removeFromCartBtn = document.createElement("i");
    $removeFromCartBtn.setAttribute("type", "button");
    $removeFromCartBtn.setAttribute("class", "delete-icon");
    $removeFromCartBtn.addEventListener("click", () => {
      removeFromCart(id);
    });

    $cartDiv.querySelector(".cart__remove").append($removeFromCartBtn);
    $cartItemsDiv.append($cartDiv);
  });

  //Total Price
  let totalPrice = cart.reduce((acc, item) => {
    return acc + item.cost * item.quantity;
  }, 0);
  $cartItemsDiv.insertAdjacentHTML(
    "beforeend",
    `
    <hr>
    <div class="cart__item row">
    <div class="col-8">
    <p>Total:</p>
    </div>
    <div class="col-4">
    <p>$${totalPrice.toFixed(2)}</p>
    </div>
    `
  );

  //Items Quantity
  let itemsQuantity = cart.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  const $cartItemsQuantity = document.querySelector(".items__quantity");
  $cartItemsQuantity.innerHTML = `${itemsQuantity}`;
};

// local store для корзины
let cart = JSON.parse(localStorage.getItem("cart")) || [];
if (cart.length) {
  renderCart();
}

// добавление в корзину
const addToCart = (sweet) => {
  let isFound = false;
  cart = cart.map((item) => {
    if (item.id == sweet.id) {
      item.quantity++;
      isFound = true;
    }
    return item;
  });
  if (!isFound) {
    cart.push({ ...sweet, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

// отображение сладостей
const renderSweetElement = (sweet) => {
  let $html = document.createElement("div");
  $html.classList.add("sweet");
  // $html.classList.add("col-md-4");

  $html.innerHTML = `
  <div class="sweet__img"></div>
  <h3>${sweet.name}</h3>
  <p class="sweet__ingredients">${sweet.ingredients.join(", ")}</p>
  <p class="sweet__price">$${sweet.cost}</p>
  `;

  let $addToCartBtn = document.createElement("button");
  $addToCartBtn.classList.add("sweet__btn_add");
  if (sweet.inStock == 0) {
    $addToCartBtn.setAttribute("disabled", "disabled");
  }

  $addToCartBtn.textContent =
    sweet.inStock == 0 ? "Not Available" : "Add to cart";

  $addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(sweet);
  });

  // создание изображения и добавление класса изображениям
  let $img = document.createElement("img");
  $img.setAttribute("src", `${sweet.image}`);
  let width = $img.width;
  let height = $img.height;
  const imageClass = width < height ? "img_vertical" : "img_horizont";
  $img.classList.add(imageClass);

  $html.querySelector(".sweet__img").append($img);

  $html.append($addToCartBtn);

  return $html;
};

const renderSweets = (sweets) => {
  sweets.forEach((sweet) => {
    let $sweetDiv = renderSweetElement(sweet);
    $sweets.append($sweetDiv);
  });
};
let sweets = await getSweets();

renderSweets(sweets);
