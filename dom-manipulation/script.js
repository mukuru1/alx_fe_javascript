let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  displayQuote(quote);
}
function displayQuote(quote) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- ${quote.category}</em></p>`;
}
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === "all" 
      ? quotes 
      : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      displayQuote(filteredQuotes[randomIndex]);
  } else {
      document.getElementById('quoteDisplay').innerHTML = `<p>No quotes available for this category.</p>`;
  }
  localStorage.setItem('selectedCategory', selectedCategory);
}
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById('categoryFilter');

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
      categoryFilter.value = savedCategory;
      filterQuotes();
  }
}
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });

      displayQuote({ text: newQuoteText, category: newQuoteCategory });

      populateCategories();
  } else {
      alert("Please enter both a quote and a category.");
  }
}

window.onload = () => {
  populateCategories();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
      document.getElementById('categoryFilter').value = savedCategory;
      filterQuotes();
  }
};
