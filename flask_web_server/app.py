import pandas as pd

from flask import Flask, render_template
from flask import request, redirect, url_for

app = Flask(__name__)

DATA_DIR='data'
ITEM_FILE = 'items.csv' 

def get_file_path(): 
    return f'{DATA_DIR}/{ITEM_FILE}'

def get_list_items():
    return pd.read_csv(get_file_path())

def save_items(items):
    file_dir = get_file_path() 
    items.to_csv(file_dir, index=False)

def add_list_item(item):    
    items = get_list_items()

    max_id = 0
    if len(items) > 0:
        max_id=max(items['id']) 

    items = items.append({'id':max_id+1, 'title': item['title']}, ignore_index=True)

    save_items(items)

def delete_list_item(item_id):
    items = get_list_items()
    items = items.loc[items.id != item_id]

    save_items(items=items)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        add_list_item(request.form)
        return redirect(url_for('.index'))

    list_items = get_list_items()
    return render_template('index.html', items=list_items)

@app.route('/list/<name>', methods=['GET', 'POST'])
def to_do_list(name):
    if request.method == 'POST':
        add_list_item(request.form)
        return redirect(request.url)
    
    list_items = get_list_items()
    return render_template('index.html', items=list_items, user=name)

@app.route('/<int:id>/delete', methods=['POST'])
def delete(id):
    delete_list_item(item_id=id)

    # always redirects to landing page!
    return redirect(url_for('.index'))

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')