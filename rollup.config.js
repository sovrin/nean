import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import commonJS from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';

const peerDependencies = Object.keys(pkg.peerDependencies || {});

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 19.10.2019
 * Time: 13:43
 */
export default {
    input: 'src/index.ts',
    output: {
        name: 'nean',
        format: 'es',
        file: pkg.main,
    },
    external: [
        ...peerDependencies,
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.prod.json',
        }),
        nodeResolve(),
        commonJS(),
    ],
};
