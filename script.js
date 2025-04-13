// Voice Assistant Implementation
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
const synth = window.speechSynthesis;

// Initialize speech recognition
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Voice assistant state
let isVoiceEnabled = false;
let isListening = false;

// DOM elements
const voiceButton = document.getElementById('voice-button');
const voiceStatus = document.getElementById('voice-status');
const voiceModal = document.getElementById('voice-modal');
const enableVoiceBtn = document.getElementById('enable-voice');
const disableVoiceBtn = document.getElementById('disable-voice');
const voiceUI = document.getElementById('voice-ui');
const voiceInput = document.getElementById('voice-input');
const voiceOutput = document.getElementById('voice-output');

// Initialize voice button state
window.addEventListener('load', () => {
    // Only show modal if voice hasn't been enabled/disabled before
    if (localStorage.getItem('voicePreference') === null) {
        voiceModal.style.display = 'flex';
        voiceButton.disabled = true;
        voiceButton.classList.add('disabled');
        voiceStatus.textContent = 'Enable voice in modal';
    }
});

// Voice modal handlers
enableVoiceBtn.addEventListener('click', () => {
    voiceModal.style.display = 'none';
    isVoiceEnabled = true;
    voiceButton.disabled = false;
    voiceButton.classList.remove('disabled');
    localStorage.setItem('voicePreference', 'enabled');
    speak("Voice assistant enabled. Press the microphone button to speak.");
});

disableVoiceBtn.addEventListener('click', () => {
    voiceModal.style.display = 'none';
    isVoiceEnabled = false;
    voiceButton.disabled = true;
    voiceButton.classList.add('disabled');
    localStorage.setItem('voicePreference', 'disabled');
});

// Toggle voice listening
voiceButton.addEventListener('click', () => {
    if (!isVoiceEnabled) return;
    
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
});

function startListening() {
    isListening = true;
    voiceButton.classList.add('listening');
    voiceStatus.textContent = 'Listening...';
    voiceUI.style.display = 'block';
    voiceInput.textContent = '';
    recognition.start();
}

function stopListening() {
    isListening = false;
    voiceButton.classList.remove('listening');
    voiceStatus.textContent = 'Ready';
    recognition.stop();
}

// Speech recognition handlers
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    voiceInput.textContent = transcript;
    processVoiceCommand(transcript);
};

recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    voiceStatus.textContent = 'Error: ' + event.error;
    stopListening();
};

// Process voice command
function processVoiceCommand(command) {
    // Display user voice input as chat bubble
    addMessage(command, 'user-message');

    // Fixed response from the assistant
    const response = "I'm still under development 🛠️, but soon I'll be able to help you with live train info.";
    voiceOutput.textContent = response;
    speak(response);
    
    // Simulate a delay before stopping listening
    setTimeout(stopListening, 2000);
}

// Speak text using speech synthesis
function speak(text) {
    if (synth.speaking) {
        synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
}

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
