const items = [
  {
    name: 'Waffle',
    description: 'Waffle with Berries',
    img: 'assets/images/image-waffle-desktop.jpg',
    price: '6.50',
  },
  {
    name: 'Crème Brûlée ',
    description: 'Vanilla Bean Crème Brûlée',
    img: 'assets/images/image-creme-brulee-desktop.jpg',
    price: '7.00',
  },
  {
    name: 'Macaron',
    description: 'Macaron Mix of Five',
    img: 'assets/images/image-macaron-desktop.jpg',
    price: '6.50',
  },
  {
    name: 'Tiramisu',
    description: 'Classic Tiramisu',
    img: 'assets/images/image-tiramisu-desktop.jpg',
    price: '6.50',
  },
  {
    name: 'Baklava',
    description: 'Pistachio Baklava',
    img: 'assets/images/image-baklava-desktop.jpg',
    price: '6.50',
  },
  {
    name: 'Pie',
    description: 'Lemon Meringue Pie',
    img: 'assets/images/image-meringue-desktop.jpg',
    price: '6.50',
  },
  {
    name: 'Cake',
    description: 'Red Velvet Cake',
    img: 'assets/images/image-cake-desktop.jpg',
    price: '6.50',
  },
  {
    name: 'Brownie',
    description: 'Salted Caramel Brownie ',
    img: 'assets/images/image-brownie-desktop.jpg',
    price: '6.50',
  },
  {
    name: 'Panna Cotta',
    description: 'Vanilla Panna Cotta ',
    img: 'assets/images/image-panna-cotta-desktop.jpg',
    price: '6.50',
  },
];

const itemsHTML = items
  .map(
    (item, idx) =>
      `<div class="dessertDiv"> 
        <div class="imageStyle">
          <img src="${item.img}" alt="${item.name}" class="imageStyle"/>
          <button class="addToCart gadd" data-index="${idx}"> 
            <div class="innerbtndiv">
              <img src="assets/images/icon-add-to-cart.svg"/> 
              <p class="addP">Add to cart</p>
            </div>
          </button>
        </div>
        <div class="label">
          <p class="category">${item.name}</p>
          <p class="descript">${item.description}</p>
          <p class="price">$${item.price}</p>
        </div>
      </div>`
  )
  .join('');

const order = [];
document.querySelector('.items').innerHTML = itemsHTML;
const totalQuantityDisplay = document.querySelector('.totalQuantity');

function calculateTotalQuantity() {
  const totalQuantity = order.reduce((sum, item) => sum + item.quantity, 0);
  totalQuantityDisplay.textContent = `${totalQuantity}`;
}

function updateOrderHTML() {
  if (order.length > 0) {
    const orderHTML = order
      .map(
        (item, idx) => `
      <div class="cartItem">
        <div class="first">
          <p class="itemName">${item.name}</p>
          <div class="amountPrice">
            <span class="amount">${item.quantity}x </span>
            <span class="pricePerOne">@$${
              item.price
            } <span class="totalAmount">$${(
          parseFloat(item.price) * item.quantity
        ).toFixed(2)}</span></span>
          </div>
        </div>
          <div class="remove">
    <img src="assets/images/icon-remove-item.svg" class="decrement" data-index="${
      order.length
    }" />
  </div>
      </div>
    `
      )
      .join('');
    const fullHTML = `
  ${orderHTML} 
  <div class="footer-cart">
    <div class="final-total">
      <p >Order Total</p>
      <p class="total">$${order.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )}</p>
    </div>
    <div class="carbon">
      <img src="assets/images/icon-carbon-neutral.svg" alt="" />
      <p class="carbon-text">This is a <span>carbon-neutral</span> delivery</p>
    </div>
    <button class="confirm-order">
    <p> Confirm Order</p></button>
  </div>

`;
    const modal = document.getElementById('myModal');
    document.querySelector('.orders').innerHTML = fullHTML;
    const confirmButton = document.querySelector('.confirm-order');
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        openModal();
      });
    }

    // function openModal() {}
    function openModal() {
      modal.style.display = 'block';
      document.querySelector('.modal-content').innerHTML = `
           <div class="OrderDiv">
        <img height="40px" src="assets/images/icon-order-confirmed.svg" />
        <h2 class="orderHTwo">Order Confirmed</h2>
        <p class="orderP">We hope you enjoy your food</p>
        <div class="orderConfirmed">${order.map(
          (item, idx) => `
      <div class="orderItem">
      <div class="imgDiv"><img height="50px" src="${
        item.img
      }"/><div class="second">
          <p class="itemName">${item.name}</p>
          <div class="amountPrice">
            <span class="amount">${item.quantity}x </span>
            <span class="pricePerOne">@$${item.price} </span>
          </div>
        </div></div>
      
        
          <span class="OrdertotalAmount">$${(
            parseFloat(item.price) * item.quantity
          ).toFixed(2)}</span>
      </div>
    `
        )}   <div class="totalTotal">
      <p class="tol">Order Total</p>
      <p class="total">$${order.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )}</p>
    </div></div>
 <button class="new-order">
    <p> Start New Order</p></button>
      
      `;

      document.querySelector('.new-order').addEventListener('click', () => {
        order.length = 0;
        updateOrderHTML();
        calculateTotalQuantity();
        resetAllButtons();
        modal.style.display = 'none';
      });
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
    }

    document.querySelectorAll('.remove').forEach((button) => {
      button.addEventListener('click', handleRemoveItem);
    });
  } else {
    document.querySelector('.orders').innerHTML = `   <img
            src="assets/images/illustration-empty-cart.svg"
            alt=" empty cart"
          />
          <p class="emptyText">Your added items will appear here</p>`;
  }
}

function resetAllButtons() {
  document.querySelectorAll('.addToCart, .counter').forEach((button, idx) => {
    button.className = 'addToCart gadd';
    button.innerHTML = `
      <div class="innerbtndiv">
        <img src="assets/images/icon-add-to-cart.svg"/> 
        <p class="addP">Add to cart</p>
      </div>`;
  });
}

function handleRemoveItem(event) {
  const idx = parseInt(event.target.dataset.index);
  removeItemFromOrder(idx);
}

function removeItemFromOrder(idx) {
  if (idx >= 0 && idx < order.length) {
    const removedItem = order[idx];
    order.splice(idx, 1);

    const itemIndex = items.findIndex((item) => item.name === removedItem.name);
    if (itemIndex !== -1) {
      resetButton(itemIndex);
    }

    calculateTotalQuantity();
    updateOrderHTML();
  }
}

function updateQuantity(idx, change) {
  const itemIndex = order.findIndex((item) => item.name === items[idx].name);
  if (itemIndex !== -1) {
    order[itemIndex].quantity += change;
    if (order[itemIndex].quantity <= 0) {
      order.splice(itemIndex, 1);
      resetButton(idx);
    } else {
      updateButtonContent(idx);
    }
  }
  calculateTotalQuantity();
  updateOrderHTML();
}

function resetButton(idx) {
  const button = document.querySelectorAll('.addToCart, .counter')[idx];
  button.className = 'addToCart gadd';
  button.innerHTML = `
    <div class="innerbtndiv">
      <img src="assets/images/icon-add-to-cart.svg"/> 
      <p class="addP">Add to cart</p>
    </div>`;
}

function updateButtonContent(idx) {
  const button = document.querySelectorAll('.addToCart, .counter')[idx];
  const item = order.find((item) => item.name === items[idx].name);
  button.className = 'counter gadd';
  button.innerHTML = `
    
      <div class="circleAdd decrement">
        <img src="assets/images/icon-decrement-quantity.svg" data-index="${idx}"/>
      </div>
      <span class="quantity">${item.quantity}</span>
      <div class="circleAdd increment">
        <img src="assets/images/icon-increment-quantity.svg" data-index="${idx}"/>
      </div>
  `;

  const decrementButton = button.querySelector('.decrement');
  const incrementButton = button.querySelector('.increment');
  decrementButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateQuantity(idx, -1);
  });
  incrementButton.addEventListener('click', (e) => {
    e.stopPropagation();
    updateQuantity(idx, 1);
  });
}

document.querySelector('.items').addEventListener('click', (event) => {
  const button = event.target.closest('.addToCart, .counter');
  if (button) {
    const idx = parseInt(button.dataset.index);
    const item = items[idx];
    const existingItem = order.find((i) => i.name === item.name);

    if (!existingItem) {
      order.push({ ...item, quantity: 1 });
      updateButtonContent(idx);
    } else {
      updateQuantity(idx, 1);
    }

    calculateTotalQuantity();
    updateOrderHTML();
  }
});

calculateTotalQuantity();
updateOrderHTML();