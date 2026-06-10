import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageCompressor } from './ImageCompressor'

describe('ImageCompressor', () => {
  it('renders the dropzone with default labels', () => {
    render(<ImageCompressor />)
    expect(screen.getByText('Drop images here')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument()
  })

  it('shows the quality and max-width controls', () => {
    render(<ImageCompressor />)
    expect(screen.getByText('Quality')).toBeInTheDocument()
    // default quality 0.8 → 80%
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('Max width')).toBeInTheDocument()
  })

  it('accepts custom labels', () => {
    render(<ImageCompressor labels={{ drop: 'بکش و رها کن' }} />)
    expect(screen.getByText('بکش و رها کن')).toBeInTheDocument()
  })

  it('starts with no result cards', () => {
    render(<ImageCompressor />)
    expect(screen.queryByText('Download all')).toBeNull()
  })
})
