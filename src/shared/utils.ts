/** Removes common leading whitespace from each line in a multiline string. */
export function dedent(str: string): string {
  const lines = str.split('\n')
  const indents = lines
    .filter(line => line.trim().length > 0) // Filter out blank lines
    .map(line => (/^ */.exec(line))?.[0].length ?? 0)
  const minIndent = Math.min(...indents)
  return lines.map(line => line.slice(minIndent)).join('\n').trim()
}

/**
 * Returns a validator object for the generic type `T`.
 *
 * At compile time the `check` method ensures that the given value conforms to `T`, while
 * preserving its inferred original type. It acts as the identity function, with no side effects.
 *
 * This is convenient for enforcing type conformance without losing specific structure—which
 * often happens with explicit type annotations or type assertions.
 *
 * @example
 * type MappedType = { [key: string]: number }
 * const v = conformance<MappedType>().check({ x: 0 }) // v is still of type { x: number }
 * conformance<string>().check(0) // Compile time error!
*/
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function conformance<T>() {
  return {
    check<S extends T>(value: S): S { return value },
  }
}

/** Determines whether any of `obj` values is `value`. */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function includesValue<Obj extends object, V extends Obj[keyof Obj]>(obj: Obj, value: V): boolean {
  return Object.values(obj).includes(value)
}

/** Returns the key in `obj` whose value strictly equals `value`, or `undefined` if there is none. */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function keyByValue<Obj extends object, V extends Obj[keyof Obj]>(obj: Obj, value: V): keyof Obj | undefined {
  return (Object.entries(obj) as [keyof Obj, V][])
    .find(([_, v]) => v === value)?.[0]
}

/** Returns an object with the same keys as `obj`, each mapped to its key name. */
export function keyMap<Obj extends object>(obj: Obj): { -readonly [K in keyof Obj]: K } {
  const result = {} as { -readonly [K in keyof Obj]: K }
  for (const key of Object.keys(obj) as (keyof Obj)[])
    result[key] = key
  return result
}
