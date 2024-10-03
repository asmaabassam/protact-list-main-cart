
let shop = document.getElementById("shop");
let cart = document.getElementById("cart");
let cartItemCount = document.getElementById("cart-item-count");
let orderTotal = document.getElementById("order-total");
let overlay = document.getElementById("overlay");
let modal = document.getElementById("modal");
let confirmOrderButton = document.getElementById("confirm-order");
let newOrderButton = document.getElementById("new-order-button");
// let orderConfirmationItems = document.getElementById("modal-items");

let orderConfirmationItems = document.getElementById("modal-list");
let orderConfirmationPrice = document.getElementById("modal-price");

let basket = [];

let shopItemsData = [];

const cartEmptyMessage = document.querySelector('.your-cart__empty-cart');
const orderDetailsContainer = document.querySelector('.your-cart__order-details-container');

confirmOrderButton.addEventListener("click", addOverlay);
newOrderButton.addEventListener("click", removeOverlay);

function fetchMenuData() {
  // Fetch the data from the JSON file
  fetch('/data.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          shopItemsData = data;
          // Once the data is fetched, populate the shop
          generateShop();
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
}

function generateShop() {
  return (shop.innerHTML = shopItemsData
    .map((x) => {
      let { image, name, category, price } = x;
      return `
        <div data-id="${replaceSpacesWithHyphens(name)}" class="menu-grid__grid-item">
            <div class="grid-item__img-container">
              <picture class="grid-item__img">
                <source class="mobile" media="(max-width: 720px)" srcset="${image.mobile}">
                <source class="tablet" media="(min-width: 721px) and (max-width: 1199px)" srcset="${image.tablet}">
                <img class="desktop" src="${image.desktop}">
              </picture>
              <button onclick="addToBasket(this, '${name}')" class="grid-item__add-to-cart button button--add-to-cart">
                <img src="./assets/images/icon-add-to-cart.svg" alt="">
                <span class="fw-600 fc-900 ml-10">Add to Cart</span>
              </button>
              <div class="grid-item__add-to-cart button--plus-minus-cart hidden">
                <button onclick="decrement('${name}')" class="button button--decrement">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
                </button>
                <span class="button--plus-minus-cart-quantity"></span>
                <button onclick="increment('${name}')" class="button button--increment">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                </button>
              </div>
            </div>
            <div class="grid-item__content">
              <p class="grid-item__subtitle">${category}</p>
              <h3 class="grid-item__heading">${name}</h3>
              <p class="grid-item__price">$${price.toFixed(2)}</p>
            </div>
          </div>`;
    }).join(""));
}

function generateCart() {
  if (basket.length !== 0) {
    orderTotal.innerText = "$" + calculateBasketTotal().toFixed(2);
  }
  cartItemCount.innerText = calculateItemCount();
  return(cart.innerHTML = basket
    .map((x) => {
      let itemData = shopItemsData.find((y) => y.name === x.id);
      let costTotal = (x.item * itemData.price).toFixed(2);
      
      return `
        <div class="your-cart__cart-item">
          <div class="cart-item__container">
            <div class="cart-item__left-col">
              <p class="cart-item__name">${x.id}</p>
              <div>
                <span class="cart-item__quantity">${x.item}x</span>
                <span class="cart-item__cost-per"><span>@ $${itemData.price.toFixed(2)} </span></span>
                <span class="cart-item__cost-total">$${costTotal}</span>
              </div>
            </div>
            <div class="cart-item__right-col">
              <button onclick="removeFromBasket('${x.id}')" class="button button--remove-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
              </button>
            </div>
          </div>
          <div class="cart-item__line-break"></div>
        </div>`;
    }).join(""));
}

function generateConfirmOrder() {
  let itemsHTML = basket
    .map((x) => {
      let itemData = shopItemsData.find((y) => y.name === x.id);
      let costTotal = (x.item * itemData.price).toFixed(2);
    
      return `
        <div class="modal__item-container">
          <div class="modal__left-col">
            <img src="${itemData.image.thumbnail}">
            <div class="modal__details-container">
              <p>${x.id}</p>
              <div class="modal__price-container">
                <span class="cart-item__quantity">${x.item}x</span>
                <span class="cart-item__cost-per">@ $${itemData.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div class="modal__right-col">
            <span class="cart-item__cost-total">$${costTotal}</span>
          </div>
        </div>
        <div class="cart-item__line-break"></div>
      `;
    }).join("");

  let totalHTML = `<div class="modal__total-container">
                    <span class="fc-900">Order Total</span><span class="fs-500 fw-700">$${calculateBasketTotal().toFixed(2)}</span>
                  </div>`;

  orderConfirmationItems.innerHTML = itemsHTML;
  orderConfirmationPrice.innerHTML = totalHTML;
}

function addToBasket(addToBasketButton, itemName) {
  const gridItem = addToBasketButton.closest('.grid-item__img-container');
  const plusMinusCartDiv = gridItem.querySelector('.button--plus-minus-cart');
  

  addToBasketButton.classList.add('hidden');
  plusMinusCartDiv.classList.remove('hidden');
  gridItem.classList.add('red-border');

  increment(itemName);
  isCartEmpty();
}

function removeFromBasket(itemName) {
  
  let search = basket.find((x) => x.id === itemName);

  if( search.item !== 0) {
    search.item = 0;
  }
  
  basket = basket.filter((x) => x.item !== 0);

  let gridItem = document.querySelector(`[data-id=${replaceSpacesWithHyphens(itemName)}]`);
  let addToBasketButton = gridItem.querySelector('.button--add-to-cart');
  let plusMinusCartDiv = gridItem.querySelector('.button--plus-minus-cart');
  let gridItemImgContainer = gridItem.querySelector('.grid-item__img-container');

  addToBasketButton.classList.remove('hidden');
  plusMinusCartDiv.classList.add('hidden');
  gridItemImgContainer.classList.remove('red-border');

  generateCart();
  isCartEmpty();
}

function increment(itemName) {
  let search = basket.find((x) => x.id === itemName);

  if (search === undefined) {
    basket.push({
      id: itemName,
      item: 1,
    });
  } else {
    search.item += 1;
  }
  update(itemName);
}

function decrement(itemName) {
  let search = basket.find((x) => x.id === itemName);

  if (search === undefined) {
    return;
  } 
  else {
    search.item -= 1;
    if (search.item === 0) {
      removeFromBasket(itemName);
      return;
    }
  }
  update(itemName);
}

function update(itemName) {
  let search = basket.find((x) => x.id === itemName);
  let gridItem = document.querySelector(`[data-id=${replaceSpacesWithHyphens(itemName)}]`);
  let price = gridItem.querySelector('.button--plus-minus-cart-quantity');
  price.innerHTML = search.item;
  generateCart();
}

function isCartEmpty() {
  if(basket.length === 0) {
    cartEmptyMessage.classList.remove('hidden');
    orderDetailsContainer.classList.add('hidden');
  } else {
    cartEmptyMessage.classList.add('hidden');
    orderDetailsContainer.classList.remove('hidden');
  }
}

function calculateItemCount() {
  let totalItems = basket.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.item;
  }, 0);
  return totalItems;
}

function calculateBasketTotal() {
  if (basket.length !== 0) {
    let totalValue = basket.map((x) => {
      let search = shopItemsData.find((y) => y.name === x.id) || [];
      return x.item * search.price;
    }).reduce((x,y) => x + y, 0);
    return totalValue;
  } 
}

function replaceSpacesWithHyphens(str) {
  return str.replace(/\s+/g, '-');
}

function addOverlay() {
  generateConfirmOrder();
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
  document.body.classList.add('no-scroll');
}

function removeOverlay() {
  resetBasket();
  overlay.classList.add("hidden");
  modal.classList.add("hidden");
  document.body.classList.remove('no-scroll');
}

function resetBasket() {
  basket.forEach(function(basketItem) {
    removeFromBasket(basketItem.id);
  });
}

document.addEventListener('DOMContentLoaded', fetchMenuData);
