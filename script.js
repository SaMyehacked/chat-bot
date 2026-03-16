document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const saveButton = document.getElementById('save-chat');
    const typingSound = document.getElementById('typing-sound');
    const popSound = document.getElementById('pop-sound');

    // Initial greeting (only on first load)
    if (sessionStorage.getItem('firstLoad') === null) {
        addMessage("Hello! I'm PSYCHO AI. Ask me anything!", false);
        sessionStorage.setItem('firstLoad', 'done');
    }

    // ================== MESSAGE FUNCTIONS ================== //
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        if (!isUser) {
            popSound.currentTime = 0;
            popSound.play();
        }
    }

    // ================== SAVE CONVERSATION ================== //
    saveButton.addEventListener('click', function() {
        const messages = Array.from(chatMessages.children)
            .map(msg => {
                const isUser = msg.classList.contains('user-message');
                const time = msg.querySelector('.message-time').textContent;
                const content = msg.querySelector('.message-content').textContent;
                return `${time} ${isUser ? 'You' : 'Bot'}: ${content}`;
            })
            .join('\n\n');
        
        const blob = new Blob([messages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus-chat-${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // ================== CHAT PROCESSING ================== //
    function processInput() {
        const input = userInput.value.trim();
        if (!input) return;
        
        addMessage(input, true);
        typingSound.currentTime = 0;
        typingSound.play();
        userInput.value = '';
        
        setTimeout(() => {
            const response = getBotResponse(input); // From knowledge.js
            addMessage(response, false);
        }, 500 + Math.random() * 500); // Random delay for realism
    }

    // Event Listeners
    sendButton.addEventListener('click', processInput);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && processInput());
});
