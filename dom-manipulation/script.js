// Array to hold quotes
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- ${quote.category}</em></p>`;
}

// Create form to add new quote
function createAddQuoteForm() {
  const formDiv = document.createElement('div');
  formDiv.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formDiv);
}

// Function to add new quote to the array and display it
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  // Add new quote to array
  if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });

      // Update DOM to show the new quote
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `<p>${newQuoteText}</p><p><em>- ${newQuoteCategory}</em></p>`;
  } else {
      alert("Please enter both a quote and a category.");
  }
}

// Initial event listener for showing a random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call the function to create the form
createAddQuoteForm();
