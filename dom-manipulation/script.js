const mockServerQuotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Do not wait for the perfect moment, take the moment and make it perfect.", category: "Inspiration" }
];
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];
async function fetchQuotesFromServer() {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve(mockServerQuotes);
      }, 1000);
  });
}
async function sendQuoteToServer(quote) {
  return new Promise(resolve => {
      setTimeout(() => {
          mockServerQuotes.push(quote);
          resolve(quote);
      }, 1000);
  });
}
