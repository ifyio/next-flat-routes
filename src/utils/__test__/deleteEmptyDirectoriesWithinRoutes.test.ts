import fs from 'node:fs'
import mockFs from 'mock-fs'
import { deleteEmptyDirectoriesWithinRoutes } from '../deleteEmptyDirectoriesWithinRoutes'

describe('deleteEmptyDirectoriesWithinRoutes', () => {
  beforeAll(() => {
    // Mock the file system based on the structure you provide
    mockFs({
      '/test-dir': {
        foo: {
          '(.routes)': {
            'empty-dir': {},
          },
        },
        'dir-with-file': {
          'some-file.txt': 'content here',
        },
        routes: {
          'empty-subdir': {},
        },
        '(.routes)': {
          'empty-subdir': {
            foo: {},
          },
          'another-empty': {
            'yet-another-empty': {},
          },
          'dir-with-file': {
            'some-file.txt': 'content here',
          },
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
    expect(fs.existsSync('/test-dir/foo/(.routes)')).toBeTruthy() // Empty (.routes) folder should not be deleted
    expect(fs.existsSync('/test-dir/foo/(.routes)/empty-dir')).toBeFalsy() // Empty and within (.routes), so it should be deleted
    expect(fs.existsSync('/test-dir/dir-with-file')).toBeTruthy()
    expect(fs.existsSync('/test-dir/routes/empty-subdir')).toBeTruthy() // Not within (.routes), so it should remain
    expect(fs.existsSync('/test-dir/(.routes)/empty-subdir')).toBeFalsy() // Empty and within (.routes), so it should be deleted
    expect(
      fs.existsSync('/test-dir/(.routes)/another-empty/yet-another-empty')
    ).toBeFalsy() // Empty and within nested (.routes), so it should be deleted
    expect(fs.existsSync('/test-dir/(.routes)/dir-with-file')).toBeTruthy()
  })
})
