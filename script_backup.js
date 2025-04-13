// Emergency button functionality
document.getElementById('emergency-button').addEventListener('click', function() {
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
        // 30% chance of delayed/cancelled status for demo
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
        
        // Show feedback section and setup stars
        showFeedbackSection();
        setupRatingStars();
    }, 1500);
});

document.getElementById('open-ar-mode').addEventListener('click', function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Open AR mode
        window.location.href = 'ar.html';
    } else {
        // Show desktop message and generate QR code for GitHub Pages
        // Use current page URL as base for AR page
        const currentUrl = new URL(window.location.href);
        const baseUrl = currentUrl.origin;
        const ghPagesUrl = `${baseUrl}/ar.html`;
        const qrCodeImg = document.getElementById('qr-code');
        const arUrlSpan = document.getElementById('ar-url');
        const arUrl = `${baseUrl}/ar.html`;
        
        qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(arUrl)}`;
        arUrlSpan.textContent = arUrl;
        document.getElementById('desktopMessage').style.display = 'block';
    }


// Add event listener to AR Mode link if it exists
const arLink = document.querySelector('a[href="ar.html"]');
if (arLink) {
    arLink.addEventListener('click', function(e) {
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            e.preventDefault();
            alert('AR Mode is only available on mobile devices.');
        }
    });
}

// Notification Functions
function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            showNotification('Notification enabled! You will receive updates about your train.');
            // Start mock updates for demo
            startMockUpdates();
        } else {
            alert('Notifications blocked. You can enable them in browser settings.');
        }
    });
}

function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('RailSathi Alert', { 
            body: message,
            icon: 'https://railsathi.in/logo.png'
        });
    } else {
        alert(message); // Fallback
    }
}

// Reminder Functions
function setReminder(minutes) {
    const reminderTime = minutes * 60 * 1000; // Convert to milliseconds
    
    // Show confirmation
    const confirmation = document.createElement('div');
    confirmation.className = 'reminder-confirmation';
    confirmation.innerHTML = `✅ Reminder set: We'll notify you ${minutes} minutes before departure.`;
    document.getElementById('status-result').appendChild(confirmation);

    // Set timeout for reminder
    setTimeout(() => {
        showNotification(`🚉 Your train departs in ${minutes} minutes. Get ready to board!`);
    }, reminderTime);
}

function startMockUpdates() {
    // Demo: Show mock updates every 10 seconds
    setInterval(() => {
        const messages = [
            '🚨 Your train is now delayed by 1 hour',
            'ℹ️ Platform changed to 7',
            '✅ Your train is back on schedule'
        ];
        showNotification(messages[Math.floor(Math.random() * messages.length)]);
    }, 10000);
}

// Feedback System
function setupRatingStars() {
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const stars = starsContainer.querySelectorAll('span');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                // Reset all stars
                stars.forEach(s => s.style.color = 'gray');
                // Color stars up to clicked one
                for (let i = 0; i <= index; i++) {
                    stars[i].style.color = 'gold';
                }
                // Store rating value
                starsContainer.dataset.rating = index + 1;
            });
        });
    });

    document.getElementById('submit-feedback').addEventListener('click', () => {
        const cleanliness = document.querySelector('.stars[data-type="cleanliness"]').dataset.rating;
        const punctuality = document.querySelector('.stars[data-type="punctuality"]').dataset.rating;
        const comment = document.querySelector('.feedback-comment').value;
        
        if (!cleanliness || !punctuality) {
            alert('Please rate both cleanliness and punctuality');
            return;
        }

        // Store feedback in localStorage
        const feedback = {
            cleanliness,
            punctuality,
            comment,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('userFeedback', JSON.stringify(feedback));
        
        // Show thank you message
        document.querySelector('.feedback-thanks').style.display = 'block';
        document.getElementById('submit-feedback').disabled = true;
    });
}

// Show feedback section when PNR status is shown
function showFeedbackSection() {
    document.getElementById('feedback-section').style.display = 'block';
}

// Voice Command Functionality
const voiceButton = document.getElementById('voice-button');
const voiceUI = document.getElementById('voice-ui');
const voiceStatus = document.getElementById('voice-status');
const voiceInput = document.getElementById('voice-input');
const voiceOutput = document.getElementById('voice-output');

class VoiceCommandHandler {
    constructor() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synth = window.speechSynthesis;
        this.backendUrl = 'http://localhost:5000/voice-command';
        
        // Enhanced error handling
        this.handleApiError = (error) => {
            console.error('API Error:', error);
            this.speak("Sorry, I encountered an error. Please try again.");
            voiceOutput.textContent = "Connection error. Please try again.";
        };
        
        this.setupRecognition();
    }

    async processCommand(transcript) {
        try {
            const response = await fetch(this.backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: transcript })
            });
            
            const data = await response.json();
            this.speak(data.reply);
            voiceOutput.textContent = data.reply;
            
            // Handle specific command responses
            if (data.action === 'check_pnr') {
                document.getElementById('pnr-input').focus();
            } else if (data.action === 'open_ar') {
                window.location.href = 'ar.html';
            }
        } catch (error) {
            console.error('Error:', error);
            this.speak("Sorry, I couldn't connect to the assistant service.");
            voiceOutput.textContent = "Connection error. Please try again.";
        }
    }

    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            voiceUI.style.display = 'block';
            voiceStatus.textContent = 'Listening...';
            voiceInput.textContent = '';
            setMicState('listening');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            voiceInput.textContent = transcript;
            this.processCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            let errorMsg = 'Error occurred in recognition';
            if (event.error === 'not-allowed') {
                errorMsg = 'Microphone access denied. Please allow microphone permissions and ensure you are using HTTPS.';
            } else if (event.error === 'service-not-allowed') {
                errorMsg = 'Voice recognition not supported over HTTP. Please use HTTPS.';
            }
            voiceStatus.textContent = errorMsg;
            setMicState('error');
            this.speak(errorMsg);
        };

        this.recognition.onend = () => {
            voiceStatus.textContent = 'Click microphone to speak';
            setMicState('ready');
        };
    }

    processCommand(transcript) {
        let commandFound = false;
        
        for (const [command, handler] of Object.entries(this.commands)) {
            if (transcript.includes(command)) {
                handler.call(this);
                commandFound = true;
                break;
            }
        }

        if (!commandFound) {
            this.speak("Sorry, I didn't understand that. Try saying 'help' for available commands.");
            voiceOutput.textContent = "Sorry, I didn't understand that. Try saying 'help' for available commands.";
        }
    }

    speak(text) {
        voiceOutput.textContent = text;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        this.synth.speak(utterance);
    }

    handleHowToUse() {
        const response = "To use RailSathi, just enter your 10-digit PNR and tap check status. You can also use the AR mode or press the emergency button anytime.";
        this.speak(response);
    }

    handleCheckPnr() {
        this.speak("Please tell me your 10-digit PNR number.");
        
        // Start new recognition for PNR number
        const pnrRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        pnrRecognition.lang = 'en-US';
        pnrRecognition.onresult = (event) => {
            const pnr = event.results[0][0].transcript.replace(/\D/g, '');
            if (pnr.length === 10) {
                document.getElementById('pnr-input').value = pnr;
                this.speak(`I've entered PNR ${pnr}. Checking status now.`);
                document.getElementById('check-status').click();
            } else {
                this.speak("That doesn't look like a valid PNR. Please try again.");
            }
        };
        pnrRecognition.start();
    }

    handleOpenArMode() {
        this.speak("Opening AR mode now.");
        window.location.href = 'ar.html';
    }

    handleHelp() {
        const response = "You can ask me to check your PNR, open AR mode, or tell you how to use this website.";
        this.speak(response);
    }
}

// Initialize voice command handler
const voiceHandler = new VoiceCommandHandler();
const voiceModal = document.getElementById('voice-modal');
const enableVoiceBtn = document.getElementById('enable-voice');
const disableVoiceBtn = document.getElementById('disable-voice');

// Show modal on page load if voice supported
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Show modal after slight delay for better UX
    setTimeout(() => {
        voiceModal.style.display = 'block';
    }, 1000);
} else {
    voiceStatus.textContent = "Voice commands not supported in this browser";
    setMicState('disabled');
}

// Handle modal buttons
enableVoiceBtn.addEventListener('click', () => {
    voiceModal.style.display = 'none';
    voiceHandler.speak("Voice assistant enabled. You can say commands like 'Check my train' or 'Open AR mode'.");
    voiceStatus.textContent = "Listening...";
    voiceHandler.recognition.start();
});

disableVoiceBtn.addEventListener('click', () => {
    voiceModal.style.display = 'none';
    voiceStatus.textContent = "Click microphone to use voice commands";
});

// Visual feedback for voice state
function setMicState(state) {
    voiceButton.classList.remove('listening', 'disabled');
    if (state === 'listening') {
        voiceButton.classList.add('listening');
        // Pulse animation
        voiceButton.style.animation = 'pulse 1.5s infinite';
    } else if (state === 'disabled') {
        voiceButton.classList.add('disabled');
        voiceButton.style.animation = 'none';
    } else {
        voiceButton.style.animation = 'none';
    }
}

// Welcome message on page load
window.addEventListener('load', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        voiceHandler.speak("Welcome to RailSathi. You can use voice commands by clicking the microphone button.");
        voiceStatus.textContent = "Click microphone to use voice commands";
    } else {
        voiceStatus.textContent = "Voice commands not supported in this browser";
        setMicState('disabled');
    }
});

    // Set up microphone button
    // Ensure voiceButton exists before adding event listener
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            if (!voiceButton) {
                console.error('Voice button not found');
                return;
            }
            console.log('Voice button clicked - Event listener triggered');
            voiceStatus.textContent = 'Initializing voice recognition...';
            console.log('Voice button clicked - Starting diagnostics');
        
            try {
                // Check Web Speech API support
                const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
                console.log('Web Speech API supported:', isSupported);
                if (!isSupported) {
                    throw new Error('Web Speech API not supported in this browser');
                }

                // Check microphone permissions
                navigator.permissions.query({name: 'microphone'}).then(permissionStatus => {
                    console.log('Microphone permission state:', permissionStatus.state);
                    
                    if (permissionStatus.state === 'denied') {
                        throw new Error('Microphone access denied. Please enable in browser settings.');
                    }
                    
                    if (permissionStatus.state === 'prompt') {
                        voiceStatus.textContent = 'Please allow microphone access...';
                    }

                    // Start voice recognition
                    voiceHandler.recognition.start();
                    console.log('Voice recognition started successfully');
                    
                }).catch(err => {
                    console.error('Microphone permission error:', err);
                    voiceStatus.textContent = 'Error: ' + err.message;
                    voiceOutput.textContent = 'Please enable microphone permissions';
                    throw err;
                });
                
            } catch (error) {
                console.error('Voice command initialization failed:', error);
                voiceStatus.textContent = 'Error: ' + error.message;
                voiceOutput.textContent = 'Voice commands not working: ' + error.message;
                
                // Additional troubleshooting suggestions
                if (error.message.includes('HTTPS')) {
                    voiceOutput.textContent += '\nNote: Voice commands require HTTPS or localhost';
                }
            }
        });
    }
}

// Chat Interface Functionality
const chatButton = document.getElementById('chat-button');
const secondaryChatButton = document.getElementById('secondary-chat-button');
const chatContainer = document.getElementById('chat-container');
const closeChat = document.getElementById('close-chat');
const sendMessage = document.getElementById('send-message');
const userMessage = document.getElementById('user-message');
const chatMessages = document.getElementById('chat-messages');

// Toggle chat visibility
function toggleChat() {
    chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
}

chatButton.addEventListener('click', toggleChat);
secondaryChatButton.addEventListener('click', toggleChat);

closeChat.addEventListener('click', () => {
    chatContainer.style.display = 'none';
});

// Handle message sending
sendMessage.addEventListener('click', handleMessageSend);
userMessage.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleMessageSend();
});

function handleMessageSend() {
    const message = userMessage.value.trim();
    if (message) {
        // Display user message
        const userMsgElement = document.createElement('div');
        userMsgElement.className = 'message user-message';
        userMsgElement.textContent = message;
        chatMessages.appendChild(userMsgElement);
        
        // Clear input
        userMessage.value = '';
        
        // Auto-scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Show bot response
        setTimeout(() => {
            const botMsgElement = document.createElement('div');
            botMsgElement.className = 'message bot-message';
            botMsgElement.textContent = 'AI Assistant is under development. Please check back later.';
            chatMessages.appendChild(botMsgElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
}
