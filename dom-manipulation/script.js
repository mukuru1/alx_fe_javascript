const SERVER_API_URL = "https://jsonplaceholder.typicode.com/posts";


let quotes = [
    { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { id: 2, text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { id: 3, text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
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
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        
        const newQuote = {
            id: Date.now(), 
            text: newQuoteText,
            category: newQuoteCategory
        };

        quotes.push(newQuote);

        syncQuoteWithServer(newQuote);
        populateCategories();
        displayQuote(newQuote);
    } else {
        alert("Please enter both a quote and a category.");
    }
}

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

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_API_URL);
        const serverQuotes = await response.json();

        resolveConflicts(serverQuotes);

    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

function resolveConflicts(serverQuotes) {
    const newQuotes = [];
    let conflicts = false;

    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(quote => quote.id === serverQuote.id);

        if (localQuote) {
            if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
                conflicts = true;
                
                newQuotes.push(serverQuote);
            } else {
                
                newQuotes.push(localQuote);
            }
        } else {
            
            newQuotes.push(serverQuote);
        }
    });


    quotes = newQuotes;

    if (conflicts) {
        notifyUser("Some data conflicts were detected and resolved using server data.");
    }

    populateCategories();
}

function notifyUser(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

setInterval(fetchQuotesFromServer, 10000);

window.onload = () => {
    populateCategories(); 
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        document.getElementById('categoryFilter').value = savedCategory;
        filterQuotes();
    }
};
