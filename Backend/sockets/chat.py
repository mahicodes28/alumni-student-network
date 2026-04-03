from flask_socketio import emit

def register_socket(socketio):

    @socketio.on('send_message')
    def handle_message(data):
        emit('receive_message', data, broadcast=True)