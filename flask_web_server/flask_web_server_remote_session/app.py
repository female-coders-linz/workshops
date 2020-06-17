from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'] )
def post_index():
    print('post request received')
    print(request.form['title'])

    return render_template('index.html', new_title=request.form['title'])

@app.route('/list/<name>')
def show_list(name):
    return render_template('custom.html', user=name)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')