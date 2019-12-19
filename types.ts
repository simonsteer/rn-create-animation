import { EasingFunction, Animated } from 'react-native'
import { TRANSFORM_PROPERTIES } from './constants'
import createAnimation from './createAnimation'

export type TransformProperty = typeof TRANSFORM_PROPERTIES[number]

export type TransformMap<T extends any> = {
  [key in TransformProperty]: T
}

export type InitialTransformMap = Partial<TransformMap<[number]>>

type NextValue = number | ((previous: number) => number)

type SingleTransformConfiguration = {
  to: NextValue
  duration?: number
  easing?: EasingFunction
}

export type AnimationConfiguration = Partial<
  TransformMap<SingleTransformConfiguration>
>

export type AnimationSteps = (
  | AnimationConfiguration
  | Animated.CompositeAnimation
  | (Animated.CompositeAnimation & {
      steps: AnimationSteps
    })
)[]

export type ExtendedCompositeAnimation = ReturnType<typeof createAnimation>
