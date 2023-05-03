import { Segment } from '@volar/source-map';
import { FileRangeCapabilities } from '@volar/language-core';
import * as CompilerDOM from '@vue/compiler-dom';
import { VueCompilerOptions } from '../types';
type Code = Segment<FileRangeCapabilities>;
export declare function generate(ts: typeof import('typescript/lib/tsserverlibrary'), vueCompilerOptions: VueCompilerOptions, sourceTemplate: string, sourceLang: string, templateAst: CompilerDOM.RootNode, hasScriptSetupSlots: boolean, sharedTypesImport: string, cssScopedClasses?: string[]): {
    codes: Code[];
    formatCodes: Code[];
    cssCodes: Code[];
    tagNames: Record<string, number[]>;
    identifiers: Set<string>;
    hasSlot: boolean;
};
export declare function walkElementNodes(node: CompilerDOM.RootNode | CompilerDOM.TemplateChildNode, cb: (node: CompilerDOM.ElementNode) => void): void;
export {};
