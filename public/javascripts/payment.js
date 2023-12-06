// Import the items array from localStorage or wherever you stored it
const items = JSON.parse(localStorage.getItem("items"));
console.log(items)

paypal.Buttons({
  createOrder: function(data, actions) {
    return fetch("/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then((data) => {
        console.log(data.orderID)
        return data; // Return the order ID
      })
      .catch((e) => {
        console.error(e.error);
      });
  },
    onApprove: function (data, actions) {
       return actions.order.capture().then(function(details) {
      // Redirect to http://localhost:5000/index
      window.location.href = "https://ecommerce-manker.onrender.com/thank";
    });
  },
  })
  .render('#paypal-button-container');
 