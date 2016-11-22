const tsc = require('typescript');
const babel = require('babel-core');

module.exports = {
    process(src, path) {
        if (path.endsWith('.ts') || path.endsWith('.tsx')) {
            return tsc.transpile(
                src,
                {
                    module: tsc.ModuleKind.CommonJS,
                    inlineSourceMap: true
                },
                path,
                []
            );
        }

        if (babel.util.canCompile(path)) {
            return babel.transform(src, {
                filename: path,
                retainLines: true,
            }).code;
        }

        return src;
    }
};