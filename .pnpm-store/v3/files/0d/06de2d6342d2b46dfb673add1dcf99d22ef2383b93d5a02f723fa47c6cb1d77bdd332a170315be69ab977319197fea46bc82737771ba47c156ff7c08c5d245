"use strict";
const language_core_1 = require("@volar/language-core");
const plugin = () => {
    return {
        version: 1,
        getEmbeddedFileNames(fileName, sfc) {
            if (sfc.template) {
                return [fileName + '.template.' + sfc.template.lang];
            }
            return [];
        },
        resolveEmbeddedFile(_fileName, sfc, embeddedFile) {
            const match = embeddedFile.fileName.match(/^(.*)\.template\.([^.]+)$/);
            if (match && sfc.template) {
                embeddedFile.capabilities = language_core_1.FileCapabilities.full;
                embeddedFile.content.push([
                    sfc.template.content,
                    sfc.template.name,
                    0,
                    language_core_1.FileRangeCapabilities.full,
                ]);
            }
        },
    };
};
module.exports = plugin;
//# sourceMappingURL=vue-sfc-template.js.map