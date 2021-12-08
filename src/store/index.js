import { createStore } from 'vuex';
import projects from './modules/projects'

// Create a new store instance.
const store = createStore({
    state () {
        projects
    },
  })

export default store;