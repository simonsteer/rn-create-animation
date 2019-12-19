import { Animated } from 'react-native'
import { TRANSFORM_PROPERTIES } from './constants'
import {
  AnimationSteps,
  AnimationConfiguration,
  TransformProperty,
  TransformMap,
} from './types'

export const unpackSteps = (
  stepsToUnpack: AnimationSteps
): (AnimationConfiguration | Animated.CompositeAnimation)[] =>
  stepsToUnpack.reduce(
    (acc, step) =>
      'steps' in step
        ? acc.concat(...unpackSteps(step.steps))
        : acc.concat(step),
    []
  )

export const createValuesMap = <
  D extends (k?: TransformProperty) => any,
  R extends ReturnType<D>
>(
  value: D
) =>
  TRANSFORM_PROPERTIES.reduce((acc, key) => {
    acc[key] = value(key)
    return acc
  }, ({} as unknown) as TransformMap<R>)

export const createDefaultOutputMap = () =>
  createValuesMap(prop => (/scale/.test(prop) ? [1] : [0]))

export const createInitialAnimatedValuesMap = () =>
  createValuesMap(() => new Animated.Value(0))
