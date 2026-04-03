from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/add', methods=['GET'])
def add_numbers():
    try:
        num1 = int(request.args.get('n1'))
        num2 = int(request.args.get('n2'))
        result = num1 + num2
        return jsonify({'result': result})
    except (TypeError, ValueError):
        return jsonify({'error': 'Please provide valid numbers n1 and n2'}), 400

if __name__ == '__main__':
    app.run(debug=True)