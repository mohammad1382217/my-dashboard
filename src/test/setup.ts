import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// React Testing Library unmounts between tests so the DOM stays isolated.
afterEach(() => {
  cleanup()
})
