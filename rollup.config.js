import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import babel from '@rollup/plugin-babel';

export default {
    input: 'src/FileCollection.vue',
    output: {
        format: 'esm',
        file: 'dist/vue-file-collection.esm.js'
    },
    plugins: [
        css(),
        vue({css: false}),
        babel({ babelHelpers: 'bundled' })
    ]
}