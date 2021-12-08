import { createApp } from 'vue'
import store from './store/index'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'


const app = createApp(App);
app.use(store)

app.mount('#app')
