import { CommonOptions } from 'esbuild';

declare const loaders: {
    js: Loader;
    vue: Loader;
    sass: Loader;
};
type LoaderName = keyof typeof loaders;

interface InputFile {
    path: string;
    extension: string;
    srcPath?: string;
    getContents: () => Promise<string> | string;
}
interface OutputFile {
    /**
     * relative to distDir
     */
    path: string;
    srcPath?: string;
    extension?: string;
    contents?: string;
    declaration?: boolean;
    raw?: boolean;
    skip?: boolean;
}
type LoaderResult = OutputFile[] | undefined;
type LoadFile = (input: InputFile) => LoaderResult | Promise<LoaderResult>;
interface LoaderOptions {
    ext?: "mjs" | "js" | "ts";
    format?: "cjs" | "esm";
    declaration?: boolean;
    esbuild?: CommonOptions;
}
interface LoaderContext {
    loadFile: LoadFile;
    options: LoaderOptions;
}
type Loader = (input: InputFile, context: LoaderContext) => LoaderResult | Promise<LoaderResult>;

interface MkdistOptions extends LoaderOptions {
    rootDir?: string;
    srcDir?: string;
    pattern?: string | string[];
    distDir?: string;
    cleanDist?: boolean;
    loaders?: (LoaderName | Loader)[];
    addRelativeDeclarationExtensions?: boolean;
}
declare function mkdist(options?: MkdistOptions): Promise<{
    writtenFiles: string[];
}>;

export { MkdistOptions, mkdist };
