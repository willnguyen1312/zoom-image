"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachEmbeddedFile = exports.createVirtualFiles = void 0;
const source_map_1 = require("@volar/source-map");
const sourceMaps_1 = require("./sourceMaps");
function createVirtualFiles(languageModules) {
    const sourceFiles = new Map();
    const virtualFiles = new Map();
    const virtualFileToSourceMapsMap = new WeakMap();
    const virtualFileToMirrorMap = new WeakMap();
    let sourceFilesDirty = true;
    return {
        allSources() {
            return Array.from(sourceFiles.values());
        },
        updateSource(fileName, snapshot, languageId) {
            const key = normalizePath(fileName);
            const value = sourceFiles.get(key);
            if (value) {
                value.snapshot = snapshot;
                value.languageModule.updateFile(value.root, snapshot);
                sourceFilesDirty = true;
                return value.root; // updated
            }
            for (const languageModule of languageModules) {
                const virtualFile = languageModule.createFile(fileName, snapshot, languageId);
                if (virtualFile) {
                    sourceFiles.set(key, { fileName, snapshot, root: virtualFile, languageModule });
                    sourceFilesDirty = true;
                    return virtualFile; // created
                }
            }
        },
        deleteSource(fileName) {
            const key = normalizePath(fileName);
            const value = sourceFiles.get(key);
            if (value) {
                value.languageModule.deleteFile?.(value.root);
                sourceFiles.delete(key); // deleted
                sourceFilesDirty = true;
            }
        },
        getSource(fileName) {
            const key = normalizePath(fileName);
            return sourceFiles.get(key);
        },
        hasSource: (fileName) => sourceFiles.has(normalizePath(fileName)),
        getMirrorMap: getMirrorMap,
        getMaps: getSourceMaps,
        hasVirtualFile(fileName) {
            return !!getVirtualFilesMap().get(normalizePath(fileName));
        },
        getVirtualFile(fileName) {
            const sourceAndVirtual = getVirtualFilesMap().get(normalizePath(fileName));
            if (sourceAndVirtual) {
                return [sourceAndVirtual.virtualFile, sourceAndVirtual.source];
            }
            return [undefined, undefined];
        },
    };
    function getVirtualFilesMap() {
        if (sourceFilesDirty) {
            sourceFilesDirty = false;
            virtualFiles.clear();
            for (const [_, row] of sourceFiles) {
                forEachEmbeddedFile(row.root, file => {
                    virtualFiles.set(normalizePath(file.fileName), { virtualFile: file, source: row });
                });
            }
        }
        return virtualFiles;
    }
    function getSourceMaps(virtualFile) {
        let sourceMapsBySourceFileName = virtualFileToSourceMapsMap.get(virtualFile.snapshot);
        if (!sourceMapsBySourceFileName) {
            sourceMapsBySourceFileName = new Map();
            virtualFileToSourceMapsMap.set(virtualFile.snapshot, sourceMapsBySourceFileName);
        }
        const sources = new Set();
        for (const map of virtualFile.mappings) {
            sources.add(map.source);
        }
        for (const source of sources) {
            const sourceFileName = source ?? getVirtualFilesMap().get(normalizePath(virtualFile.fileName)).source.fileName;
            if (!sourceMapsBySourceFileName.has(sourceFileName)) {
                sourceMapsBySourceFileName.set(sourceFileName, [
                    sourceFileName,
                    new source_map_1.SourceMap(virtualFile.mappings.filter(mapping => mapping.source === source)),
                ]);
            }
        }
        return [...sourceMapsBySourceFileName.values()];
    }
    function getMirrorMap(file) {
        if (!virtualFileToMirrorMap.has(file.snapshot)) {
            virtualFileToMirrorMap.set(file.snapshot, file.mirrorBehaviorMappings ? new sourceMaps_1.MirrorMap(file.mirrorBehaviorMappings) : undefined);
        }
        return virtualFileToMirrorMap.get(file.snapshot);
    }
}
exports.createVirtualFiles = createVirtualFiles;
function forEachEmbeddedFile(file, cb) {
    cb(file);
    for (const embeddedFile of file.embeddedFiles) {
        forEachEmbeddedFile(embeddedFile, cb);
    }
}
exports.forEachEmbeddedFile = forEachEmbeddedFile;
function normalizePath(fileName) {
    return fileName.replace(/\\/g, '/').toLowerCase();
}
//# sourceMappingURL=virtualFiles.js.map