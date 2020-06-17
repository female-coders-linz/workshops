import os
import pandas as pd

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

DATA_DIR='data'
ITEM_FILE = 'items.csv'

def get_file_path(user=None):
    if user:
        # get file where items for a specific user are stored
        filename= f'{user}_{ITEM_FILE}' 
    else:
        filename=ITEM_FILE    
    
    return f'{DATA_DIR}/{filename}'

def get_list_items(user=None):
    file_dir = get_file_path(user)

    if not os.path.exists(file_dir):
        return pd.DataFrame({}, columns=['id', 'title'])

    return pd.read_csv(file_dir)


def save_items(items, user):
    file_dir = get_file_path(user)
    items.to_csv(file_dir, index=False)


def add_list_item(item):
    user = item['user'] if item['user'] != '' else None

    items = get_list_items(user)
    max_id = 0
    if len(items) > 0:
        max_id=max(items['id']) 

    items = items.append({'id':max_id+1, 'title': item['title']}, ignore_index=True)

    save_items(items, user)


def delete_list_item(item_id, user):
    items = get_list_items(user)
    items = items.loc[items.id != item_id]

    save_items(items=items, user=user)


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

    list_items = get_list_items(user=name)

    return render_template('index.html', user=name, items=list_items)


@app.route('/<int:id>/delete', methods=['POST'])
def delete(id):
    user = request.form['user'] if request.form['user'] != '' else None
    delete_list_item(item_id=id, user=user)

    if user:
        return redirect(f'{request.host_url}list/{user}')

    return redirect(url_for('.index'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
