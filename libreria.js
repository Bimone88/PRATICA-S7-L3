document.addEventListener("DOMContentLoaded", function () {
  const bookContainer = document.getElementById("bookContainer");
  const cartList = document.getElementById("cartList");

  // Carica i dati del carrello dallo storage, se disponibili:
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Effettua la chiamata HTTP per ottenere i libri:
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => response.json())
    .then((books) => {
      // Itera attraverso i libri ottenuti e crea le card Bootstrap:
      books.forEach((book) => {
        const card = document.createElement("div");
        card.classList.add("col");
        card.innerHTML = `
            <div class="card">
              <img src="${book.img}" class="card-img-top" alt="${book.title}">
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">Prezzo: ${book.price}</p>
                <button class="btn btn-danger" onclick="discardBook(event)">Scarta</button>
                <button class="btn btn-primary" onclick="addToCart('${book.title}')">Compra ora</button>
              </div>
            </div>
          `;
        bookContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Errore nella chiamata HTTP:", error));

  // Funzione chiamata quando si preme il pulsante "Scarta":
  window.discardBook = function (event) {
    const card = event.target.closest(".card");
    if (card) {
      card.remove(); // Rimuove la card dalla pagina
    }
  };

  // Funzione chiamata quando si preme il pulsante "Compra ora":
  window.checkout = function () {
    alert("Hai acquistato i seguenti libri:\n" + cart.join("\n"));
    // Svuota il carrello e aggiorna la lista del carrello nello storage:
    cart = [];
    updateCartList();
    updateLocalStorage();
  };

  // Funzione per aggiungere un libro al carrello:
  window.addToCart = function (title) {
    cart.push(title);
    updateCartList();
    updateLocalStorage();
  };

  // Funzione chiamata quando si preme il pulsante "Rimuovi dal carrello":
  window.removeFromCart = function (title) {
    const bookIndex = cart.indexOf(title);
    if (bookIndex !== -1) {
      cart.splice(bookIndex, 1);
      updateCartList();
      updateLocalStorage();
    }
  };

  // Funzione per aggiornare la lista del carrello nella pagina:
  function updateCartList() {
    cartList.innerHTML = "";
    cart.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      listItem.innerHTML = `
          ${item}
          <button class="btn btn-danger" onclick="removeFromCart('${item}')">Rimuovi dal carrello</button>
        `;
      cartList.appendChild(listItem);
    });
  }

  // Funzione per aggiornare il carrello nello storage del browser:
  function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
});
