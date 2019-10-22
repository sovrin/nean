import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const peerDependencies = Object.keys(pkg.peerDependencies || {});

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 19.10.2019
 * Time: 13:43
 */
export default {
    input:'src/index.ts',
    output: {
        name: 'nean',
        dir: './lib',
        format: 'es',
    },
    external: [
        ...peerDependencies,
    ],
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true
        }),
    ],
};