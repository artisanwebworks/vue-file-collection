import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss'
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import analyze from 'rollup-plugin-analyzer'

export default {

    external: [
        'axios',
        'vue'
    ],

    input: 'src/FileCollection.vue',

    output: {
        format: 'esm',
        file: 'dist/vue-file-collection.esm.js'
    },

    plugins: [
        scss({output: 'dist/vue-file-collection.css'}),
        vue(),
        babel({ babelHelpers: 'bundled' }),
        image(),
        resolve(),
        commonjs(),
        analyze()
    ]
}