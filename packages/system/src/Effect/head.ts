// tracing: off

import { map_ as mapCause } from "../Cause"
import * as A from "../Collections/Immutable/Array"
import { pipe } from "../Function"
import * as O from "../Option"
import { foldCauseM_, halt, succeed } from "./core"
import type { Effect } from "./effect"
import { fail } from "./fail"

/**
 * Returns a successful effect with the head of the list if the list is
 * non-empty or fails with the error `None` if the list is empty.
 */
export function head<R, E, A>(
  self: Effect<R, E, readonly A[]>,
  __trace?: string
): Effect<R, O.Option<E>, A> {
  return foldCauseM_(
    self,
    (x) => halt(mapCause(x, O.some)),
    (x) =>
      pipe(
        x,
        A.head,
        O.fold(() => fail(O.none), succeed)
      ),
    __trace
  )
}
