# Dragon Loading 

The dragon consists of different images and we'll animate those images to get the pulsating effects. 
We took this beautiful example from this Github repository: https://github.com/devyumao/dragon-loading

## Dragon body 

We will start with the body. So we need to add a tag with class body to our HTML document and give it some styling. 
We will give our dragons body a fixed height and width and use our body image as the background for this css element. 

```css
.body {
  background: url(body.png) no-repeat center center;
  background-size: contain;
  width: 180px;
  height: 128px;
}
```

## Adding the dragons mouth

Next up we will add the mouth to our dragon. 

```css
.mouth {
  width: 78px;
  height: 56px;
  background: url(mouth.png) no-repeat;
  background-size: 100%;
}
```

But now our mouth is placed after the body while we actually want them to be positioned above each other. 
We can achieve that by changing our positioning inside the dragon container from relative to absolute. 

We will give our surrounding dragon div a fixed width and height and use absolute positining inside: 

```css
.dragon {
  width: 200px;
  height: 140px;
}

.body {
  position: absolute;
}

.mouth {
  position: absolute;
}
```

Now we can play around a little bit by offsetting the mouth with the top and left properties until it looks like we want it to look. 

```css
.mouth {
  top: 52px;
  left: 36px;
}
```

Next up is the animation for the mouth - to achieve this opening and closing animation we will use a `clip-path`. With a clip-path we can cut around a div in a specific shape, 
for example an ellipsoid and that's what we will do. 

```css
@keyframes openMouth {
  0% {
    clip-path: ellipse(20% 0% at 50% 0);
  }

  50% {
    clip-path: ellipse(100% 100% at 50% 0);
  }

  70% {
    clip-path: ellipse(100% 100% at 50% 0);
  }

  100% {
    clip-path: ellipse(20% 0% at 50% 0);
  }
}

.mouth {
  animation: openMouth 1s ease infinite;
}
```

💡 Ellipse is a basic-shape in CSS and has many use cases, there is also rect for rectangle, circle and many more. The first two parameters are the radi x and y and after the at you can specify an offset for the elliple to start. 

## GIving our dragon eyes 

Next up we will add the two eyes with our eye.png as the background image. 

```html
<div class="dragon">
  <div class="body"></div>
  <div class="mouth"></div>
  <div class="eye left-eye"></div>
  <div class="eye right-eye"></div>
</div>
```

```css
.eye {
  background: url(eye.png) no-repeat;
  background-size: 100%;
  width: 11px;
  height: 11px;
}
```

And now the placement of the eyes. We will again use the top and left properties to move the eyes to the position we like and additionally we will use the transform property on the right eye to mirror it. 

```css
.left-eye {
  position: absolute;
  top: 39px;
  left: 36px;
}

.right-eye {
  position: absolute;
  top: 39px;
  left: 99px;
  transform-origin: 50% 50%;
  transform: rotate(180deg);
}
```

## Make the dragon blush

Next up our dragon has these cute blushes - we will tackle them next. 
We will do something quite similar to what we did with the dragons eyes: 

```css 
.blush {
  width: 15px;
  height: 9px;
  background: url(blush.png) no-repeat;
  background-size: 100%;
}

.left-blush {
  position: absolute;
  top: 45px;
  left: 30px;
}

.right-blush {
  position: absolute;
  top: 45px;
  left: 103px;
}
```

⚠️Now we have a little problem that the blush is covering parts of our eyes and we actually want that to be the other way around. So we want to decide which HTML elements are above which other HTML element we can control that with the `z-index`- the higher the z-index the further on the front the element is. 

```css
.eye {
  z-index: 15;
}

.blush {
  z-index: 10;
}
```

The blushing is a quite easy animation to achieve with the opacity css property. The opacity determines, no surpise, how opace an HTML element is. 

```css
@keyframes blush {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.blush {
  animation: blush 1s ease infinite alternate;
}
```

💡 The alternate property will let the animation play forwards, then backwards, then forwards again and so on and so forth. We could also achieve the same kind of animation by setting the opacity to 1 at 50 % of the animation and to 0 again at 100 % of the animation. There are always multiple ways to achieve one look. 

## Spitting fire 

Next up we will add the fire that the dragon is spitting from its mouth. 
The fire acutally has two parts we want to animate - on the one side it's getting opaque during it's movement and on the other side we move it upwards. 
We will use two divs for that purpose 

```html
  <div class="fire-container">
    <div class="fire">
    </div>
  </div>
```

The fire div will get our image attached and needs some positioning. 

```css
.fire-container {
  position: absolute;
  top: 50px;
  left: 60px;
}

.fire {
  width: 40px;
  height: 60px;
  background: url(fire.png) no-repeat;
  background-size: 100%;
}
```

The first part of our animation is the growing of the fire and that it's getting more and more opaque. 

```css
@keyframes fire {
  0%,
  20% {
    transform: scale(0, 0);
    opacity: 0.8;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    transform: scale(1, 1);
    opacity: 0;
  }
}

.fire {
  animation: fire 1s ease-out infinite;
}
``` 

The scale property can be used to scale the element from its original size on the x and y axis. There are also scaleX and scaleY properties to only scale on one of those axis.

```css
@keyframes fireUp {
  0% {
    top: 70px;
  }

  20% {
    top: 70px;
  }

  100% {
    top: -80px;
  }
}

.fireUp {
  animation: fireUp 1s ease-in infinite;
}
```

💡 Ease in/ ease out specify the transition speed. A nice visualisation can be found here: https://www.w3schools.com/css/tryit.asp?filename=trycss3_transition_speed
Easing in means that the animation will start slowly and get faster over time, easing out means it will start quickly and get slower over time.

## Fixing the placement of the dragon 

Next we'll place our whole dragon centered on our page to better see our animation. 
We will use flex box for that. With `justify-content: center` we will center it vertically and with `align-items: center` we will center it horizontally. 
We need to make sure to make the parent container have a minimum height in order for the justify-content to work properly. 

```css
.dragon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.dragon {
  position: relative;
  width: 200px;
  height: 140px;
}
```

## Adding the tail 

Next up we will add the tail

```css
.tail {
  position: absolute;
  top: 67px;
  left: 120px;
  width: 40px;
  height: 38px;
  background: url(tail-sting.png) no-repeat;
  background-size: 100%;
}
``` 

The tail is animated a little to grow using again the scaleY property - in order for it to only grow in height, but not in width. 

```css
 @keyframes tailUp {
  0% {
    transform: scaleY(0.9);
  }

  100% {
    transform: scaleY(1.06);
  }
}

.tail {
  animation: tailUp 0.5s cubic-bezier(0.47, 0, 0.75, 0.72) infinite alternate;
}
```

## Adding the horns 

We will add the left horn with a 5 degree rotation. 

```css
.left-horn {
  position: absolute;
  top: -18px;
  left: 10px;
  width: 31px;
  height: 31px;
  background: url(horn-left.png) no-repeat;
  background-size: 100%;
  transform-origin: 150% 200%;
  transform: rotate(-5deg);
}
```

And the right horn with a 5 degree rotation in the other direction 

```css
.right-horn {
  position: absolute;
  top: -16px;
  left: 95px;
  width: 34px;
  height: 31px;
  background: url(horn-right.png) no-repeat;
  background-size: contain;
  transform-origin: -50% 200%;
  transform: rotate(5deg);
}
```

The horns have a swinging animation that we will add next 

```css
@keyframes swingRight {
  100% {
    transform: rotate(5deg);
  }
}

@keyframes swingLeft {
  100% {
    transform: rotate(-5deg);
  }
}

.left-horn {
  animation: swingRight 0.5s cubic-bezier(0.47, 0, 0.75, 0.72) infinite alternate;
}

.right-horn {
  animation: swingLeft 0.5s cubic-bezier(0.47, 0, 0.75, 0.72) infinite alternate;
}
```

## Pulsating dragon animation 

Last but not least we will add the animation for the whole dragon to scale a bit up and back down to achieve this pulsating animation. 

```css
@keyframes zoomIn {
  100% {
    transform: scale(1.16, 1.16);
  }
}

.dragon {
  animation: zoomIn .5s cubic-bezier(0.47, 0, 0.75, 0.72) infinite alternate;
}
```

And that's about it in the original example https://github.com/devyumao/dragon-loading a shadow below the dragon and a loading bar - feel free to extend it further. 