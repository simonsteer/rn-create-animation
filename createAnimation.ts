import { Animated, TransformsStyle } from 'react-native'
import {
  AnimationSteps,
  TransformProperty,
  InitialTransformMap,
  TransformMap,
} from './types'
import { TRANSFORM_PROPERTIES } from './constants'
import {
  createDefaultOutputMap,
  createInitialAnimatedValuesMap,
  createValuesMap,
  unpackSteps,
} from './utils'

export default function createAnimation({
  steps,
  initialTransforms = {},
}: {
  steps: AnimationSteps
  initialTransforms?: InitialTransformMap
}) {
  const animatedValueMap = createInitialAnimatedValuesMap()
  const outputs = {
    ...createDefaultOutputMap(),
    ...initialTransforms,
  } as TransformMap<number[]>

  const unpackedSteps = unpackSteps(steps)

  const compositeAnimation = Animated.sequence(
    unpackedSteps.map(step => {
      if ('start' in step) {
        return step
      }

      return Animated.parallel(
        TRANSFORM_PROPERTIES.map(transformProperty => {
          const output = outputs[transformProperty]
          const currentValue = output[output.length - 1]
          const { duration = 300, easing = n => n, to = currentValue } =
            step[transformProperty] || {}

          const nextOutput = typeof to === 'function' ? to(currentValue) : to
          outputs[transformProperty].push(nextOutput)

          return Animated.timing(animatedValueMap[transformProperty], {
            toValue: outputs[transformProperty].length - 1,
            duration,
            easing,
            useNativeDriver: true,
          })
        })
      )
    })
  )

  const compositeTransform = TRANSFORM_PROPERTIES.map(property => {
    const outputRange = outputs[property]
    const inputRange = outputRange.map((_, i) => i)

    const interpolation = animatedValueMap[property].interpolate({
      inputRange,
      outputRange: /rotate/.test(property)
        ? outputRange.map(v => `${v}deg`)
        : outputRange,
    })

    return { [property]: interpolation }
  })

  const patchedReset = () => {
    for (const key in animatedValueMap) {
      animatedValueMap[key as TransformProperty].setValue(0)
    }
    ;(compositeAnimation as Animated.CompositeAnimation & {
      reset(): void
    }).reset()
  }

  return {
    ...compositeAnimation,
    reset: patchedReset,
    transform: (compositeTransform as unknown) as TransformsStyle['transform'],
    steps,
    interpolations: createValuesMap(
      prop => compositeTransform.find(t => !!t[prop])[prop]
    ),
    duplicate: () => createAnimation({ steps, initialTransforms }),
  }
}
