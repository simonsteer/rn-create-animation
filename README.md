# rn-create-animation

quickly create and compose animations in React Native, without the overhead of managing animated values and their interpolations

## basic usage

```
const myAnimation = createAnimation({
  steps: [
    {
      rotate: { to: 360 },
      translateX: { to: 100, easing: Easing.sin }
    },
    { scale: { to: 1, duration: 600 } },
  ],
})

...

<MyComponent style={{ transform: myAnimation.transform }} />

...

animation.start()
```

## default transforms

You can define default transforms for you animations to start on. The defaults are all 0, except for scale/scaleX/scaleY, where the default is 1.

```
const myAnimation = createAnimation({
  initialTransforms: { scale: [0.5], rotate: [180] },
  steps: [
    { scale: { to: 1 } },
  ],
})
```

## combining animations

In the event that you need separate animations to be ran in sequence for a single component later on, you can combine them.

Note that initial transforms for the animations combined together will be ignored, so you will have to define new defaults on the combined animation.

```
const slideInFromLeft = createAnimation({
  initialTransforms: { translateX: [100] },
  steps: [{ translateX: { to: 0, duration: 400 } }],
})

const pulse = createAnimation({
  steps: [
    { scale: { to: 1.2, duration: 150 } },
    { scale: { to: 1, duration: 150 } },
  ],
})

const slideInFromLeftThenPulse = createAnimation({
    initialTransforms: { translateX: [100] },
    steps: [slideInFromLeft, pulse]
})
```

## duplicating animations

Sometimes you will need duplicates of an animation – for example, when two components need to animate identically but at different times.

```
const myAnimation = createAnimation({
  steps: [{ rotate: { to: 360 } }],
})

const myAnimationDuplicate = myAnimation.duplicate()
```

## reusing interpolations

```
const myAnimation = createAnimation({
  steps: [{ rotate: { to: 360 }, scale: { to: 2 } }],
})

const { scale } = myAnimation.interpolations

<Animated.View style={{ transform: myAnimation.transform }} />
<Animated.View style={{ transform: [{ scale }] }} />

```

## usage with Animated API

The return value of `createAnimation` conains the type signature of `Animated.CompositeAnimation`, so it can be passed around as such.

```
const myAnimation = createAnimation({
  steps: [{ rotate: { to: 360 } }],
})

...

Animated.loop(myAnimation).start()
```

You can also include animated compositions made with the raw Animated API in the steps of your created animation.

```
const rawAnimation = Animated.timing(myAnimatedValue, {
    toValue: 4,
    duration: 1000,
    easing: Easing.sin,
    useNativeDriver: true
})

const myAnimation = createAnimation({
  steps: [
    { scale: { to: 1.5 } },
    Animated.delay(500),
    rawAnimation
  ],
})
```

## dynamic 'to' values

the `to` value passed to the transform configuration can also be a callback function which takes the current value of the transform snd returns a number. This is especially useful if you want combined animations to rely on the previous values of a transform.

```
// So you can write this:

const spinWithDelay = createAnimation({
  steps: [
    { rotate: { to: curr => curr + 360 } },
    Animated.delay(1000),
  ],
})

const combinedAnimation = createAnimation({
    steps: [spinWithDelay, spinWithDelay, spinWithDelay]
})

// Instead of this:

const singleAnimation = createAnimation({
    steps: [
      { rotate: { to: 360 } },
      Animated.delay(1000),
      { rotate: { to: 720 } },
      Animated.delay(1000),
      { rotate: { to: 1080 } },
      Animated.delay(1000),
    ]
})
```
