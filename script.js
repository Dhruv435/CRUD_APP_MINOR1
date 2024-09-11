function addToCart(
  productId,
  productName,
  productPrice,
  productDescription,
  productImage
) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    id: productId,
    name: productName,
    price: productPrice,
    description: productDescription,
    image: productImage,
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${productName} added to the cart successfully!`);
}

function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBody = document.getElementById("cartBody");

  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartBody.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
  } else {
    cart.forEach((item, index) => {
      cartBody.innerHTML += `
        <tr>
          <td><input type="checkbox" name="selectedProducts" value="${index}" onchange="updateTotalPrice()"></td>
          <td><img src="${item.image}" alt="${
        item.name
      }" width="50" style="border: 2px solid black; border-radius: 5px; padding: 5px;"></td>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td><button type="button" onclick="removeFromCart(${index})">Remove</button></td>
        </tr>
      `;
    });
  }
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  displayCart();

  alert("Product removed successfully!");
}

function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedIndexes = Array.from(
    document.querySelectorAll('input[name="selectedProducts"]:checked')
  ).map((input) => parseInt(input.value));

  const selectedProducts = selectedIndexes.map((index) => cart[index]);

  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));

  window.location.href = "checkout.html";
}

function displaySelectedProducts() {
  const selectedProducts =
    JSON.parse(localStorage.getItem("selectedProducts")) || [];
  const checkoutBody = document.getElementById("checkoutBody");
  const totalPriceElem = document.getElementById("totalPrice");

  checkoutBody.innerHTML = "";
  let totalPrice = 0;

  selectedProducts.forEach((item) => {
    checkoutBody.innerHTML += `
      <tr>
        <td><img src="${item.image}" alt="${item.name}" width="50"></td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>₹${item.price.toFixed(2)}</td>
      </tr>
    `;
    totalPrice += item.price;
  });

  totalPriceElem.innerText = `₹${totalPrice.toFixed(2)}`;
}

function updateTotalPrice() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedIndexes = Array.from(
    document.querySelectorAll('input[name="selectedProducts"]:checked')
  ).map((input) => parseInt(input.value));

  let totalPrice = 0;
  selectedIndexes.forEach((index) => {
    totalPrice += cart[index].price;
  });

  document.getElementById("totalPrice").innerText = `₹${totalPrice.toFixed(2)}`;
}

function displayDatabase() {
  const database = JSON.parse(localStorage.getItem("database")) || [];
  const databaseBody = document.getElementById("databaseBody");

  databaseBody.innerHTML = "";

  if (database.length === 0) {
    databaseBody.innerHTML =
      '<tr><td colspan="5">No orders in the database.</td></tr>';
  } else {
    database.forEach((order) => {
      databaseBody.innerHTML += `
        <tr>
          <td>${order.productName}</td>
          <td>${order.name}</td>
          <td>${order.address}</td>
          <td>${order.phone}</td>
          <td>
            <button onclick="fillUpdateForm(${order.id})">Edit</button>
            <button onclick="deleteOrder(${order.id})">Delete</button>
          </td>
        </tr>
      `;
    });
  }
}

function deleteOrder(orderId) {
  let database = JSON.parse(localStorage.getItem("database")) || [];
  database = database.filter((order) => order.id !== orderId);
  localStorage.setItem("database", JSON.stringify(database));
  displayDatabase();
  alert("Order deleted successfully!");
}

function fillUpdateForm(orderId) {
  const database = JSON.parse(localStorage.getItem("database")) || [];
  const order = database.find((order) => order.id === orderId);

  if (order) {
    document.getElementById("updateProductName").value = order.productName;
    document.getElementById("updateName").value = order.name;
    document.getElementById("updateAddress").value = order.address;
    document.getElementById("updatePhone").value = order.phone;
    document.getElementById("orderId").value = order.id;
  }
}

function updateOrder() {
  const productName = document.getElementById("updateProductName").value;
  const name = document.getElementById("updateName").value;
  const address = document.getElementById("updateAddress").value;
  const phone = document.getElementById("updatePhone").value;
  const orderId = parseInt(document.getElementById("orderId").value);

  let database = JSON.parse(localStorage.getItem("database")) || [];
  const index = database.findIndex((order) => order.id === orderId);

  if (index !== -1) {
    database[index] = { id: orderId, productName, name, address, phone };
    localStorage.setItem("database", JSON.stringify(database));
    displayDatabase();
    alert("Order updated successfully!");
  } else {
    alert("Order not found.");
  }
}

function submitOrder() {
  const productName = document.getElementById("productName").value;
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;

  const orderId = Date.now();

  let database = JSON.parse(localStorage.getItem("database")) || [];
  database.push({ id: orderId, productName, name, address, phone });
  localStorage.setItem("database", JSON.stringify(database));

  alert("Order submitted successfully!");
  window.location.href = "database.html";
}

if (document.getElementById("databaseBody")) {
  displayDatabase();
}

if (document.getElementById("checkoutBody")) {
  displaySelectedProducts();
}

if (document.getElementById("cartBody")) {
  displayCart();
}

function searchProduct() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  const products = document.querySelectorAll(".product");

  products.forEach((product) => {
    const productName = product.getAttribute("id").toLowerCase();

    if (productName.includes(searchTerm) && searchTerm !== "") {
      product.classList.add("highlight");
    } else {
      product.classList.remove("highlight");
    }
  });
}
