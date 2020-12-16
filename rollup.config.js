import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss'

export default {
    input: 'src/FileCollection.vue',
    output: {
        format: 'esm',
        file: 'dist/vue-file-collection.esm.js'
    },
    plugins: [
        scss(),
        vue(),
        babel({ babelHelpers: 'bundled' })
    ]
}