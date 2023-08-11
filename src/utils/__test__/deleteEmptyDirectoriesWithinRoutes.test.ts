import fs from 'node:fs'
import mockFs from 'mock-fs'
import { deleteEmptyDirectoriesWithinRoutes } from '../deleteEmptyDirectoriesWithinRoutes'

describe('deleteEmptyDirectoriesWithinRoutes', () => {
  beforeAll(() => {
    // This will mock the file system based on the structure you provide
    mockFs({
      '/test-dir': {
        'empty-dir': {},
        'dir-with-file': {
          'some-file.txt': 'content here',
        },
        'dir-with-empty-subdir': {
          'empty-subdir': {},
        },
        'empty-dir.routes': {},
        'dir-with-empty-subdir.routes': {
          'empty-subdir.routes': {},
        },
      },
    })
  })

  afterAll(() => {
    mockFs.restore()
  })

  it('should delete only the right empty directories', () => {
    deleteEmptyDirectoriesWithinRoutes('/test-dir')

    // Check if the directories are correctly deleted or retained
    expect(fs.existsSync('/test-dir/empty-dir')).toBeFalsy()
    expect(fs.existsSync('/test-dir/dir-with-file')).toBeTruthy()
    expect(fs.existsSync('/test-dir/dir-with-empty-subdir')).toBeFalsy()
    expect(fs.existsSync('/test-dir/empty-dir.routes')).toBeFalsy()
    expect(fs.existsSync('/test-dir/dir-with-empty-subdir.routes')).toBeFalsy()
  })
})
