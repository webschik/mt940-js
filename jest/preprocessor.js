const tsc = require('typescript');

module.exports = {
    process(src, path) {
        if (path.endsWith('.ts') || path.endsWith('.tsx')) {
            return tsc.transpile(
                src,
                {
                    module: tsc.ModuleKind.CommonJS
                },
                path,
                []
            );
        }

        return src;
    }
};