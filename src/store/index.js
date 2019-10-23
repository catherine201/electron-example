import { init } from '@rematch/core'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import models from './modules'

function createStore() {
  const store = init({
    models,
    redux: {
      reducers: {
        reduxAsyncConnect
      }
    }
  })

  return store
}

const store = createStore()
export default store
