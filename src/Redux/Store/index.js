import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../Reducer'

export const store = configureStore({
  reducer: rootReducer,
})

export default store
