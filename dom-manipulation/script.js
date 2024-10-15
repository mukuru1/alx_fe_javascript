// Simulate server data URL (replace with a real API endpoint if available)
const SERVER_API_URL = "https://jsonplaceholder.typicode.com/posts";  // This simulates a quotes endpoint

// Array to hold local quotes
let quotes = [
    { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { id: 2, text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { id: 3, text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    displayQuote(quote);
}

// Function to display a specific quote
function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- ${quote.category}</em></p>`;
}

// Function to populate categories dynamically in the filter dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
    const categoryFilter = document.getElementById('categoryFilter');

    // Clear the dropdown (except the "all" option)
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add categories to the dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to add new quote to the array and update categories
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        // Create a new quote object
        const newQuote = {
            id: Date.now(), // Using timestamp as a unique ID
            text: newQuoteText,
            category: newQuoteCategory
        };

        // Add new quote to local array
        quotes.push(newQuote);

        // Simulate sending the new quote to the server
        syncQuoteWithServer(newQuote);

        // Update categories and display the new quote
        populateCategories();
        displayQuote(newQuote);
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Function to sync a new quote with the server (Simulated POST request)
async function syncQuoteWithServer(quote) {
    try {
        const response = await fetch(SERVER_API_URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quote)
        });
        if (response.ok) {
            console.log('Quote synced with server:', quote);
        }
    } catch (error) {
        console.error("Error syncing quote with server:", error);
    }
}

// Function to periodically fetch new quotes from the server and update local data
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_API_URL);
        const serverQuotes = await response.json();

        // Simulate server sending quotes (this would be real in an actual API)
        // Compare server data with local data and resolve conflicts
        resolveConflicts(serverQuotes);

    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Function to resolve conflicts between local and server data
function resolveConflicts(serverQuotes) {
    const newQuotes = [];
    let conflicts = false;

    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(quote => quote.id === serverQuote.id);

        // If the quote exists locally, check for conflicts
        if (localQuote) {
            if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
                // Conflict detected
                conflicts = true;
                // Resolve conflict by keeping the server's version
                newQuotes.push(serverQuote);
            } else {
                // No conflict, use local version
                newQuotes.push(localQuote);
            }
        } else {
            // New quote from server
            newQuotes.push(serverQuote);
        }
    });

    // Update local quotes with resolved data
    quotes = newQuotes;

    // Notify the user if conflicts were resolved
    if (conflicts) {
        notifyUser("Some data conflicts were detected and resolved using server data.");
    }

    // Update the UI with the new data
    populateCategories();
}

// Function to notify the user of conflicts or updates
function notifyUser(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);

    // Automatically hide notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Periodic data sync with server (every 10 seconds)
setInterval(fetchQuotesFromServer, 10000);

// Initial setup on page load
window.onload = () => {
    populateCategories(); // Populate category filter dropdown
    document.getElementById('newQuote').addEventListener('click', showRandomQuote); // Event listener for random quote button

    // Automatically apply saved filter if exists
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        document.getElementById('categoryFilter').value = savedCategory;
        filterQuotes();
    }
};
