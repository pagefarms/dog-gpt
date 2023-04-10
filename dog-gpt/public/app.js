async function fetchGif() {
    const apiKey = 'Xab9EsWuNDSDDW5iRWruA1JjVrJTAL0Q';
    const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=funny%20dog&rating=g`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        console.log('GIPHY API response:', data);
        return data.data.images.fixed_height.url;
    } catch (error) {
        console.error('Error fetching GIF:', error);
        return null;
    }
}

function generateDogMessage() {
    const words = ['woof', 'bark'];
    let message = '';
    const wordCount = Math.floor(Math.random() * 10) + 1;
    for (let i = 0; i < wordCount; i++) {
        message += words[Math.floor(Math.random() * words.length)];
        if (i < wordCount - 1) {
            message += ' ';
        }
    }
    return message;
}

function addMessage(sender, text, gifUrl = null) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    const messageParagraph = document.createElement('p');
    messageParagraph.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageParagraph.textContent = text;
    messageDiv.appendChild(messageParagraph);
    
    if (gifUrl) {
        const gifImg = document.createElement('img');
        gifImg.src = gifUrl;
        gifImg.alt = "Dog GIF";
        gifImg.style.maxWidth = "200px"; // Set max width
        gifImg.style.maxHeight = "200px"; // Set max height
        gifImg.style.width = "auto"; // Set width to auto
        gifImg.style.height = "auto"; // Set height to auto


        // Add a 'load' event listener
        gifImg.addEventListener('load', () => {
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });

        messageDiv.appendChild(gifImg);
    }

    chatHistory.appendChild(messageDiv);

    // Scroll into view only if there's no gif
    if (!gifUrl) {
        setTimeout(() => {
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 0);
    }
}

async function handleMessageFormSubmit(event) {
    event.preventDefault();

    const messageInput = document.getElementById('message-input');
    const userMessage = messageInput.value.trim();
    if (userMessage.length === 0) return;

    addMessage('user', userMessage);

    messageInput.value = '';
    messageInput.focus();

    const gifUrl = await fetchGif();
    const dogMessage = generateDogMessage();

    if (gifUrl) {
        addMessage('dog', dogMessage, gifUrl);
    } else {
        addMessage('dog', 'Woof! I cannot fetch a gif right now. Try again later.');
    }
}

const messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', handleMessageFormSubmit);
