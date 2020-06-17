# flask Web Server

## Prerequisites
  * [Python 3](https://www.python.org/downloads/)
  * IDE of your choice (e.g. [Visual Studio Code](https://code.visualstudio.com/Download), incl. python extension)

## Steps to execute

### Hello world
  1. install flask `pip3 install flask`
  1. create new folder `flask_web_server`
  1. create new file `app.py` in this folder and enter the following lines:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
  return 'Hello world'

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')
```

Now, run your program. Then in a browser open `localhost:5000`. Congratulations - you just ran your (first) web server!

### Add a page
Add the following code block to your `app.py` file.
```python
@app.route('/list')
def to_do_list():
    return 'My To-Do List'
```

Now, run your program. Then in a browser open `localhost:5000/list`.

Also try out a request to localhost:5000/list using Postman - keep on doing that througout the tutorial.

### Use a HTML file
Create a new folder `templates`.
Add a new `index.html` file in there:
```html
<!DOCTYPE html>
<html>

	<head>
		<title>To-Do List</title>
		<meta charset="UTF-8" />
	</head>

	<body>
		<div id="todoList">
			<div id="myDIV" class="header">
				<h1>To-Do List</h1>
     
			</div>
				
			<ul id="todoItems">
	            <li>
	                <div class='divToDoItems'>
	                    <p>Hit the gym</p>
	                </div>
	            </li>
	            <li>
	                <div class='divToDoItems'>
	                    <p>Go to female coders study group</p>
	                </div>
	            </li>
			</ul>
		</div>
	</body>
</html>
```

import `render_template` function from flask and render the index.html file in:
```python
from flask import Flask, render_template

...
@app.route('/', method=['GET'])
def index():
    return render_template('index.html')
```

If you now go to `localhost:5000` your index.html file should be shown. You see that some styling is missing which we will add in the following step.

### Make it fancy using CSS

# TODO change reference for css to flask server project
Create a new folder `static`, inside this folder create a `style.css` file with the content available in styles.css on [GitHub](https://github.com/female-coders-linz/workshops/tree/master/flask_web_server/static/styles.css). Also download the `background.jpg` from the [static folder](https://github.com/female-coders-linz/workshops/tree/master/flask_web_server/static) and store it in the `static` folder. 

You can now link the CSS file in your index html using `url_for` in your link reference:
```html
<link rel="stylesheet" href="{{ url_for('static', filename= 'style.css') }}">
```

If you now go to your website (`localhost:5000`) it looks much prettier. 

### Make it dynamic

So far, the content on the website is static, usually you want to make it more interactive and dynamic (like the majority of the websites do).

As a first step, we want to make it "your own" To-Do list and show a custom name.

```html
<!DOCTYPE html>
<html>

	<head>
		<title>Page</title>
		<meta charset="UTF-8" />
		<link rel="stylesheet" href="{{ url_for('static', filename= 'style.css') }}">
	</head>

	<body>
        <h1>Page<h1>
	</body>
</html>
```

In your app.py file change your `to_do_list` function to also accept a parameter called `name`:
```python
@app.route('/list/<name>', method=['GET'])
def to_do_list(name):
    return render_template('custom.html', user=name)
```
Through `<name>` in the app route it accepts a parameter called `name` (must be available, so `/list` does not work anymore). This dynamic value you cann now pass to your `custom.html` file, where you can use it using `{{user}}`, e.g. you could now change you `custom.html` file like to display the name with `<h1>{{user}}'s To-Do List</h1>`.

As we use the `custom.html` file also for the landing page, where you can enter without a user name (general To-Do list) we don't want to display an `'s`. For this we can add an if-statement in the html:

```html
<title>{{user}} Page</title>
...
<h1>{% if user %}{{user}}'s{% endif %} Page</h1>
```

### Persist your list

So far we show a html file, but except for the user the content is still static. So, let's leverage the power of a web server and make sure your To-Do items are saved.

  1. We first need to load our To-Do list items from a file instead of the html file. Create a new folder `data` and add a new file `items.csv` with the following content (for every To-Do item, we have an id and a title):
  ```
  id,title
  1,Do homework
  2,Go Shopping
  ```
  2. Now we want to use the `items.csv` as an input for our To-Do list website. For easy .csv read we use `pandas`. Install this package with `pip3 install pandas`. Import the package in your `app.py`:
  ```python
  import pandas as pd
  ```
  3. In your `app.py` add a new function to read the existing To-Do items from the .csv file we just created:
  ```python
  DATA_DIR='data'
  ITEM_FILE = 'items.csv' 

  def get_file_path(): 
    return f'{DATA_DIR}/{ITEM_FILE}'

  def get_list_items():
    return pd.read_csv(get_file_path())
  ```
  *Make sure you run your script from the flask_web_server folder, otherwise it won't find the items.csv file*
  4. Call this function whenever you want to get all items and provide it to the .html file, e.g. for the `/` route add
  ```python
  list_items = get_list_items()
  return render_template('index.html', items=list_items)
  ```
  Through providing the to-do items by passing a parameter `items` you can work with this in the .html file.
  5. Now we have the `items` available in the HTML file. What is left is adding a list item per To-Do List item:
  ```html
  {% for index, item in items.iterrows() %}
  <li>
      <div class='divToDoItems'>
          <p>{{item['title']}}</p>
  </li>
  {% endfor %}
  ```
  6. Now we also want to be able to dynamically add items to the list through our input field. There is already a form provided, which uses the text which is inputted and tries to send through a POST-quest (`<form method="post">`) to the endpoint where the HTML file is shown (so in our case either localhost:5000 or localhost:5000/list/<name>).
  We have only enabled GET-requests so far. In order to allow the user to add items, we have to also handle POST-requests and read the content of the request. In your `app.py` enable POST requests to the sites, where you want the user to add To-Do list items, e.g.:
  ```python
  @app.route('/', methods=['POST'])
  ```
  7. Now you allow POST-requests to this endpoint. Now you have to deal with POST requests accordingly - in our case we want to add the new item.
  ```python
  from flask import request, redirect, url_for

  ...

  
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

  @app.route('/', methods=['POST'])
  def index():
    add_list_item(request.form)
    return redirect(url_for('.index'))
    ...

  ```

  To send this POST-request, add a form in the `index.html` in the div `myDIV`
  ```html
  <form method="post">
      <div class='divAddItem'>
          <input type="text" id="todoItemInput" name='title' placeholder="Title..." 
              value="" required>
          <button type="submit" class='addBtn'>Add item</button>
      </div>
  </form> 
```
   You can also try it out in Postman.

  8. We can now add new items. Let's let us delete items which we finished now. In your `app.py` add a function to delete an item by id:
  ```python
  def delete_list_item(item_id):
    items = get_list_items()
    items = items.loc[items.id != item_id]

    save_items(items=items)
  ```
  And add an endpoint to delete an item:
  ```python
  @app.route('/<int:id>/delete', methods=['POST'])
  def delete(id):
      delete_list_item(item_id=id)

      return redirect(url_for('.index'))
  ``` 
  The only thing which is left is to call the endpoint to delete the item as soon as the user pressed the `x` button. For this we add a HTML form in the `index.html`, instead of `<input class='close' type="submit" value="x">`:
  ```html
  <form method="post" action="{{ url_for('delete', id=item['id']) }}">
      <input type="text" class="hidden" name="user" value="{{ user }}">
      <input class='close' type="submit" value="x">
  </form>
  ```
  Through `action="{{ url_for('delete', id=item['id']) }}"` the endpoint `/delete` is called and a parameter `id` is passed along.

### Bonus 

Adapt the web server so each user can store their own To-Do list items. Have fun! 

