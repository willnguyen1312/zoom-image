import * as vue from '@volar/vue-language-core';
export declare function createLanguageService(host: vue.VueLanguageServiceHost, ts?: typeof import('typescript/lib/tsserverlibrary')): {
    __internal__: {
        languageService: import("typescript").LanguageService;
        context: {
            typescript: {
                languageServiceHost: import("typescript/lib/tsserverlibrary").LanguageServiceHost;
            };
            virtualFiles: {
                allSources(): vue.Source[];
                updateSource(fileName: string, snapshot: import("typescript/lib/tsserverlibrary").IScriptSnapshot, languageId: string | undefined): vue.VirtualFile | undefined;
                deleteSource(fileName: string): void;
                getSource(fileName: string): vue.Source | undefined;
                hasSource: (fileName: string) => boolean;
                getMirrorMap: (file: vue.VirtualFile) => vue.MirrorMap | undefined;
                getMaps: (virtualFile: vue.VirtualFile) => [string, vue.SourceMap<vue.FileRangeCapabilities>][];
                hasVirtualFile(fileName: string): boolean;
                getVirtualFile(fileName: string): readonly [vue.VirtualFile, vue.Source] | readonly [undefined, undefined];
            };
        };
    };
} & import("typescript").LanguageService;
