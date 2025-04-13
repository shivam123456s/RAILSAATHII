from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/voice-command', methods=['POST'])
def handle_voice_command():
    data = request.get_json()
    command = data.get('command', '').lower()
    
    # Define command responses
    responses = {
        'check my train status': {
            'reply': 'Please tell me your 10-digit PNR number.',
            'action': 'check_pnr'
        },
        'how to use railsathi': {
            'reply': 'RailSathi helps you check train status, navigate stations with AR, and get travel assistance. You can ask me about your journey or use the menu options.'
        },
        'open ar mode': {
            'reply': 'Opening AR navigation mode.',
            'action': 'open_ar'
        },
        'help': {
            'reply': 'You can ask me to: Check your train status, Open AR mode, or explain how to use RailSathi.'
        }
    }

    # Find matching command
    response = {'reply': "That feature is under development."}
    for cmd, resp in responses.items():
        if cmd in command:
            response = resp
            break

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
