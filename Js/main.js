document.addEventListener("DOMContentLoaded",function(){

  const tableBody = document.querySelector("tbody");
  const notFound = document.querySelector(".notFount");
  let customers = [];
  let transactions = [];
  // get all data
  async function getData() {
    notFound.classList.remove("d-none");
    try {
      const response = await fetch("../data.json");
      const data = await response.json();
      customers = data.customers;
      // console.log(customers);
      transactions = data.transactions;
      displayCustomers();
    } catch (error) {
      console.error("Error fetching data:", error);
      notFound.classList.remove("d-none");
      document.querySelector(".table").classList.add("d-none");
    }
    notFound.classList.add("d-none");
  }
  // display all customers
  function displayCustomers() {
    const customerTransactions = transactions.reduce((item, transaction) => {
      const customerId = transaction.customer_id;
      item[customerId] = item[customerId] || [];
      item[customerId].push(transaction);
      // console.log(item);
      return item;
    }, {});
    // console.log(customerTransactions);
    tableBody.innerHTML = "";
    customers.forEach(customer => {
      const customerTransactionsData = customerTransactions[customer.id];
      console.log(customerTransactionsData);
      // total transactions
      const totalTransactionAmount = customerTransactionsData.reduce(
        (sum, transaction) => {
          return sum + transaction.amount;
        },
        0
      );
      // console.log(totalTransactionAmount);
      const row = document.createElement("tr");
      row.innerHTML = `
                     <td>${customer.name}</td>
                     <td>${totalTransactionAmount}</td>
                      <td class="p-3"><button type="button"
                      class="btn btn-outline-primary" data-id="${customer.id}">View</button></td>
                   `;
      tableBody.appendChild(row);
    });
  }
  // search by name 
  function searchByName(e) {
    tableBody.innerHTML = "";
    const customerTransactions = transactions
      .filter(transaction => {
        const customer = customers.find(c => c.id === transaction.customer_id);
        return customer.name.toLowerCase().includes(e.value.toLowerCase());
      })
      .reduce((item, transaction) => {
        const customerId = transaction.customer_id;
        // console.log(customerId);
        item[customerId] = item[customerId] || [];
        item[customerId].push(transaction);
        // console.log(item);
        return item;
      }, {});
    // console.log(customerTransactions);
    customers.forEach(customer => {
      const customerTransactionsData = customerTransactions[customer.id] || [];
      // console.log(customerTransactionsData.length);
      const totalTransactionAmount = customerTransactionsData.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      console.log(totalTransactionAmount);
      if (totalTransactionAmount !== 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
                       <td>${customer.name}</td>
                       <td>${totalTransactionAmount}</td>
                        <td class="p-3"><button type="button"
                        class="btn btn-outline-primary">View</button></td>
        `;
        tableBody.appendChild(row);
      }
    });
  }
  $(document).ready(function () {
    getData();
    document.getElementById("search").addEventListener("input", function () {
      searchByName(this);
    });
  });
  let customerData;
  function createChart(id) {
    const customerTransactions = transactions.reduce((item, transaction) => {
      const customerId = transaction.customer_id;
      item[customerId] = item[customerId] || [];
      item[customerId].push(transaction);
      return item;
    }, {});
    console.log(customerTransactions);
    customerData = customerTransactions[id] || [];
    console.log(customerData);
  }
  
  document.querySelector("tbody").addEventListener("click", function (e) {
    document.querySelector(".chart").classList.remove("d-none");
    document.querySelector(".text-info").classList.add("d-none");
    // console.log(e.target.dataset.id);
    createChart(e.target.dataset.id);
  
    myChart.config.data.labels = [`${customerData[0].date}`, `${customerData[1]?.date}`];
    myChart.config.data.datasets[0].data = [`${customerData[0].amount}`, `${customerData[1]?.amount}`];
    myChart.update();
  });
  const data = {
    labels: [
      "2022-01-01",
      "2022-01-02",
      "2022-01-03",
      "2022-01-04",
  
    ],
    datasets: [
      {
        label: "transaction",
        data: [65, 59, 80, 81],
        fill: false,
        borderColor: "rgb(65,84,122)",
        tension: 0.1
      }
    ]
  };
  const config = {
    type: "line",
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
  const myChart = new Chart(document.getElementById("myChart"), config);
})
