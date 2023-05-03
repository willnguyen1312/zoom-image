import * as ts from 'typescript';
import * as vue from '@volar/vue-language-core';
import * as vueTs from '@volar/vue-typescript';
export type Hook = (program: _Program) => void;
export type _Program = ts.Program & {
    __vue: ProgramContext;
};
interface ProgramContext {
    projectVersion: number;
    options: ts.CreateProgramOptions;
    languageServiceHost: vue.VueLanguageServiceHost;
    languageService: ReturnType<typeof vueTs.createLanguageService>;
}
export declare function createProgram(options: ts.CreateProgramOptions): _Program;
export {};
