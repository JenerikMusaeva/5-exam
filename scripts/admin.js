import { getSweets, updateSweet, deleteSweet, postSweet } from "./helper.js";

let $sweets = document.querySelector("#sweets");
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

// уменьшение кол-ва сладостей
const decreaseStock = async (id, currentStock) => {
  await updateSweet(id, {
    inStock: currentStock - 1,
  });
  renderSweets();
};

// увеличения кол-ва сладостей
const increaseStock = async (id, currentStock) => {
  await updateSweet(id, {
    inStock: currentStock + 1,
  });
  renderSweets();
};

// отображение сладостей
const renderSweetElement = (sweet) => {
  let $html = document.createElement("div");
  $html.classList.add("sweet");
  $html.classList.add("row");

  $html.innerHTML = `
  <div class="sweetname-field col-md-4">
    <h3>${sweet.name}</h3>
    <i type='button' class='edit-name edit-icon'></i>
    <form>
      <input type='text' name='sweetname' class='sweetname form-control' />
      <i type='button' class='update-name done-icon'></i>
    </form>
  </div>

  <div class="sweetcost-field col-md-3">
    <h3>price: $ <span>${sweet.cost}</span></h3>
    <i type='button' class='edit-cost edit-icon'></i>
    <form>
      <input type='text' name='sweetcost' class='sweetcost form-control' />
      <i type='button' class='update-cost done-icon'></i>
    </form>
  </div>

  <div class="instock col-md-4">
    in stock: 
    <span class="decrease"></span>
      ${sweet.inStock}
    <span class="increase"></span>
  </div>
  <div class="col-md-1 remove">
  </div>
  `;

  // кнопка вызов поля редактирования НАЗВАНИЯ сладости
  let $editNameBtn = $html.querySelector(".edit-name");
  $editNameBtn.addEventListener("click", (e) => {
    $html.querySelector(".sweetname").value = $html.querySelector(
      "h3"
    ).innerText;
    const field = $html.querySelector(".sweetname-field");
    field.classList.add("editing");
  });

  // кнопка подтверждение редактирования НАЗВАНИЯ сладости
  let $doneNameBtn = $html.querySelector(".update-name");
  $doneNameBtn.addEventListener("click", (e) => {
    let _newSweetName = $html.querySelector(".sweetname").value;
    updateSweet(sweet.id, {
      name: _newSweetName,
    }).then((res) => {
      field.classList.remove("editing");
    });
  });

  // кнопка вызов поля редактирования ЦЕНЫ сладости
  let $editCostBtn = $html.querySelector(".edit-cost");
  $editCostBtn.addEventListener("click", (e) => {
    $html.querySelector(".sweetcost").value = $html.querySelector(
      "span"
    ).innerText;
    const field = $html.querySelector(".sweetcost-field");
    field.classList.add("editing");
  });

  // кнопка подтверждение редактирования ЦЕНЫ сладости
  let $doneCostBtn = $html.querySelector(".update-cost");
  $doneCostBtn.addEventListener("click", (e) => {
    let _newSweetCost = $html.querySelector(".sweetcost").value;
    updateSweet(sweet.id, {
      cost: Number(_newSweetCost),
    }).then((res) => {
      field.classList.remove("editing");
    });
  });

  // кнопка уменьшения КОЛИЧЕСТВА сладости
  let $decreaseBtn = document.createElement("i");
  $decreaseBtn.setAttribute("type", "button");
  $decreaseBtn.setAttribute("class", "icon-decrease");
  $decreaseBtn.addEventListener("click", () => {
    decreaseStock(sweet.id, sweet.inStock);
  });
  $html.querySelector(".decrease").append($decreaseBtn);

  // кнопка увеличения КОЛИЧЕСТВА сладости
  let $increaseBtn = document.createElement("i");
  $increaseBtn.setAttribute("type", "button");
  $increaseBtn.setAttribute("class", "icon-increase");
  $increaseBtn.addEventListener("click", () => {
    increaseStock(sweet.id, sweet.inStock);
  });
  $html.querySelector(".increase").append($increaseBtn);

  // кнопка удаление сладости
  let $deleteBtn = document.createElement("i");
  $deleteBtn.setAttribute("type", "button");
  $deleteBtn.setAttribute("class", "delete-icon");
  $deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteSweet(sweet.id);
  });
  $html.querySelector(".remove").append($deleteBtn);

  return $html;
};

const renderSweets = async () => {
  $sweets.innerHTML = "";
  let sweets = await getSweets();

  sweets.forEach((sweet) => {
    let $sweetDiv = renderSweetElement(sweet);

    $sweets.append($sweetDiv);
  });
};

//add sweet
let $addSweetForm = document.querySelector("#add-sweet-form");
$addSweetForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  let sweetName = $addSweetForm.querySelector('[name="sweetname"]').value;
  let sweetImage = $addSweetForm.querySelector('[name="sweet_image"]').value;
  let sweetInStock = $addSweetForm.querySelector('[name="instock"]').value;
  let sweetIngredients = $addSweetForm.querySelector(
    '[name="sweet_ingredients"]'
  ).value;
  let sweetCost = $addSweetForm.querySelector('[name="sweet_cost"]').value;

  //получение правильного массива ингридиентов
  let ingredients = sweetIngredients
    .replace(/,/g, " ")
    .split(" ")
    .filter((ingredient) => ingredient);

  let newSweet = {
    name: sweetName,
    image: sweetImage,
    ingredients,
    inStock: Number(sweetInStock),
    cost: Number(sweetCost),
  };
  let result = await postSweet(newSweet);
});

renderSweets();
