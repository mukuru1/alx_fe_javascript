// Initialize quotes from local storage or fallback to default quotes array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" },
  ];
  
  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    // Save the last viewed quote in session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }
  
  // Function to add a new quote and save to local storage
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      alert("New quote added!");
      // Clear input fields after adding the quote
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Load the last viewed quote from session storage (if exists)
  function loadLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `"${lastQuote.text}" - <em>${lastQuote.category}</em>`;
    }
  }
  
  // Run this when the page loads
  window.onload = function() {
    loadLastViewedQuote();  // Load the last viewed quote
  };
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  // Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON format');
        }
      } catch (e) {
        alert('Error importing quotes: ' + e.message);
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  // In the window.onload function
function loadLastViewedQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `"${lastQuote.text}" - <em>${lastQuote.category}</em>`;
    }
  }
// Function to export quotes as a JSON file
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  document.getElementById('exportJson').addEventListener('click', exportToJson);
  const SERVER_API = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_API);
    const serverQuotes = await response.json();
    // Simulate server returning quotes, we'll filter to use only relevant data (e.g., first 5 for simplicity)
    return serverQuotes.slice(0, 5).map(q => ({ text: q.title, category: 'Server' }));
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Function to simulate posting a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_API, {
      method: 'POST',
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('Quote successfully posted to the server:', data);
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}
// Periodically fetch quotes from the server and sync with local storage
async function syncWithServer() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
    // Merge quotes (simple strategy: server data takes precedence in case of conflicts)
    const mergedQuotes = [...localQuotes, ...serverQuotes.filter(sq => !localQuotes.find(lq => lq.text === sq.text))];
    
    // Save the merged quotes back to local storage
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    console.log('Synced with server:', mergedQuotes);
  }
  
  // Sync every minute (or any desired interval)
  setInterval(syncWithServer, 60000);
// Function to resolve conflicts: Server takes precedence by default
function resolveConflict(localQuote, serverQuote) {
    if (localQuote.text !== serverQuote.text) {
      console.warn(`Conflict detected for quote: "${localQuote.text}". Using server version.`);
      return serverQuote; // Server version takes precedence
    }
    return localQuote; // No conflict, return the local quote
  }
  
  // Function to handle conflict resolution during syncing
  function mergeQuotesWithConflictResolution(localQuotes, serverQuotes) {
    return localQuotes.map(localQuote => {
      const matchingServerQuote = serverQuotes.find(serverQuote => serverQuote.text === localQuote.text);
      return matchingServerQuote ? resolveConflict(localQuote, matchingServerQuote) : localQuote;
    });
  }
  
  // Enhanced sync function with conflict resolution
  async function enhancedSyncWithServer() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
    const mergedQuotes = mergeQuotesWithConflictResolution(localQuotes, serverQuotes);
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    console.log('Synced with server with conflict resolution:', mergedQuotes);
  }
  
  // UI notification for conflict resolution (basic example)
  function notifyConflictResolution() {
    const notification = document.createElement('div');
    notification.innerHTML = "Conflict resolved! Server data was used.";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000); // Show for 3 seconds
  }
  