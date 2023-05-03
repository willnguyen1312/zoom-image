import { SourceMap } from '@volar/source-map';
import type * as ts from 'typescript/lib/tsserverlibrary';
import { MirrorMap } from './sourceMaps';
import type { FileRangeCapabilities, LanguageModule, VirtualFile } from './types';
export type VirtualFiles = ReturnType<typeof createVirtualFiles>;
export interface Source {
    fileName: string;
    snapshot: ts.IScriptSnapshot;
    root: VirtualFile;
    languageModule: LanguageModule;
}
export declare function createVirtualFiles(languageModules: LanguageModule[]): {
    allSources(): Source[];
    updateSource(fileName: string, snapshot: ts.IScriptSnapshot, languageId: string | undefined): VirtualFile | undefined;
    deleteSource(fileName: string): void;
    getSource(fileName: string): Source | undefined;
    hasSource: (fileName: string) => boolean;
    getMirrorMap: (file: VirtualFile) => MirrorMap | undefined;
    getMaps: (virtualFile: VirtualFile) => [string, SourceMap<FileRangeCapabilities>][];
    hasVirtualFile(fileName: string): boolean;
    getVirtualFile(fileName: string): readonly [VirtualFile, Source] | readonly [undefined, undefined];
};
export declare function forEachEmbeddedFile(file: VirtualFile, cb: (embedded: VirtualFile) => void): void;
