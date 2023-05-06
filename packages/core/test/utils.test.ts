import fc from "fast-check"
import { faker } from "@faker-js/faker"
import { clamp, makeMaybeCallFunction } from "../src/utils"
import { it } from "vitest"

describe("clamp functions", () => {
  it("should work for value in between inclusively", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.datatype.number({ min, max })
        expect(clamp(value, min, max)).toBe(value)
      }),
    )
  })

  it("should work for value under bound", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.datatype.number({ min: Number.MIN_SAFE_INTEGER, max: min - 1 })
        expect(clamp(value, min, max)).toBe(min)
      }),
    )
  })

  it("should work for value upper bound", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.datatype.number({ min: max + 1, max: Number.MAX_SAFE_INTEGER })
        expect(clamp(value, min, max)).toBe(max)
      }),
    )
  })
})

describe("makeMaybeCallFunction function", () => {
  it("should call function based on predicate return value", () => {
    fc.assert(
      fc.property(fc.boolean(), (value) => {
        const mockFn = vi.fn()
        makeMaybeCallFunction(() => value, mockFn)()
        expect(mockFn).toHaveBeenCalledTimes(value ? 1 : 0)
      }),
    )
  })
})
