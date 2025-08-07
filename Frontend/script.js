const ctx = document.getElementById('barChart').getContext('2d');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    //labels: ['AAPL', 'GOOGL', 'TSLA'],
    datasets: [
      {
        label: 'Cost Value',
        //data: [1500, 2000, 5600],
        backgroundColor: 'blue'
      },
      {
        label: 'Market Value',
        //data: [2000, 2500, 7200],
        backgroundColor: 'green'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cost vs Market Value'
      }
    }
  }
});







async function fetchStockData() {
  const response = await fetch('http://localhost:3000/stock_transactions/all');
  const data = await response.json();
  return data;
}

function updateTable(data) {
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.transaction_date}</td>
      <td>${row.ticker}</td>
      <td>${row.company}</td>
      <td>${row.action}</td>
      <td>${row.quantity}</td>
      <td>$${row.buy_price}</td>
      <td>$${row.total_cost}</td>
      <td>$${row.current_price}</td>
      <td>$${row.market_value}</td>
      <td>${row.gain_loss}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateChart(data) {
  const labels = data.map(row => row.ticker);
  const costValues = data.map(row => row.total_cost);
  const marketValues = data.map(row => row.market_value);

  chart.data.labels = labels;
  chart.data.datasets[0].data = costValues;
  chart.data.datasets[1].data = marketValues;
  chart.update();
}

// Initial load
fetchStockData().then(data => {
  updateTable(data);
  updateChart(data);
});




// Modal functionality
const modal = document.getElementById("modal");
const buyBtn = document.getElementById("buyBtn");
const sellBtn = document.getElementById("sellBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

// Open modal when Buy/Sell is clicked
buyBtn.onclick = function() {
  document.getElementById("action-type").value = "Buy";  // Set default action to Buy
  modal.style.display = "block";
}

sellBtn.onclick = function() {
  document.getElementById("action-type").value = "Sell";  // Set default action to Sell
  modal.style.display = "block";
}

// Close the modal when the user clicks the close button
closeModal.onclick = function() {
  modal.style.display = "none";
}

// Close the modal when the user clicks the cancel button
cancelBtn.onclick = function() {
  modal.style.display = "none";
}

// Close the modal if the user clicks outside the modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById('stock').addEventListener('change', async function () {
  const selectedSymbol = this.value;

  try {
    const response = await fetch(`http://localhost:3000/live-price/${selectedSymbol}`);
    const data = await response.json();

    if (data.price) {
      alert(`Live price of ${data.symbol} on ${data.date} is $${data.price}`);
    } else {
      alert("Live price data not available.");
    }
  } catch (error) {
    alert("Error fetching live price.");
  }
});


