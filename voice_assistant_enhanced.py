
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/voice-command', methods=['POST'])
def handle_voice_command():
    try:
        if not request.is_json:
            logger.warning("Invalid content type")
            return jsonify({'error': 'Request must be JSON'}), 400
            
        data = request.get_json()
        if not data or 'command' not in data:
            logger.warning("Missing command in request")
            return jsonify({'error': 'Command is required'}), 400
            
        command = data.get('command', '').lower()
        logger.info(f"Processing command: {command}")
        
        responses = {
            'check my train status': {
                'reply': 'Please tell me your 10-digit PNR number.',
                'action': 'check_pnr'
            },
            'how to use railsathi': {
                'reply': 'RailSathi helps with train status, AR navigation, and travel assistance.'
            },
            'open ar mode': {
                'reply': 'Opening AR navigation mode.',
                'action': 'open_ar'
            },
            'help': {
                'reply': 'Available commands: Check train status, Open AR mode, Help'
            }
        }

        response = responses.get(command, {'reply': "That feature is under development."})
        logger.info(f"Returning response: {response}")
        return jsonify(response)

    except Exception as e:
        logger.error(f"Error processing command: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
