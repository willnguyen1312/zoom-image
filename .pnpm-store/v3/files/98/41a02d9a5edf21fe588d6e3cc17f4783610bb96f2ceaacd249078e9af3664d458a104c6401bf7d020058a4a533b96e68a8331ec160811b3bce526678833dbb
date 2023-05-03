import type * as ts from 'typescript/lib/tsserverlibrary';
import type { VueCompilerOptions, TextRange } from '../types';
export interface ScriptSetupRanges extends ReturnType<typeof parseScriptSetupRanges> {
}
export declare function parseScriptSetupRanges(ts: typeof import('typescript/lib/tsserverlibrary'), ast: ts.SourceFile, vueCompilerOptions: VueCompilerOptions): {
    importSectionEndOffset: number;
    bindings: TextRange[];
    withDefaultsArg: TextRange | undefined;
    defineProps: TextRange | undefined;
    propsAssignName: string | undefined;
    propsRuntimeArg: TextRange | undefined;
    propsTypeArg: TextRange | undefined;
    slotsTypeArg: TextRange | undefined;
    emitsAssignName: string | undefined;
    emitsRuntimeArg: TextRange | undefined;
    emitsTypeArg: TextRange | undefined;
    emitsTypeNums: number;
    exposeRuntimeArg: TextRange | undefined;
    defineProp: {
        name: TextRange | undefined;
        nameIsString: boolean;
        type: TextRange | undefined;
        defaultValue: TextRange | undefined;
        required: boolean;
    }[];
};
export declare function parseBindingRanges(ts: typeof import('typescript/lib/tsserverlibrary'), sourceFile: ts.SourceFile, isType: boolean): TextRange[];
export declare function findBindingVars(ts: typeof import('typescript/lib/tsserverlibrary'), left: ts.BindingName, sourceFile: ts.SourceFile): TextRange[];
export declare function getStartEnd(node: ts.Node, sourceFile: ts.SourceFile): {
    start: number;
    end: number;
};
