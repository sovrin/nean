import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 19.10.2019
 * Time: 13:43
 */
export default {
    input: {
        factory: 'src/factory/index.ts',
        hook: 'src/hook/index.ts',
        hooks: 'src/hooks/index.ts',
    },
    output: {
        name: 'nean',
        dir: './dist',
        format: 'es',
    },
    external: [
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
        typescript(),
    ],
};