
import 'bootstrap'
import 'bootstrap/scss/bootstrap.scss'

import {createApp} from "vue"
import rootComponent from "./App.vue"

let app = createApp(rootComponent)
app.config.devtools = true
app.mount("#app")
