declare const NO_DATA_SYMBOL: unique symbol;
export type Segment<T = typeof NO_DATA_SYMBOL> = WithString<T extends typeof NO_DATA_SYMBOL ? [
    string,
    string | undefined,
    number | [number, number]
] : [
    string,
    string | undefined,
    number | [number, number],
    T
]>;
type WithString<T> = T | string;
export declare function getLength(segments: Segment<any>[]): number;
export declare function toString<T extends Segment<any>>(segments: T[]): string;
export declare function create(source: string): Segment[];
export declare function replace<T extends Segment<any>>(segments: T[], pattern: string | RegExp, ...replacers: (T | ((match: string) => T))[]): void;
export declare function replaceAll<T extends Segment<any>>(segments: T[], pattern: RegExp, ...replacers: (T | ((match: string) => T))[]): void;
export declare function replaceSourceRange<T extends Segment<any>>(segments: T[], source: string | undefined, startOffset: number, endOffset: number, ...newSegments: T[]): boolean;
export declare function replaceRange<T extends Segment<any>>(segments: T[], startOffset: number, endOffset: number, ...newSegments: T[]): void;
export {};
