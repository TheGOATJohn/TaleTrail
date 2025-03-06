//** BookLog class */
class BookLog {
    constructor(id, book, pagesRead = 0, totalPagesRead = 0, dateAdded = new Date(), completed = false) {
        this.id = id;
        this.book = book;
        this.pagesRead = pagesRead;
        this.totalPagesRead = totalPagesRead;
        this.dateAdded = dateAdded;
        this.completed = completed;
    }

    calculateTotalPagesRead() {
        this.totalPagesRead += this.pagesRead;
    }
}

// Child class to store log details
class ChildBookLog extends BookLog {
    constructor(id, book) {
        super(id, book);
        this.logHistory = [];
    }

    addLog(pagesRead) {
        if (isNaN(pagesRead) || pagesRead <= 0) {
            alert("Please enter a valid number of pages read.");
            return;
        }
        
        const logEntry = {
            pagesRead: pagesRead,
            date: new Date().toLocaleString()
        };
        
        this.logHistory.push(logEntry);
        this.calculateTotalPagesRead();
        this.updateLogDisplay();
    }

    updateLogDisplay() {
        const logContainer = document.getElementById("log-history");
        if (logContainer) {
            logContainer.innerHTML = this.logHistory.length > 0 
                ? this.logHistory.map((log, index) => 
                    `<p>${index + 1}. ${log.date} - Pages Read: ${log.pagesRead}</p>`
                ).join('')
                : '<p>No logs yet.</p>';
        }

        const popupLogHistory = document.getElementById('popup-log-history');
        if (popupLogHistory) {
            popupLogHistory.innerHTML = this.logHistory.length > 0 
                ? this.logHistory.map((log, index) => `
                    <div class="log-entry" style="border-bottom: 1px solid #ccc; padding: 10px;">
                        <p>Entry ${index + 1}</p>
                        <p>Date: ${log.date}</p>
                        <p>Pages Read: ${log.pagesRead}</p>
                    </div>`
                ).join('')
                : '<p>No logs have been added yet.</p>';
        }
    }
}

const myBookLog = new ChildBookLog(1, "Sample Book");

function saveLog() {
    const pagesRead = parseInt(document.getElementById('pages-read').value);
    if (!isNaN(pagesRead) && pagesRead > 0) {
        myBookLog.addLog(pagesRead);
        alert("Log saved successfully!");
    } else {
        alert("Please enter a valid number of pages read.");
    }
}

function openAddLog() {
    document.getElementById("myPopup").style.display = "block";
}

function closeAddLog() {
    document.getElementById("myPopup").style.display = "none";
}

/* Roadmap Popup */

function openRoadmap() {
    document.getElementById("roadmap-popup").style.display = "block";
}

function closeRoadmap() {
    document.getElementById("roadmap-popup").style.display = "none";
}

function openLogHistory() {
    const logHistoryPopup = document.createElement('div');
    logHistoryPopup.id = 'log-history-popup';
    logHistoryPopup.className = 'log-popup';
    logHistoryPopup.innerHTML = `
        <div class="popup-container">
            <button type="button" class="close-button" onclick="closeLogHistory()">X</button>
            <h1>Reading Log History</h1>
            <div id="popup-log-history" style="max-height: 300px; overflow-y: auto;">
                ${myBookLog.logHistory.length > 0 
                    ? myBookLog.logHistory.map((log, index) => `
                        <div class="log-entry" style="border-bottom: 1px solid #ccc; padding: 10px;">
                            <p>Entry ${index + 1}</p>
                            <p>Date: ${log.date}</p>
                            <p>Pages Read: ${log.pagesRead}</p>
                        </div>`
                    ).join('')
                    : '<p>No logs have been added yet.</p>'}
            </div>
        </div>
    `;
    
    const existingPopup = document.getElementById('log-history-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    document.body.appendChild(logHistoryPopup);
    logHistoryPopup.style.display = 'block';
}

function closeLogHistory() {
    const logHistoryPopup = document.getElementById('log-history-popup');
    if (logHistoryPopup) {
        logHistoryPopup.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('search-input');
    const resultsDiv = document.getElementById('results');
    const detailsPopup = document.getElementById('detailsPopup');
    const selectedBookTitle = document.getElementById('selected-book-title');

    window.searchBooks = async () => {
        const query = searchBox.value.trim();
        // Construct the API URL with the encoded search query parameter to avoid special character issues
        const apiUrl = `http://127.0.0.1:5000/api/record?title=${encodeURIComponent(query)}`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            resultsDiv.innerHTML = '';
            
            if (data.length > 0) {
                data.forEach(record => {
                    const [title, image, author, pages, genre, band] = record;
                    const recordElement = document.createElement('div');
                    recordElement.className = 'search-result';
                    recordElement.innerHTML = `
                    <h3>${title}</h3>
                    <p>Author: ${author}</p>
                    <p>Pages: ${pages}</p>
                    <p>Genre: ${genre}</p>
                    <p>Band: ${band}</p>`;
                    recordElement.addEventListener('click', () => openDetailsPopup(title));
                    resultsDiv.appendChild(recordElement);
                });
            } else {
                resultsDiv.textContent = 'No results found';
            }
        } catch (error) {
            resultsDiv.textContent = 'Error fetching data.';
            console.error('Error fetching data:', error);
        }
    };

    // Function to open the book details popup
    function openDetailsPopup(bookTitle) {
        selectedBookTitle.textContent = bookTitle;
        detailsPopup.style.display = 'flex';
    }

    window.closeDetailsPopup = () => {
        detailsPopup.style.display = 'none';
    };
});
