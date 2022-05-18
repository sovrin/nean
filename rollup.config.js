import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

const pkg = require('./package.json');
const external = Object.keys(pkg.peerDependencies || {});

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 19.10.2019
 * Time: 13:43
 */
export default [
    {
        input: 'src/index.ts',
        output: {
            name: 'nean',
            format: 'es',
            file: pkg.main,
        },
        external,
        plugins: [
            typescript({
                tsconfig: './tsconfig.prod.json',
            }),
            nodeResolve(),
        ],
    },
    {
        input: 'dist/index.d.ts',
        output: [
            {
                file: 'types/index.d.ts',
                format: 'esm',
            },
        ],
        plugins: [
            dts()
        ],
    },
];
