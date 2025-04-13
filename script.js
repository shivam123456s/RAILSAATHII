// Simple Chatbot Implementation
document.getElementById('chat-button').addEventListener('click', function() {
    const chatContainer = document.getElementById('chat-container');
    const isOpening = chatContainer.style.display !== 'flex';
    chatContainer.style.display = isOpening ? 'flex' : 'none';
    
    if (isOpening) {
        // Clear previous messages
        document.getElementById('chat-messages').innerHTML = '';
        // Show welcome message after slight delay
        setTimeout(() => {
            addMessage("👋 Hi! I'm RailSathi AI Assistant. I can help you with train information, AR guidance, and more. Just type your question below.", 'bot-message');
        }, 300);
    }
});

// Send message function
function sendMessage() {
    const input = document.getElementById('user-message');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user-message');
        input.value = '';
        
        // Simulate bot typing delay
        setTimeout(() => {
            addMessage("🚧 I'm currently under development. Please check back later.", 'bot-message');
        }, 1500);
    }
}

// Add message to chat
function addMessage(text, className) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Event listeners
document.getElementById('send-message').addEventListener('click', sendMessage);
document.getElementById('user-message').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

// Emergency button functionality
document.getElementById('emergency-button').addEventListener('click', function() {
    const sound = document.getElementById('alert-sound');
    sound.play();
    alert('Emergency assistance requested! Help is on the way.');
});

// PNR Status Checker
document.getElementById('check-status').addEventListener('click', function() {
    const pnrInput = document.getElementById('pnr-input').value;
    const statusResult = document.getElementById('status-result');
    
    // Basic validation
    if (!pnrInput || pnrInput.length !== 10 || !/^\d+$/.test(pnrInput)) {
        statusResult.innerHTML = '<p class="error">Please enter a valid 10-digit PNR number</p>';
        return;
    }

    // Simulate API call
    statusResult.innerHTML = '<p>Checking status...</p>';
    
    setTimeout(() => {
        // Mock response
        const isDelayed = Math.random() < 0.3;
        const isCancelled = isDelayed && Math.random() < 0.5;
        
        const status = isCancelled ? 'Cancelled' : 
                      isDelayed ? 'Delayed by 45 minutes' : 'On Time';
        
        // Add reminder options
        statusResult.innerHTML = `
            <div class="reminder-options">
                <h4>Set Travel Reminders:</h4>
                <button class="reminder-btn" data-minutes="60">🔔 Board in 1 hour</button>
                <button class="reminder-btn" data-minutes="30">⏰ Wake-up alarm</button>
            </div>
            <div class="status-card">
                <h3>Train: Rajdhani Express (12345)</h3>
                <p>Route: Delhi to Mumbai</p>
                <p>Departure: 18:00 (${status})</p>
                <p>Platform: 5</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 60%"></div>
                </div>
            </div>
            ${isDelayed || isCancelled ? `
            <div class="notification-prompt">
                <p>Do you want to get notified about updates on this train?</p>
                <button id="enable-notifications">Yes, Notify Me</button>
            </div>
            ` : ''}
        `;
        
        // Setup reminder buttons
        document.querySelectorAll('.reminder-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const minutes = parseInt(this.dataset.minutes);
                setReminder(minutes);
            });
        });

        if (isDelayed || isCancelled) {
            document.getElementById('enable-notifications').addEventListener('click', requestNotificationPermission);
        }
        
        // Show feedback section
        showFeedbackSection();
        setupRatingStars();
    }, 1500);
});

// AR Mode functionality
document.getElementById('open-ar-mode').addEventListener('click', function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        window.location.href = 'ar.html';
    } else {
        const currentUrl = new URL(window.location.href);
        const baseUrl = currentUrl.origin;
        const arUrl = `${baseUrl}/ar.html`;
        
        document.getElementById('qr-code').src = 
            `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(arUrl)}`;
        document.getElementById('ar-url').textContent = arUrl;
        document.getElementById('desktopMessage').style.display = 'block';
    }
});

function checkARCompatibility() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
        alert('AR Mode is only available on mobile devices.');
    }
}
