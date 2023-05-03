/** A [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) interface
 * to `Deno.test()` API.
 *
 * With the `bdd.ts` module you can write your tests in a familiar format for
 * grouping tests and adding setup/teardown hooks used by other JavaScript testing
 * frameworks like Jasmine, Jest, and Mocha.
 *
 * The `describe` function creates a block that groups together several related
 * tests. The `it` function registers an individual test case.
 *
 * ## Hooks
 *
 * There are 4 types of hooks available for test suites. A test suite can have
 * multiples of each type of hook, they will be called in the order that they are
 * registered. The `afterEach` and `afterAll` hooks will be called whether or not
 * the test case passes. The *All hooks will be called once for the whole group
 * while the *Each hooks will be called for each individual test case.
 *
 * - `beforeAll`: Runs before all of the tests in the test suite.
 * - `afterAll`: Runs after all of the tests in the test suite finish.
 * - `beforeEach`: Runs before each of the individual test cases in the test suite.
 * - `afterEach`: Runs after each of the individual test cases in the test suite.
 *
 * If a hook is registered at the top level, a global test suite will be registered
 * and all tests will belong to it. Hooks registered at the top level must be
 * registered before any individual test cases or test suites.
 *
 * ## Focusing tests
 *
 * If you would like to run only specific test cases, you can do so by calling
 * `it.only` instead of `it`. If you would like to run only specific test suites,
 * you can do so by calling `describe.only` instead of `describe`.
 *
 * There is one limitation to this when using the flat test grouping style. When
 * `describe` is called without being nested, it registers the test with
 * `Deno.test`. If a child test case or suite is registered with `it.only` or
 * `describe.only`, it will be scoped to the top test suite instead of the file. To
 * make them the only tests that run in the file, you would need to register the
 * top test suite with `describe.only` too.
 *
 * ## Ignoring tests
 *
 * If you would like to not run specific individual test cases, you can do so by
 * calling `it.ignore` instead of `it`. If you would like to not run specific test
 * suites, you can do so by calling `describe.ignore` instead of `describe`.
 *
 * ## Sanitization options
 *
 * Like `Deno.TestDefinition`, the `DescribeDefinition` and `ItDefinition` have
 * sanitization options. They work in the same way.
 *
 * - `sanitizeExit`: Ensure the test case does not prematurely cause the process to
 *   exit, for example via a call to Deno.exit. Defaults to true.
 * - `sanitizeOps`: Check that the number of async completed ops after the test is
 *   the same as number of dispatched ops. Defaults to true.
 * - `sanitizeResources`: Ensure the test case does not "leak" resources - ie. the
 *   resource table after the test has exactly the same contents as before the
 *   test. Defaults to true.
 *
 * ## Permissions option
 *
 * Like `Deno.TestDefinition`, the `DescribeDefintion` and `ItDefinition` have a
 * `permissions` option. They specify the permissions that should be used to run an
 * individual test case or test suite. Set this to `"inherit"` to keep the calling
 * thread's permissions. Set this to `"none"` to revoke all permissions.
 *
 * This setting defaults to `"inherit"`.
 *
 * There is currently one limitation to this, you cannot use the permissions option
 * on an individual test case or test suite that belongs to another test suite.
 * That's because internally those tests are registered with `t.step` which does
 * not support the permissions option.
 *
 * ## Comparing to Deno\.test
 *
 * The default way of writing tests is using `Deno.test` and `t.step`. The
 * `describe` and `it` functions have similar call signatures to `Deno.test`,
 * making it easy to switch between the default style and the behavior-driven
 * development style of writing tests. Internally, `describe` and `it` are
 * registering tests with `Deno.test` and `t.step`.
 *
 * Below is an example of a test file using `Deno.test` and `t.step`. In the
 * following sections there are examples of how the same test could be written with
 * `describe` and `it` using nested test grouping, flat test grouping, or a mix of
 * both styles.
 *
 * ```ts
 * // https://deno.land/std@$STD_VERSION/testing/bdd_examples/user_test.ts
 * import {
 *   assertEquals,
 *   assertStrictEquals,
 *   assertThrows,
 * } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
 * import { User } from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";
 *
 * Deno.test("User.users initially empty", () => {
 *   assertEquals(User.users.size, 0);
 * });
 *
 * Deno.test("User constructor", () => {
 *   try {
 *     const user = new User("Kyle");
 *     assertEquals(user.name, "Kyle");
 *     assertStrictEquals(User.users.get("Kyle"), user);
 *   } finally {
 *     User.users.clear();
 *   }
 * });
 *
 * Deno.test("User age", async (t) => {
 *   const user = new User("Kyle");
 *
 *   await t.step("getAge", () => {
 *     assertThrows(() => user.getAge(), Error, "Age unknown");
 *     user.age = 18;
 *     assertEquals(user.getAge(), 18);
 *   });
 *
 *   await t.step("setAge", () => {
 *     user.setAge(18);
 *     assertEquals(user.getAge(), 18);
 *   });
 * });
 * ```
 *
 * ### Nested test grouping
 *
 * Tests created within the callback of a `describe` function call will belong to
 * the new test suite it creates. The hooks can be created within it or be added to
 * the options argument for describe.
 *
 * ```ts
 * // https://deno.land/std@$STD_VERSION/testing/bdd_examples/user_nested_test.ts
 * import {
 *   assertEquals,
 *   assertStrictEquals,
 *   assertThrows,
 * } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
 * import {
 *   afterEach,
 *   beforeEach,
 *   describe,
 *   it,
 * } from "https://deno.land/std@$STD_VERSION/testing/bdd.ts";
 * import { User } from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";
 *
 * describe("User", () => {
 *   it("users initially empty", () => {
 *     assertEquals(User.users.size, 0);
 *   });
 *
 *   it("constructor", () => {
 *     try {
 *       const user = new User("Kyle");
 *       assertEquals(user.name, "Kyle");
 *       assertStrictEquals(User.users.get("Kyle"), user);
 *     } finally {
 *       User.users.clear();
 *     }
 *   });
 *
 *   describe("age", () => {
 *     let user: User;
 *
 *     beforeEach(() => {
 *       user = new User("Kyle");
 *     });
 *
 *     afterEach(() => {
 *       User.users.clear();
 *     });
 *
 *     it("getAge", function () {
 *       assertThrows(() => user.getAge(), Error, "Age unknown");
 *       user.age = 18;
 *       assertEquals(user.getAge(), 18);
 *     });
 *
 *     it("setAge", function () {
 *       user.setAge(18);
 *       assertEquals(user.getAge(), 18);
 *     });
 *   });
 * });
 * ```
 *
 * ### Flat test grouping
 *
 * The `describe` function returns a unique symbol that can be used to reference
 * the test suite for adding tests to it without having to create them within a
 * callback. The gives you the ability to have test grouping without any extra
 * indentation in front of the grouped tests.
 *
 * ```ts
 * // https://deno.land/std@$STD_VERSION/testing/bdd_examples/user_flat_test.ts
 * import {
 *   assertEquals,
 *   assertStrictEquals,
 *   assertThrows,
 * } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
 * import {
 *   describe,
 *   it,
 * } from "https://deno.land/std@$STD_VERSION/testing/bdd.ts";
 * import { User } from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";
 *
 * const userTests = describe("User");
 *
 * it(userTests, "users initially empty", () => {
 *   assertEquals(User.users.size, 0);
 * });
 *
 * it(userTests, "constructor", () => {
 *   try {
 *     const user = new User("Kyle");
 *     assertEquals(user.name, "Kyle");
 *     assertStrictEquals(User.users.get("Kyle"), user);
 *   } finally {
 *     User.users.clear();
 *   }
 * });
 *
 * const ageTests = describe({
 *   name: "age",
 *   suite: userTests,
 *   beforeEach(this: { user: User }) {
 *     this.user = new User("Kyle");
 *   },
 *   afterEach() {
 *     User.users.clear();
 *   },
 * });
 *
 * it(ageTests, "getAge", function () {
 *   const { user } = this;
 *   assertThrows(() => user.getAge(), Error, "Age unknown");
 *   user.age = 18;
 *   assertEquals(user.getAge(), 18);
 * });
 *
 * it(ageTests, "setAge", function () {
 *   const { user } = this;
 *   user.setAge(18);
 *   assertEquals(user.getAge(), 18);
 * });
 * ```
 *
 * ### Mixed test grouping
 *
 * Both nested test grouping and flat test grouping can be used together. This can
 * be useful if you'd like to create deep groupings without all the extra
 * indentation in front of each line.
 *
 * ```ts
 * // https://deno.land/std@$STD_VERSION/testing/bdd_examples/user_mixed_test.ts
 * import {
 *   assertEquals,
 *   assertStrictEquals,
 *   assertThrows,
 * } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
 * import {
 *   describe,
 *   it,
 * } from "https://deno.land/std@$STD_VERSION/testing/bdd.ts";
 * import { User } from "https://deno.land/std@$STD_VERSION/testing/bdd_examples/user.ts";
 *
 * describe("User", () => {
 *   it("users initially empty", () => {
 *     assertEquals(User.users.size, 0);
 *   });
 *
 *   it("constructor", () => {
 *     try {
 *       const user = new User("Kyle");
 *       assertEquals(user.name, "Kyle");
 *       assertStrictEquals(User.users.get("Kyle"), user);
 *     } finally {
 *       User.users.clear();
 *     }
 *   });
 *
 *   const ageTests = describe({
 *     name: "age",
 *     beforeEach(this: { user: User }) {
 *       this.user = new User("Kyle");
 *     },
 *     afterEach() {
 *       User.users.clear();
 *     },
 *   });
 *
 *   it(ageTests, "getAge", function () {
 *     const { user } = this;
 *     assertThrows(() => user.getAge(), Error, "Age unknown");
 *     user.age = 18;
 *     assertEquals(user.getAge(), 18);
 *   });
 *
 *   it(ageTests, "setAge", function () {
 *     const { user } = this;
 *     user.setAge(18);
 *     assertEquals(user.getAge(), 18);
 *   });
 * });
 * ```
 *
 * @module
 */
import * as dntShim from "../../../../_dnt.test_shims.js";
import { DescribeDefinition, ItDefinition, TestSuite } from "./_test_suite.js";
export type { DescribeDefinition, ItDefinition, TestSuite };
/** The arguments for an ItFunction. */
export type ItArgs<T> = [options: ItDefinition<T>] | [
    name: string,
    options: Omit<ItDefinition<T>, "name">
] | [
    name: string,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>] | [
    name: string,
    options: Omit<ItDefinition<T>, "fn" | "name">,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [
    options: Omit<ItDefinition<T>, "fn">,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [
    options: Omit<ItDefinition<T>, "fn" | "name">,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [
    suite: TestSuite<T>,
    name: string,
    options: Omit<ItDefinition<T>, "name" | "suite">
] | [
    suite: TestSuite<T>,
    name: string,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [
    suite: TestSuite<T>,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [
    suite: TestSuite<T>,
    name: string,
    options: Omit<ItDefinition<T>, "fn" | "name" | "suite">,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [
    suite: TestSuite<T>,
    options: Omit<ItDefinition<T>, "fn" | "suite">,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
] | [
    suite: TestSuite<T>,
    options: Omit<ItDefinition<T>, "fn" | "name" | "suite">,
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>
];
/** Registers an individual test case. */
export interface it {
    <T>(...args: ItArgs<T>): void;
    /** Registers an individual test case with only set to true. */
    only<T>(...args: ItArgs<T>): void;
    /** Registers an individual test case with ignore set to true. */
    ignore<T>(...args: ItArgs<T>): void;
}
/** Registers an individual test case. */
export declare function it<T>(...args: ItArgs<T>): void;
export declare namespace it {
    var only: <T>(...args: ItArgs<T>) => void;
    var ignore: <T>(...args: ItArgs<T>) => void;
}
/** Run some shared setup before all of the tests in the suite. */
export declare function beforeAll<T>(fn: (this: T) => void | Promise<void>): void;
/** Run some shared teardown after all of the tests in the suite. */
export declare function afterAll<T>(fn: (this: T) => void | Promise<void>): void;
/** Run some shared setup before each test in the suite. */
export declare function beforeEach<T>(fn: (this: T) => void | Promise<void>): void;
/** Run some shared teardown after each test in the suite. */
export declare function afterEach<T>(fn: (this: T) => void | Promise<void>): void;
/** The arguments for a DescribeFunction. */
export type DescribeArgs<T> = [options: DescribeDefinition<T>] | [name: string] | [
    name: string,
    options: Omit<DescribeDefinition<T>, "name">
] | [name: string, fn: () => void] | [fn: () => void] | [
    name: string,
    options: Omit<DescribeDefinition<T>, "fn" | "name">,
    fn: () => void
] | [
    options: Omit<DescribeDefinition<T>, "fn">,
    fn: () => void
] | [
    options: Omit<DescribeDefinition<T>, "fn" | "name">,
    fn: () => void
] | [
    suite: TestSuite<T>,
    name: string
] | [
    suite: TestSuite<T>,
    name: string,
    options: Omit<DescribeDefinition<T>, "name" | "suite">
] | [
    suite: TestSuite<T>,
    name: string,
    fn: () => void
] | [
    suite: TestSuite<T>,
    fn: () => void
] | [
    suite: TestSuite<T>,
    name: string,
    options: Omit<DescribeDefinition<T>, "fn" | "name" | "suite">,
    fn: () => void
] | [
    suite: TestSuite<T>,
    options: Omit<DescribeDefinition<T>, "fn" | "suite">,
    fn: () => void
] | [
    suite: TestSuite<T>,
    options: Omit<DescribeDefinition<T>, "fn" | "name" | "suite">,
    fn: () => void
];
/** Registers a test suite. */
export interface describe {
    <T>(...args: DescribeArgs<T>): TestSuite<T>;
    /** Registers a test suite with only set to true. */
    only<T>(...args: DescribeArgs<T>): TestSuite<T>;
    /** Registers a test suite with ignore set to true. */
    ignore<T>(...args: DescribeArgs<T>): TestSuite<T>;
}
/** Registers a test suite. */
export declare function describe<T>(...args: DescribeArgs<T>): TestSuite<T>;
export declare namespace describe {
    var only: <T>(...args: DescribeArgs<T>) => TestSuite<T>;
    var ignore: <T>(...args: DescribeArgs<T>) => TestSuite<T>;
}
