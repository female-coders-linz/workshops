
# T-Rex Jump & run game 

Today we will build the infamous T-Rex Jump & Run from Google Chrome's offline page. We will base our implementation on [the amazing Youtube tutorial from Ania Kubów](https://www.youtube.com/watch?v=dQ6lYd6dyTI&t=1253s). If you didn't do so already check out her Youtube channel she has more fun tutorials for programming fun games with JavaScript. 

To refresh our memories there are plenty versions of the Dino game out ther for example [this one](https://elgoog.im/t-rex/). 

## Setting up our files 

As usual we will start by setting up our files. The entrypoint of the website is the `index.html`, in this file we have to add references to our stylsheet `dino.css` and our JavaScript file `dino.js`. We will include them based on their relative path from the location of the `index.html` file, in case those files are in the same folder all we need is the file name. 

```html
<head>
  <link rel="stylesheet" href="dino.css"></link>
  <script src="dino.js" charset="utf-8"></script>
</head>
``` 

In order to test that our files are linked correctly we add some arbitary code to our JavaScript and CSS file. We will add an `alert("Hello T-Rex")` in the Javascript file and a `body { background-color: hotpink; }` to our css file. When we open our `index.html` file in the browser we should se a pink background and an alert popping up. 

## T-Rex

### Adding our Dino 

For a start we will add some HTML markup to our websites body in the `index.html` file. We need a container tag that wil contain all of our games elements - like our dino and any obstacles. And we will add another container for our dino. We will use `div` tags for our containers. 

```html
    <div class="grid">
      <div class="dino"></div>
    </div>
```

⚠️ Make sure to place the dino conatiner inside the grid container and mark the containers by giving them specific CSS classes. We will need those css classes to style the elements accordingly and for accessing them from our JavaScript code. 

If we save and reload the page now we have no visible changes but we should see those elements if we inspect the HTML markup. In order to have our dino visible we will add some CSS in our `dino.css`. Let's start by defining it's size and giving it a background-color to make it visible. 

```css
.dino {
  width: 60px;
  height: 60px;
  background-color: red;
}
```

💡 The .dino is a CSS class selector. It will apply the styles on all elements that have the css class "dino". You can read more about CSS selectors on [W3Schools](https://www.w3schools.com/cssref/css_selectors.asp).

Now we will se a red square on the top left corner of our webpage. We actually would like to see it on the bottom left corner so we will change the positioning to be absolute by adding the following two lines.

```css
.dino {
  position: absolute;
  bottom: 0px;
}
```

⚠️ Absolute positioning places the content of an element relative to the closest positioned parent, if no parent is positioned it places it relative to the body. With top, left, right, bottom you can then specify the offset of the elment from the respective side inside the parent element. A positioned element is any element that specifies a "position:" css attribute to something else than static. You can read more about CSS positioning on [W3Schools](https://www.w3schools.com/Css/css_positioning.asp).

After this change our dino appears on the bottom left corner - exactly where we wanted it, perfect. 

### Letting our Dino jump

Next we will code some logic. We will let our T-Rex jump when we press the key up on our keyboard. 
For that we need to listen to the `keydown` event, that is triggered whenever a key is pressed. The event is triggered for all keys on our keyboard and we can differentiate between the keys being pressed by accessing the `key` variable on the event.

```js
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        console.log('jump up!');
    }
});
```

Now in order to move our dinosaur upwards we need to get a reference to the DOM element containing it. 
We can get a reference to an element from the document by calling the `querySelector` method.
Let's add this line right before we register our event listener: 

```js
const dino = document.querySelector('.dino');
```

💡 document has two methods available - `querySelector` and `querySelectorAll`. `querySelector` will return a reference to the first element matching the given selector whereas `querySelectorAll` will return a list of all matching elements. 

Now we can use this element to change it's position in a jump by setting the `bottom` attribute we also used in our CSS, so instead of logging 'jump up' to the console in our keydown eventhandler we modify the dinos bottom style property.

```js
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        dino.style.bottom = '100px';
    }
});

```

Now if we reload the page and hit the space key - we probably can't see our dino moving upward but see an error in our console instead, claiming the dino object to be null.. 

⚠️ That's because we try to load the dino with `document.querySelector('.dino')` before the HTML is built actually and then this selector returns nothing. 
In order to fix that we will wrap our code in a event listener that listens on the document ready - this event will be fired once the full HTML has been rendered initially. 

```javascript
document.addEventListener('DOMContentLoaded', () => {
   // all of our existing code
});
```

Once we've moved our existing code inside this event listener we can see our dino jump up once we press the space bar. 

### Slowing the jump down

But we actually don't want this harsh movement - we want our T-Rex to move up gracefully.💃
To do so we will not increase the bottom at once but do it in steps and wait a little in between those steps. 
We will do that by using `setInterval`. 

```js
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        let position = 0; 
        let upMovement = setInterval(() => {
            position += 30;
            dino.style.bottom = position + 'px';
        }, 20);
    }
});
```

💡 With setInterval we can create a recurring event that will happen with an interval of the given number inbetween any two calls. It returns us its unique ID and we will keep it so that we can stop this recurring action in the game over logic. 

Now when we press the space bar our dino flies up to the cyling and doesn't stop - we should stop it from jumping at a specific point and let it fall again. To stop it from jumping at a specific point we will just check if the position variable has passed a specific threshold inside our recurring action. In case we reached that interval we need to stop the recurring action by using `clearInterval`. 

```js
    if (position >= 150) {
        clearInterval(upMovement);
    }
```

After we've stopped the upMovement, we should actually start the down movement. 

```js
if (position >= 150) {
    clearInterval(upMovement);
    let downMovement = setInterval(() => {
        position -= 30;
        dino.style.bottom = position + 'px';
    }, 20)
}
```

We have the same problem now as before where we moved upwards without stopping, we now move downwards without stopping, we an switch that again by checking if we are already almost at our bottom.

```js
if (position <= 0) {
    clearInterval(downMovement);
}
```

### Adding gravity 

The current look and feel is not really what a jump looks like, a jump is not that linear. If you've been part of one of the CSS animations sessions you might remember the `ease-in` or `ease-out` transitions. We want to accomplish something similar. We want to start our jump quickly and get slower over time, and we want to start our decrease slow and get faster over time. 

We will do this be multiplying our position with a `speed` variable of 0.90 after we applied our jump step which will move the positions closer towards each other at the end of the jump (before we fall down again). 

So in our `downMovement` and `upMovement` before we set the position value onto the dinos bottom style property we modify the value by multiplying it with our speed. To get a better look and feel we additionally change the stepsize for the upwards movement to 20 and for the downwards movement to 10.

```js
position = position * 0.9;
```

This gives us more pleasing jump physics. 

### Adding the dino image and jump sound

In the assets folder we have a sound file called `dino-jump.ogx` and an image of the google chrome T-Rex in `t-rex.png`. We will use those two assets to make our dino feel perfect. 

In our CSS file we can just reference the image as the background image for our dino element. 

```css
.dino {
  background-image: url("assets/t-rex.png");
}
```

⚠️ This line should replace the background-color line from before! 

And we will load our audio file in our javascript code and play it when we hit the space bar. We can load a sound file by creating an instance of `Audio` and we can play that sound file by invoking the `.play()` method on it.

```js
// other code
const dinoJumpSound = new Audio('assets/dino-jump.ogx');

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        dinoJumpSound.play();
        // other code
```

## Obstacles

### Generating Cacti to jump over

We will create a function to create cacti for us. Our obstacles should start about a thousand pixels to the right of our dino. 
We will use the `document.createElement` function to create a new DOM element and append it as a child to our grid, in order to be able to do so we need to fetch a reference to the grid by using the query selector. 

```js
const grid = document.querySelector('.grid');

function generateCacti() {
    const cacti = document.createElement('div');
    cacti.classList.add('cacti');
    grid.appendChild(cacti);
    cacti.style.left = '1500px';
}

generateCacti();
```

Now we can not yet see our cacti but we should se the HTML markup of it being added when we inspect the code. In order to see our element we need to add some CSS styling. The cacti will get the same size as the dino for now, be positioned absoultely and at the bottom as well as get a green background color. 

```css
.cacti {
    width: 60px;
    height: 60px;
    background-color: green;
    position: absolute;
    bottom: 0px;
}
```

### Moving the cacti 

Quite similar to how me moved our dino upwards we will move our cacti to the left over time. Instead of modifiying the `bottom` style property of the dino we will modify the `left` style property of the cacti. 

```js
let cactiPosition = 1500;
let leftMovement = setInterval(() => {
    cactiPosition -= 9;
    cacti.style.left = cactiPosition + 'px';
}, 20);
``` 

For our cacti it is fine if movese outside so for the sake of simplicity we will leave it as is. 

### Recognizing a game over

But we need to stop our cacti and actually everything from moving once our game is over. We loose if our dino touches the cacti, we can simply calculate that with our left and bottom stlye properties. If the cacti is in between the left values 0 and 60px and the dinos bottom property is below 60px the two are touching. 

In order for that to work we need to be able to access the dinos position from inside of our `generateCacti` function. To enable that we will move the declaration of our variable outside of the function and also rename it to `dinoPosition` for more clearity.
In our `leftMovement` for the cacti we can add a check for these conditions and stop the movement if the game is supposed to be over. 

```js
if (cactiPosition < 60 && cactiPosition > 0 && dinoPosition < 60) {
    clearInterval(leftMovement);
}
```

But not the dino can still jump, and we do not really want that, also we would like to show a game over once we've lost. 
To prevent the dino from jumping we will introduce a `gameOver` flag, initialize it with false and enable the jump functionality only if this flag is false. Of course we need to set this flag to true once we lose. 

```js
if (cactiPosition < 60 && cactiPosition > 0 && dinoPosition < 60) {
    clearInterval(leftMovement);
    gameOver = true;
}
``` 

```js
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !gameOver) {
        // jump
    }
}
``` 

To display the game over from our images we will add a new `img` tag with the class `gameOver` in our grid. To properly place it we will apply some CSS styling and we will also set `display: none` to hide it at the start of the game. 

```html
<div class="grid">
    <img src="assets/game-over.png" class="gameOver">
    <div class="dino"></div>
</div>
```

```css
.gameOver {
    position: absolute;
    top: 50px;
    left: 750px;
    display: none;
}
``` 

When the game actually is over all we have to do is modify the `display` style of the gameOver element.

```js
const gameOverImg = document.querySelector('.gameOver');
...
 if (cactiPosition < 60 && cactiPosition > 0 && dinoPosition < 60) {
    clearInterval(leftMovement);
    gameOver = true;  
    gameOverImg.style.display = 'inline-block';
 }
```

### Generating more cacti 

So for now we only generated one cacti but we actually want them to appear randomly. We can do that by calculating a random time and using JavaScripts `setTimeout` function to invoke the `generateCacti` function again after that amount of time. 

```js
function generateCacti() {
    // actual cacti generation & movement
    let randomTime = 1000 + Math.random() * 2500;
    setTimeout(generateCacti, randomTime);
}
```
Now our cactis still move and are generated after our game is over, let's fix that by clearing the interval `leftMovement` if the game is over and only perform the code inside `generateCacti` if the game is not yet over. 

```js
    function generateCacti() {
        if (!gameOver) {
            // cacti generation
            let leftMovement = setInterval(() => {
                // cacti movement and game over detection
                if (gameOver) {
                    clearInterval(leftMovement);
                }
            }, 20);
            // new call to generateCacti
        }
    }
```

### Using the cacti background image and playing the game over sound

Actually using the cacti image is just one line our css file 
```css
    background-image: url("assets/cacti.png");
```

To display the game over sound we'll do the same as for the jumping sound - creating an `Audio` object with our relative path and invoking the `play` method on it once the game is over.

## Moving background

One last thing to improve the visuals of our game is including a sliding background which is the essence of any jump and run game. We will do this by using CSS animations.

To begin we will just show our background image in a repeated manner by using the image as the background-image for a new tag with the class `desert` that will wrap our `grid` in the HTML 

```html
<body>
    <div class="desert">
        <div class="grid">
            <div class="dino"></div>
        </div>
    </div>
</body>
```

```js
 .desert {
    position: absolute;
    bottom: 100px;
    background-image: url('assets/t-rex-background.png');
    background-repeat: repeat-x;
    width: 100%;
    height: 200px;
  }
```
We should now see our background image but it does not move yet. In order for it to move we wil provide a CSS animation that will move the background image of the desert element. 

By defining an animation that will move the position of the background-image we get our sliding background. What happens here is best visible if we set the `background-repeat` property to `no-repeat`. We tell our animation to start at the very right (at a 100% of the width) and move to the very left (at 0% of our width). By telling our animation to repeat infinitely the image reappears again at the right after it has reached the left side of the screen.

```css
@keyframes slideright {
    from {
        background-position: 100%;
    }
    to {
        background-position: 0%;
    }
}

 .desert {
    animation: slideright 1500ms infinite;
 }
```

The default CSS transition performs this easing out at the end but we want our transtion to be linear so we can just specify that transition type. 

```css
 .desert {
    animation: slideright 3000ms infinite linear;
 }
```

By using `background-repat: repeat-x` again we always have a full background that slides to the left. We should play around with the timing here so that it fits the speed of our cacti well, for me it looks fine for 3000ms but that might be different for you. 

### Stop the movement on the Game Over 

To stop the movement on the game over we need to fetch the desert element and manipulate the `animationPlayState` of the element when we recognize a game over.

```js
const background = document.querySelector('.desert');
...
if (cactiPosition < 60 && cactiPosition > 0 && dinoPosition < 60) {
    clearInterval(leftMovement);
    gameOver = true;  
    gameOverImg.style.display = 'inline-block';
    background.style.webkitAnimationPlayState = 'paused';
 }
```

## Adding the score 

The score in the classical T-Rex jump game are the passed deci seconds. A deci second is a tenth of a second so for each passed second we will get 10 points. 

Let's add a div in our grid on the top right corner to display our current score. 

```html
<div class="desert">
    <div class="grid">
        <span class="score"></span>
        <img src="assets/game-over.png" class="gameOver">
        <div class="dino"></div>
    </div>
</div>
```

In order to move it to the top right corner we will again use absolute positioning

```css
.score {
    position: absolute;
    right: 30px;
    top: 30px;
}
```

### Increasing and showing the score with JavaScript 

In our JavaScript file we will again fetch a reference to the HTML element with our specific class `score`. Moreover we will create a function that updates the score elements inner HTML every decisecond. One deci second is 100 milliseconds and `setInterval` receives the time between funciton calls in milliseconds. 

```js
const scoreField = document.querySelector('.score');
let score = 0;
let increaseScore = setInterval(() => {
    score++;
    scoreField.innerHTML = score;
}, 100);
```

In the original T-Rex Run the high score is always shown with 5 digits so let's do that as well

```js
const scoreField = document.querySelector('.score');
let score = 0;
let increaseScore = setInterval(() => {
    score++;
    scoreField.innerHTML = score.toString().padStart(5, '0');
}, 100);
```

Looks good but our score still increases when we've lost the game so we will have to check if our game is actually over already and clear the interval for the increaseScore if that is the case.

```js
let increaseScore = setInterval(() => {
    score++;
    scoreField.innerHTML = score.toString().padStart(5, '0');
    if (gameOver) {
        clearInterval(increaseScore);
    }
}, 100);
```

For a final fishing touch we will use a custom pixel font to display our score because it just looks better! 

```css
@font-face {
    font-family: pixelfont;
    src: url('assets/Pixeboy-z8XGD.ttf');
}

.score {
    font-family: pixelfont;
    font-size: 25px;
}
```
