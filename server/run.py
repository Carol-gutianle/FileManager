from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from generate import generate

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('../ui/index.html')

def filterNode(repath:str):
    pass

@app.route('/getTree', methods=['POST'])
def getTree():
    path = request.form['path']
    try:
        generate(path)
        response = {
            'status': 'success',
            'message': 'OK',
            'data': {
                'path': path
            }
        }
    except:
        response = {
            'status': 'fail',
            'message': 'Bad',
            'data': {
                'path': path
            }
        }
    return jsonify(response)
    
@app.route('/delete', methods=['POST'])
def sendList():
    data = request.get_json()
    arr = data['items']
    length = len(arr)
    print(arr)
    return jsonify({'length': length})

if __name__ == '__main__':
    app.run()