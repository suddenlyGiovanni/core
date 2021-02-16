/* adapted from https://github.com/gcanti/fp-ts */

/**
 * Data structure which represents non-empty arrays
 */

import * as A from "../Array"
import type { Predicate, Refinement } from "../Function"
import type { MutableRecord } from "../Mutable"
import type { Option } from "../Option"
import { none, some } from "../Option"

export type NonEmptyArray<A> = A.Array<A> & {
  readonly 0: A
}

/**
 * Append an element to the front of an array, creating a new non empty array
 *
 * @example
 * assert.deepStrictEqual(cons(1, [2, 3, 4]), [1, 2, 3, 4])
 */
export const cons_: <A>(tail: A.Array<A>, head: A) => NonEmptyArray<A> = A.cons_ as any

/**
 * Append an element to the front of an array, creating a new non empty array
 */
export const cons: <A>(
  head: A
) => (tail: A.Array<A>) => NonEmptyArray<A> = A.cons as any

/**
 * Append an element to the end of an array, creating a new non empty array
 *
 * @example
 * assert.deepStrictEqual(snoc([1, 2, 3], 4), [1, 2, 3, 4])
 */
export const snoc_: <A>(init: A.Array<A>, end: A) => NonEmptyArray<A> = A.snoc_ as any

/**
 * Append an element to the end of an array, creating a new non empty array
 */
export const snoc: <A>(end: A) => (init: A.Array<A>) => NonEmptyArray<A> = A.snoc as any

/**
 * Builds a `ReadonlyNonEmptyArray` from an array returning `none` if `as` is an empty array
 */
export function fromArray<A>(as: A.Array<A>): Option<NonEmptyArray<A>> {
  return A.isNonEmpty(as) ? some(as) : none
}

/**
 * Takes the first element
 */
export function head<A>(nea: NonEmptyArray<A>): A {
  return nea[0]
}

/**
 * Takes the last element
 */
export function tail<A>(nea: NonEmptyArray<A>): A.Array<A> {
  return nea.slice(1)
}

/**
 * Reverse the array
 */
export const reverse: <A>(nea: NonEmptyArray<A>) => NonEmptyArray<A> = A.reverse as any

/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @example
 * assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['foo', 'bar', 'foobar']), {
 *   '3': cons('foo', ['bar']),
 *   '6': cons('foobar', [])
 * })
 */
export function groupBy<A>(
  f: (a: A) => string
): (as: A.Array<A>) => Record<string, NonEmptyArray<A>> {
  return (as) => groupBy_(as, f)
}

/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 */
export function groupBy_<A>(
  as: A.Array<A>,
  f: (a: A) => string
): Record<string, NonEmptyArray<A>> {
  const r: MutableRecord<string, Array<A> & { 0: A }> = {}
  for (const a of as) {
    const k = f(a)
    // eslint-disable-next-line no-prototype-builtins
    if (r.hasOwnProperty(k)) {
      r[k]!.push(a)
    } else {
      r[k] = [a]
    }
  }
  return r
}

/**
 * Takes the last element
 */
export function last<A>(nea: NonEmptyArray<A>): A {
  return nea[nea.length - 1]!
}

/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @example
 * assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
 * assert.deepStrictEqual(init([1]), [])
 */
export function init<A>(nea: NonEmptyArray<A>): A.Array<A> {
  return nea.slice(0, -1)
}

/**
 * Insert an element at the specified index, creating a new array,
 * or returning None if the index is out of bounds
 */
export function insertAt<A>(
  i: number,
  a: A
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>> {
  return A.insertAt(i, a) as any
}

/**
 * Insert an element at the specified index, creating a new array,
 * or returning None if the index is out of bounds
 */

export function insertAt_<A>(
  nea: NonEmptyArray<A>,
  i: number,
  a: A
): Option<NonEmptyArray<A>> {
  return A.insertAt_(nea, i, a) as any
}

/**
 * Change the element at the specified index,
 * creating a new array, or returning None if the index is out of bounds
 */
export function updateAt<A>(
  i: number,
  a: A
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>> {
  return A.updateAt(i, a) as any
}

/**
 * Change the element at the specified index,
 * creating a new array, or returning None if the index is out of bounds
 */
export function updateAt_<A>(
  nea: NonEmptyArray<A>,
  i: number,
  a: A
): Option<NonEmptyArray<A>> {
  return A.updateAt_(nea, i, a) as any
}

/**
 * Apply a function to the element at the specified index,
 * creating a new array, or returning None if the index is out of bounds
 */
export function modifyAt<A>(
  i: number,
  f: (a: A) => A
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>> {
  return A.modifyAt(i, f) as any
}

/**
 * Apply a function to the element at the specified index,
 * creating a new array, or returning None if the index is out of bounds
 */
export function modifyAt_<A>(
  nea: NonEmptyArray<A>,
  i: number,
  f: (a: A) => A
): Option<NonEmptyArray<A>> {
  return A.modifyAt_(nea, i, f) as any
}

/**
 * Filters the array
 */
export function filter<A, B extends A>(
  refinement: Refinement<A, B>
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
export function filter<A>(
  predicate: Predicate<A>
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>>
export function filter<A>(
  predicate: Predicate<A>
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>> {
  return (nea) => filter_(nea, predicate)
}

/**
 * Filters the array
 */
export function filter_<A, B extends A>(
  nea: NonEmptyArray<A>,
  refinement: Refinement<A, B>
): Option<NonEmptyArray<A>>
export function filter_<A>(
  nea: NonEmptyArray<A>,
  predicate: Predicate<A>
): Option<NonEmptyArray<A>>
export function filter_<A>(
  nea: NonEmptyArray<A>,
  predicate: Predicate<A>
): Option<NonEmptyArray<A>> {
  return fromArray(A.filter_(nea, predicate))
}

/**
 * Filters the array also passing element index
 */
export function filterWithIndex<A>(
  predicate: (i: number, a: A) => boolean
): (nea: NonEmptyArray<A>) => Option<NonEmptyArray<A>> {
  return (nea) => fromArray(nea.filter((a, i) => predicate(i, a)))
}

/**
 * Filters the array also passing element index
 */
export function filterWithIndex_<A>(
  nea: NonEmptyArray<A>,
  predicate: (i: number, a: A) => boolean
): Option<NonEmptyArray<A>> {
  return fromArray(nea.filter((a, i) => predicate(i, a)))
}

/**
 * Construct an array with a single element
 */
export const single: <A>(a: A) => NonEmptyArray<A> = A.single as any

/**
 * Concatenate arrays
 */
export function concat_<A>(fx: A.Array<A>, fy: NonEmptyArray<A>): NonEmptyArray<A>
export function concat_<A>(fx: NonEmptyArray<A>, fy: A.Array<A>): NonEmptyArray<A>
export function concat_<A>(fx: A.Array<A>, fy: A.Array<A>): A.Array<A> {
  return fx.concat(fy)
}

/**
 * Concatenate arrays
 */
export function concat<A>(fy: NonEmptyArray<A>): (fx: A.Array<A>) => NonEmptyArray<A>
export function concat<A>(fy: A.Array<A>): (fx: A.Array<A>) => NonEmptyArray<A>
export function concat<A>(fy: A.Array<A>): (fx: A.Array<A>) => A.Array<A> {
  return (fx) => fx.concat(fy)
}

/**
 * Apply a function to pairs of elements at the same index in two arrays,
 * collecting the results in a new array. If one input array is short, excess
 * elements of the longer array are discarded.
 */
export const zipWith_: <A, B, C>(
  fa: NonEmptyArray<A>,
  fb: NonEmptyArray<B>,
  f: (a: A, b: B) => C
) => NonEmptyArray<C> = A.zipWith_ as any

/**
 * Apply a function to pairs of elements at the same index in two arrays,
 * collecting the results in a new array. If one input array is short, excess
 * elements of the longer array are discarded.
 */
export const zipWith: <A, B, C>(
  fb: NonEmptyArray<B>,
  f: (a: A, b: B) => C
) => (fa: NonEmptyArray<A>) => NonEmptyArray<C> = A.zipWith as any

/**
 * Takes two arrays and returns an array of corresponding pairs.
 * If one input array is short, excess elements of the longer array are discarded
 */
export const zip_: <A, B>(
  fa: NonEmptyArray<A>,
  fb: NonEmptyArray<B>
) => NonEmptyArray<readonly [A, B]> = A.zip_ as any

/**
 * Takes two arrays and returns an array of corresponding pairs.
 * If one input array is short, excess elements of the longer array are discarded
 */
export const zip: <B>(
  fb: NonEmptyArray<B>
) => <A>(fa: NonEmptyArray<A>) => NonEmptyArray<readonly [A, B]> = A.zip as any

/**
 * The function is reverse of zip. Takes an array of pairs
 * and return two corresponding arrays
 */
export const unzip: <A, B>(
  as: NonEmptyArray<readonly [A, B]>
) => readonly [NonEmptyArray<A>, NonEmptyArray<B>] = A.unzip as any

/**
 * Classic Applicative's ap
 */
export const ap: <A>(
  fa: NonEmptyArray<A>
) => <B>(fab: NonEmptyArray<(a: A) => B>) => NonEmptyArray<B> = A.ap as any

/**
 * Classic Applicative's ap
 */
export const ap_: <A, B>(
  fab: NonEmptyArray<(a: A) => B>,
  fa: NonEmptyArray<A>
) => NonEmptyArray<B> = A.ap_ as any

/**
 * Composes computations in sequence, using the return value
 * of one computation to determine the next computation.
 */
export const chain: <A, B>(
  f: (a: A) => NonEmptyArray<B>
) => (ma: NonEmptyArray<A>) => NonEmptyArray<B> = A.chain as any

/**
 * Composes computations in sequence, using the return value
 * of one computation to determine the next computation.
 */
export const chain_: <A, B>(
  ma: NonEmptyArray<A>,
  f: (a: A) => NonEmptyArray<B>
) => NonEmptyArray<B> = A.chain_ as any

/**
 * Like chain but ignores output
 */
export const tap: <A, B>(
  f: (a: A) => NonEmptyArray<B>
) => (ma: NonEmptyArray<A>) => NonEmptyArray<A> = A.tap as any

/**
 * Like chain but ignores output
 */
export const tap_: <A, B>(
  ma: NonEmptyArray<A>,
  f: (a: A) => NonEmptyArray<B>
) => NonEmptyArray<A> = A.tap_ as any

/**
 * Array[A] => Array[Array[A]]
 */
export const duplicate: <A>(
  ma: NonEmptyArray<A>
) => NonEmptyArray<NonEmptyArray<A>> = A.duplicate as any

/**
 * Extends calls f with all the progressive slices up to the current
 * element's index, and uses the return value to construct the result array
 *
 * i.e: like map that also consumes all the elements up to `i`
 */
export const extend: <A, B>(
  f: (fa: NonEmptyArray<A>) => B
) => (ma: NonEmptyArray<A>) => NonEmptyArray<B> = A.extend as any

/**
 * Extends calls f with all the progressive slices up to the current
 * element's index, and uses the return value to construct the result array
 *
 * i.e: like map that also consumes all the elements up to `i`
 */
export const extend_: <A, B>(
  ma: NonEmptyArray<A>,
  f: (fa: NonEmptyArray<A>) => B
) => NonEmptyArray<B> = A.extend_ as any

/**
 * Removes one level of nesting
 */
export const flatten: <A>(
  mma: NonEmptyArray<NonEmptyArray<A>>
) => NonEmptyArray<A> = A.flatten as any

/**
 * Apply f to every element of Array returning Array
 */
export const map: <A, B>(
  f: (a: A) => B
) => (fa: NonEmptyArray<A>) => NonEmptyArray<B> = A.map as any

/**
 * Apply f to every element of Array returning Array
 */
export const map_: <A, B>(
  fa: NonEmptyArray<A>,
  f: (a: A) => B
) => NonEmptyArray<B> = A.map_ as any

/**
 * Like map but also passes the index to f
 */
export const mapWithIndex: <A, B>(
  f: (i: number, a: A) => B
) => (fa: NonEmptyArray<A>) => NonEmptyArray<B> = A.mapWithIndex as any

/**
 * Like map but also passes the index to f
 */
export const mapWithIndex_: <A, B>(
  fa: NonEmptyArray<A>,
  f: (i: number, a: A) => B
) => NonEmptyArray<B> = A.mapWithIndex_ as any

/**
 * Construct B by compacting with f over the array from left to right
 */
export const reduce: <A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (fa: NonEmptyArray<A>) => B = A.reduce as any

/**
 * Construct B by compacting with f over the array from left to right
 */
export const reduce_: <A, B>(
  fa: NonEmptyArray<A>,
  b: B,
  f: (b: B, a: A) => B
) => B = A.reduce_ as any

/**
 * Construct B by compacting with f over the array from right to left
 */
export const reduceRight: <A, B>(
  b: B,
  f: (a: A, b: B) => B
) => (fa: NonEmptyArray<A>) => B = A.reduceRight as any

/**
 * Construct B by compacting with f over the array from right to left
 */
export const reduceRight_: <A, B>(
  fa: NonEmptyArray<A>,
  b: B,
  f: (a: A, b: B) => B
) => B = A.reduceRight_ as any

/**
 * Construct B by compacting with f over the array from right to left
 */
export const reduceRightWithIndex: <A, B>(
  b: B,
  f: (i: number, a: A, b: B) => B
) => (fa: NonEmptyArray<A>) => B = A.reduceRightWithIndex as any

/**
 * Construct B by compacting with f over the array from right to left
 */
export const reduceRightWithIndex_: <A, B>(
  fa: NonEmptyArray<A>,
  b: B,
  f: (i: number, a: A, b: B) => B
) => B = A.reduceRightWithIndex_ as any

/**
 * Construct B by compacting with f over the array from left to right
 */
export const reduceWithIndex: <A, B>(
  b: B,
  f: (i: number, b: B, a: A) => B
) => (fa: NonEmptyArray<A>) => B = A.reduceWithIndex as any

/**
 * Construct B by compacting with f over the array from left to right
 */
export const reduceWithIndex_: <A, B>(
  fa: NonEmptyArray<A>,
  b: B,
  f: (i: number, b: B, a: A) => B
) => B = A.reduceWithIndex_ as any

/**
 * Constructs a NonEmptyArray
 */
export function make<A>(arr: NonEmptyArray<A>): NonEmptyArray<A> {
  return arr
}
