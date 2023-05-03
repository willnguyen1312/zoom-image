/** The options for creating a test suite with the describe function. */
import * as dntShim from "../../../../_dnt.test_shims.js";
export interface DescribeDefinition<T> extends Omit<dntShim.Deno.TestDefinition, "fn"> {
    fn?: () => void;
    /**
     * The `describe` function returns a `TestSuite` representing the group of tests.
     * If `describe` is called within another `describe` calls `fn`, the suite will default to that parent `describe` calls returned `TestSuite`.
     * If `describe` is not called within another `describe` calls `fn`, the suite will default to the `TestSuite` representing the global group of tests.
     */
    suite?: TestSuite<T>;
    /** Run some shared setup before all of the tests in the suite. */
    beforeAll?: ((this: T) => void | Promise<void>) | ((this: T) => void | Promise<void>)[];
    /** Run some shared teardown after all of the tests in the suite. */
    afterAll?: ((this: T) => void | Promise<void>) | ((this: T) => void | Promise<void>)[];
    /** Run some shared setup before each test in the suite. */
    beforeEach?: ((this: T) => void | Promise<void>) | ((this: T) => void | Promise<void>)[];
    /** Run some shared teardown after each test in the suite. */
    afterEach?: ((this: T) => void | Promise<void>) | ((this: T) => void | Promise<void>)[];
}
/** The options for creating an individual test case with the it function. */
export interface ItDefinition<T> extends Omit<dntShim.Deno.TestDefinition, "fn"> {
    fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>;
    /**
     * The `describe` function returns a `TestSuite` representing the group of tests.
     * If `it` is called within a `describe` calls `fn`, the suite will default to that parent `describe` calls returned `TestSuite`.
     * If `it` is not called within a `describe` calls `fn`, the suite will default to the `TestSuite` representing the global group of tests.
     */
    suite?: TestSuite<T>;
}
/** The names of all the different types of hooks. */
export type HookNames = "beforeAll" | "afterAll" | "beforeEach" | "afterEach";
/**
 * A group of tests.
 */
export interface TestSuite<T> {
    symbol: symbol;
}
/**
 * An internal representation of a group of tests.
 */
export declare class TestSuiteInternal<T> implements TestSuite<T> {
    symbol: symbol;
    protected describe: DescribeDefinition<T>;
    protected steps: (TestSuiteInternal<T> | ItDefinition<T>)[];
    protected hasOnlyStep: boolean;
    constructor(describe: DescribeDefinition<T>);
    /** Stores how many test suites are executing. */
    static runningCount: number;
    /** If a test has been registered yet. Block adding global hooks if a test has been registered. */
    static started: boolean;
    /** A map of all test suites by symbol. */
    static suites: Map<symbol, TestSuiteInternal<any>>;
    /** The current test suite being registered. */
    static current: TestSuiteInternal<any> | null;
    /** The stack of tests that are actively running. */
    static active: symbol[];
    /** This is used internally for testing this module. */
    static reset(): void;
    /** This is used internally to register tests. */
    static registerTest(options: dntShim.Deno.TestDefinition): void;
    /** Updates all steps within top level suite to have ignore set to true if only is not set to true on step. */
    static addingOnlyStep<T>(suite: TestSuiteInternal<T>): void;
    /** This is used internally to add steps to a test suite. */
    static addStep<T>(suite: TestSuiteInternal<T>, step: TestSuiteInternal<T> | ItDefinition<T>): void;
    /** This is used internally to add hooks to a test suite. */
    static setHook<T>(suite: TestSuiteInternal<T>, name: HookNames, fn: (this: T) => void | Promise<void>): void;
    /** This is used internally to run all steps for a test suite. */
    static run<T>(suite: TestSuiteInternal<T>, context: T, t: dntShim.Deno.TestContext): Promise<void>;
    static runTest<T>(t: dntShim.Deno.TestContext, fn: (this: T, t: dntShim.Deno.TestContext) => void | Promise<void>, context: T, activeIndex?: number): Promise<void>;
}
