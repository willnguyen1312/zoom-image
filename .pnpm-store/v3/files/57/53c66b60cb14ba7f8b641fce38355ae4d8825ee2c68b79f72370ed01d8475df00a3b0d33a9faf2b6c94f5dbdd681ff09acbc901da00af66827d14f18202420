import type * as ts from 'typescript/lib/tsserverlibrary';
import { LanguageModule, LanguageServiceHost } from './types';
export type LanguageContext = ReturnType<typeof createLanguageContext>;
export declare function createLanguageContext(host: LanguageServiceHost, modules: {
    typescript?: typeof import('typescript/lib/tsserverlibrary');
}, languageModules: LanguageModule[]): {
    typescript: {
        languageServiceHost: ts.LanguageServiceHost;
    };
    virtualFiles: {
        allSources(): import("./virtualFiles").Source[];
        updateSource(fileName: string, snapshot: ts.IScriptSnapshot, languageId: string | undefined): import("./types").VirtualFile | undefined;
        deleteSource(fileName: string): void;
        getSource(fileName: string): import("./virtualFiles").Source | undefined;
        hasSource: (fileName: string) => boolean;
        getMirrorMap: (file: import("./types").VirtualFile) => import("./sourceMaps").MirrorMap | undefined;
        getMaps: (virtualFile: import("./types").VirtualFile) => [string, import("@volar/source-map").SourceMap<import("./types").FileRangeCapabilities>][];
        hasVirtualFile(fileName: string): boolean;
        getVirtualFile(fileName: string): readonly [import("./types").VirtualFile, import("./virtualFiles").Source] | readonly [undefined, undefined];
    };
};
