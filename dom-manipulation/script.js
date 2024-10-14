const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteForm = document.getElementById('addQuoteForm');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    // Add more quotes here
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}

function addQuote() {
    const newQuote = {
        text: newQuoteText.value,
        category: newQuoteCategory.value
    };
    quotes.push(newQuote);
    newQuoteText.value = '';
    newQuoteCategory.value = '';
    showRandomQuote();
}

newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addQuote();
});

showRandomQuote();