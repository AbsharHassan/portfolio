import { createSlice } from '@reduxjs/toolkit'
import { Color } from 'three'

const bloomColorsArray = [
  // new Color(0.48, 0.33, 0.83),
  new Color(0.76 / 1, 0.38 / 1, 1.0 / 1),
  new Color(0.35 / 1, 0.51 / 1, 1 / 1),
  new Color(0.04 / 1, 0.66 / 1, 0.72 / 1),
]

export const threeSlice = createSlice({
  name: 'three',
  initialState: {
    arrayCounter: 0,
    bloomTheme: bloomColorsArray[2],
  },
  reducers: {
    toggleBloomTheme: (state) => {
      if (state.arrayCounter !== 2) {
        state.arrayCounter++
      } else {
        state.arrayCounter = 0
      }
      console.log(bloomColorsArray[state.arrayCounter])
      state.bloomTheme = bloomColorsArray[state.arrayCounter]
    },
  },
})

export const { toggleBloomTheme } = threeSlice.actions

export default threeSlice.reducer
