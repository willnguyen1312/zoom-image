import fc from "fast-check"
import { faker } from "@faker-js/faker"
import { clamp, makeMaybeCallFunction } from "../src/utils"
import { makeCalculatePercentage } from "../src/makeCalculatePercentage"
import { makeCalculateZoom } from "../src/makeCalculateZoom"
import { it } from "vitest"

describe("clamp functions", () => {
  it("should work for value in between inclusively", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.number.int({ min, max })
        expect(clamp(value, min, max)).toBe(value)
      }),
    )
  })

  it("should work for value under bound", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.number.int({
          min: Number.MIN_SAFE_INTEGER,
          max: min - 1,
        })
        expect(clamp(value, min, max)).toBe(min)
      }),
    )
  })

  it("should work for value upper bound", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (first, second) => {
        const [min, max] = [Math.min(first, second), Math.max(first, second)]
        const value = faker.number.int({
          min: max + 1,
          max: Number.MAX_SAFE_INTEGER,
        })
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
        makeMaybeCallFunction(() => value, mockFn)(void 0)
        expect(mockFn).toHaveBeenCalledTimes(value ? 1 : 0)
      }),
    )
  })
})

describe("makeCalculatePercentage function", () => {
  it("should work as expected", () => {
    expect(makeCalculatePercentage(4)(1)).toMatchInlineSnapshot("0")
    expect(makeCalculatePercentage(4)(2)).toMatchInlineSnapshot(
      "33.33333333333333",
    )
    expect(makeCalculatePercentage(4)(3)).toMatchInlineSnapshot(
      "66.66666666666666",
    )
    expect(makeCalculatePercentage(4)(4)).toMatchInlineSnapshot("100")
  })
})

describe("makeCalculateZoom function", () => {
  it("should work as expected", () => {
    expect(makeCalculateZoom(4)(0)).toMatchInlineSnapshot("1")
    expect(makeCalculateZoom(4)(33.33333333333333)).toMatchInlineSnapshot(
      "1.9999999999999998",
    )
    expect(makeCalculateZoom(4)(66.66666666666666)).toMatchInlineSnapshot(
      "2.9999999999999996",
    )
    expect(makeCalculateZoom(4)(100)).toMatchInlineSnapshot("4")
  })
})
