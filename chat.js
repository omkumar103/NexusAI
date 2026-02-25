/* ============================================================
   NEXUS AI — Chatbot Logic (Vanilla JS)
   Handles UI, API calls, and Speech-to-Text
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');
    const badge = document.querySelector('.notification-badge');

    // Replace with your actual backend URL once deployed
    const BACKEND_URL = 'http://localhost:3000/api/chat'; 
    let chatHistory = [];

    // Toggle Chat
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if(badge) badge.style.display = 'none'; // Hide badge on open
        if(!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
            scrollToBottom();
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Formatting Time
    const getTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = () => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Render Message to UI
    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        msgDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${getTime()}</div>
        `;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    };

    // Show/Hide Typing Indicator
    const showTyping = () => {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('message', 'bot-message');
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    };

    const removeTyping = () => {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    };

    // Handle Send Logic
    const handleSend = async (text) => {
        if (!text.trim()) return;

        // 1. Add User Message to UI & History
        appendMessage(text, 'user');
        chatInput.value = '';
        
        // 2. Show typing animation
        showTyping();

        try {
            // 3. Call Backend API
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // 4. Update History and UI
            chatHistory.push({ role: 'user', content: text });
            chatHistory.push({ role: 'assistant', content: data.reply });
            
            removeTyping();
            appendMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Chatbot API Error:', error);
            removeTyping();
            appendMessage("I'm having trouble connecting to my neural network right now. Please try again later.", 'bot');
        }
    };

    // Event Listeners for sending
    sendBtn.addEventListener('click', () => handleSend(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend(chatInput.value);
    });

    // Quick Replies
    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            handleSend(btn.getAttribute('data-text'));
        });
    });

    // Voice Input (Web Speech API)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN'; // Works well for English + Hinglish + Hindi accent
        recognition.interimResults = false;

        recognition.onstart = () => {
            micBtn.style.color = '#ff4d6d'; // Red mic to indicate listening
            chatInput.placeholder = 'Listening...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            handleSend(transcript);
        };

        recognition.onerror = () => {
            micBtn.style.color = 'var(--text-secondary)';
            chatInput.placeholder = 'Type a message...';
        };

        recognition.onend = () => {
            micBtn.style.color = 'var(--text-secondary)';
            chatInput.placeholder = 'Type a message...';
        };

        micBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        // Hide mic button if browser doesn't support Speech API
        micBtn.style.display = 'none';
    }
});