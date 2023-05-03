"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLanguageService = void 0;
const ts = require("typescript"); // this is a peer dependency
const getProgram_1 = require("./getProgram");
const embedded = require("@volar/language-core");
function createLanguageService(host, mods) {
    const core = embedded.createLanguageContext(host, { typescript: ts }, mods);
    if (!ts) {
        throw new Error('TypeScript module not provided.');
    }
    const ls = ts.createLanguageService(core.typescript.languageServiceHost);
    return new Proxy({
        organizeImports,
        // only support for .ts for now, not support for .vue
        getDefinitionAtPosition,
        getDefinitionAndBoundSpan,
        getTypeDefinitionAtPosition,
        getImplementationAtPosition,
        findRenameLocations,
        getReferencesAtPosition,
        findReferences,
        // TODO: now is handled by vue server
        // prepareCallHierarchy: tsLanguageService.rawLs.prepareCallHierarchy,
        // provideCallHierarchyIncomingCalls: tsLanguageService.rawLs.provideCallHierarchyIncomingCalls,
        // provideCallHierarchyOutgoingCalls: tsLanguageService.rawLs.provideCallHierarchyOutgoingCalls,
        // getEditsForFileRename: tsLanguageService.rawLs.getEditsForFileRename,
        // TODO
        // getCodeFixesAtPosition: tsLanguageService.rawLs.getCodeFixesAtPosition,
        // getCombinedCodeFix: tsLanguageService.rawLs.getCombinedCodeFix,
        // applyCodeActionCommand: tsLanguageService.rawLs.applyCodeActionCommand,
        // getApplicableRefactors: tsLanguageService.rawLs.getApplicableRefactors,
        // getEditsForRefactor: tsLanguageService.rawLs.getEditsForRefactor,
        getProgram: () => (0, getProgram_1.getProgram)(ts, core, ls),
        __internal__: {
            context: core,
            languageService: ls,
        },
    }, {
        get: (target, property) => {
            if (property in target) {
                return target[property];
            }
            return ls[property];
        },
    });
    // apis
    function organizeImports(args, formatOptions, preferences) {
        let edits = [];
        const file = core.virtualFiles.getSource(args.fileName)?.root;
        if (file) {
            embedded.forEachEmbeddedFile(file, embeddedFile => {
                if (embeddedFile.kind === embedded.FileKind.TypeScriptHostFile && embeddedFile.capabilities.codeAction) {
                    edits = edits.concat(ls.organizeImports({
                        ...args,
                        fileName: embeddedFile.fileName,
                    }, formatOptions, preferences));
                }
            });
        }
        else {
            return ls.organizeImports(args, formatOptions, preferences);
        }
        return edits.map(transformFileTextChanges).filter(notEmpty);
    }
    function getReferencesAtPosition(fileName, position) {
        return findLocations(fileName, position, 'references');
    }
    function getDefinitionAtPosition(fileName, position) {
        return findLocations(fileName, position, 'definition');
    }
    function getTypeDefinitionAtPosition(fileName, position) {
        return findLocations(fileName, position, 'typeDefinition');
    }
    function getImplementationAtPosition(fileName, position) {
        return findLocations(fileName, position, 'implementation');
    }
    function findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename) {
        return findLocations(fileName, position, 'rename', findInStrings, findInComments, providePrefixAndSuffixTextForRename);
    }
    function findLocations(fileName, position, mode, findInStrings = false, findInComments = false, providePrefixAndSuffixTextForRename) {
        const loopChecker = new Set();
        let symbols = [];
        withMirrors(fileName, position);
        return symbols.map(s => transformDocumentSpanLike(s)).filter(notEmpty);
        function withMirrors(fileName, position) {
            if (loopChecker.has(fileName + ':' + position))
                return;
            loopChecker.add(fileName + ':' + position);
            const _symbols = mode === 'definition' ? ls.getDefinitionAtPosition(fileName, position)
                : mode === 'typeDefinition' ? ls.getTypeDefinitionAtPosition(fileName, position)
                    : mode === 'references' ? ls.getReferencesAtPosition(fileName, position)
                        : mode === 'implementation' ? ls.getImplementationAtPosition(fileName, position)
                            : mode === 'rename' ? ls.findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename)
                                : undefined;
            if (!_symbols)
                return;
            symbols = symbols.concat(_symbols);
            for (const ref of _symbols) {
                loopChecker.add(ref.fileName + ':' + ref.textSpan.start);
                const [virtualFile] = core.virtualFiles.getVirtualFile(ref.fileName);
                if (!virtualFile)
                    continue;
                const mirrorMap = core.virtualFiles.getMirrorMap(virtualFile);
                if (!mirrorMap)
                    continue;
                for (const [mirrorOffset, data] of mirrorMap.findMirrorOffsets(ref.textSpan.start)) {
                    if ((mode === 'definition' || mode === 'typeDefinition' || mode === 'implementation') && !data.definition)
                        continue;
                    if ((mode === 'references') && !data.references)
                        continue;
                    if ((mode === 'rename') && !data.rename)
                        continue;
                    if (loopChecker.has(ref.fileName + ':' + mirrorOffset))
                        continue;
                    withMirrors(ref.fileName, mirrorOffset);
                }
            }
        }
    }
    function getDefinitionAndBoundSpan(fileName, position) {
        const loopChecker = new Set();
        let textSpan;
        let symbols = [];
        withMirrors(fileName, position);
        if (!textSpan)
            return;
        return {
            textSpan: textSpan,
            definitions: symbols?.map(s => transformDocumentSpanLike(s)).filter(notEmpty),
        };
        function withMirrors(fileName, position) {
            if (loopChecker.has(fileName + ':' + position))
                return;
            loopChecker.add(fileName + ':' + position);
            const _symbols = ls.getDefinitionAndBoundSpan(fileName, position);
            if (!_symbols)
                return;
            if (!textSpan) {
                textSpan = _symbols.textSpan;
            }
            if (!_symbols.definitions)
                return;
            symbols = symbols.concat(_symbols.definitions);
            for (const ref of _symbols.definitions) {
                loopChecker.add(ref.fileName + ':' + ref.textSpan.start);
                const [virtualFile] = core.virtualFiles.getVirtualFile(ref.fileName);
                if (!virtualFile)
                    continue;
                const mirrorMap = core.virtualFiles.getMirrorMap(virtualFile);
                if (!mirrorMap)
                    continue;
                for (const [mirrorOffset, data] of mirrorMap.findMirrorOffsets(ref.textSpan.start)) {
                    if (!data.definition)
                        continue;
                    if (loopChecker.has(ref.fileName + ':' + mirrorOffset))
                        continue;
                    withMirrors(ref.fileName, mirrorOffset);
                }
            }
        }
    }
    function findReferences(fileName, position) {
        const loopChecker = new Set();
        let symbols = [];
        withMirrors(fileName, position);
        return symbols.map(s => transformReferencedSymbol(s)).filter(notEmpty);
        function withMirrors(fileName, position) {
            if (loopChecker.has(fileName + ':' + position))
                return;
            loopChecker.add(fileName + ':' + position);
            const _symbols = ls.findReferences(fileName, position);
            if (!_symbols)
                return;
            symbols = symbols.concat(_symbols);
            for (const symbol of _symbols) {
                for (const ref of symbol.references) {
                    loopChecker.add(ref.fileName + ':' + ref.textSpan.start);
                    const [virtualFile] = core.virtualFiles.getVirtualFile(ref.fileName);
                    if (!virtualFile)
                        continue;
                    const mirrorMap = core.virtualFiles.getMirrorMap(virtualFile);
                    if (!mirrorMap)
                        continue;
                    for (const [mirrorOffset, data] of mirrorMap.findMirrorOffsets(ref.textSpan.start)) {
                        if (!data.references)
                            continue;
                        if (loopChecker.has(ref.fileName + ':' + mirrorOffset))
                            continue;
                        withMirrors(ref.fileName, mirrorOffset);
                    }
                }
            }
        }
    }
    // transforms
    function transformFileTextChanges(changes) {
        const [_, source] = core.virtualFiles.getVirtualFile(changes.fileName);
        if (source) {
            return {
                ...changes,
                fileName: source.fileName,
                textChanges: changes.textChanges.map(c => {
                    const span = transformSpan(changes.fileName, c.span);
                    if (span) {
                        return {
                            ...c,
                            span: span.textSpan,
                        };
                    }
                }).filter(notEmpty),
            };
        }
        else {
            return changes;
        }
    }
    function transformReferencedSymbol(symbol) {
        const definition = transformDocumentSpanLike(symbol.definition);
        const references = symbol.references.map(r => transformDocumentSpanLike(r)).filter(notEmpty);
        if (definition) {
            return {
                definition,
                references,
            };
        }
        else if (references.length) { // TODO: remove patching
            return {
                definition: {
                    ...symbol.definition,
                    fileName: references[0].fileName,
                    textSpan: references[0].textSpan,
                },
                references,
            };
        }
    }
    function transformDocumentSpanLike(documentSpan) {
        const textSpan = transformSpan(documentSpan.fileName, documentSpan.textSpan);
        if (!textSpan)
            return;
        const contextSpan = transformSpan(documentSpan.fileName, documentSpan.contextSpan);
        const originalTextSpan = transformSpan(documentSpan.originalFileName, documentSpan.originalTextSpan);
        const originalContextSpan = transformSpan(documentSpan.originalFileName, documentSpan.originalContextSpan);
        return {
            ...documentSpan,
            fileName: textSpan.fileName,
            textSpan: textSpan.textSpan,
            contextSpan: contextSpan?.textSpan,
            originalFileName: originalTextSpan?.fileName,
            originalTextSpan: originalTextSpan?.textSpan,
            originalContextSpan: originalContextSpan?.textSpan,
        };
    }
    function transformSpan(fileName, textSpan) {
        if (!fileName)
            return;
        if (!textSpan)
            return;
        const [virtualFile, source] = core.virtualFiles.getVirtualFile(fileName);
        if (virtualFile && source) {
            for (const [sourceFileName, map] of core.virtualFiles.getMaps(virtualFile)) {
                if (source.fileName !== sourceFileName)
                    continue;
                const sourceLoc = map.toSourceOffset(textSpan.start);
                if (sourceLoc) {
                    return {
                        fileName: source.fileName,
                        textSpan: {
                            start: sourceLoc[0],
                            length: textSpan.length,
                        },
                    };
                }
            }
        }
        else {
            return {
                fileName,
                textSpan,
            };
        }
    }
}
exports.createLanguageService = createLanguageService;
function notEmpty(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=index.js.map