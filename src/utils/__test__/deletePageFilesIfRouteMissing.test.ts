import fs from 'node:fs'
import mockFs from 'mock-fs'
import { deletePageFilesIfRouteMissing } from '../deletePageFilesIfRouteMissing'

describe('deletePageFilesIfRouteMissing', () => {
  afterEach(() => {
    // Restore the real filesystem after each test
    mockFs.restore()
  })

  it('should delete page files and their parent directories if their corresponding route files are missing', () => {
    // Set up a mocked filesystem
    mockFs({
      '/mocked/path/(.routes)': {
        'page.tsx': 'content here',
        nestedDir: {
          'test3.page.tsx': 'content here',
          deeperDir: {
            'test4.page.tsx': 'content here',
          },
        },
      },
      '/mocked/path/routes': {
        '(page).tsx': 'content here',
      },
    })

    const routeFiles = [
      {
        routePath: '/mocked/path/routes/(page).tsx',
        pagePath: '/mocked/path/(.routes)/page.tsx',
      },
      {
        routePath: '/mocked/path/routes/nestedDir/test3.(page).tsx',
        pagePath: '/mocked/path/(.routes)/nestedDir/test3.page.tsx',
      },
      {
        routePath: '/mocked/path/routes/nestedDir/deeperDir/test4.(page).tsx',
        pagePath: '/mocked/path/(.routes)/nestedDir/deeperDir/test4.page.tsx',
      },
    ]

    deletePageFilesIfRouteMissing(routeFiles)

    // Check if the files were deleted as expected
    expect(() => fs.statSync('/mocked/path/(.routes)/page.tsx')).not.toThrow()
    expect(() =>
      fs.statSync('/mocked/path/(.routes)/nestedDir/test3.page.tsx')
    ).toThrow()
    expect(() =>
      fs.statSync('/mocked/path/(.routes)/nestedDir/deeperDir/test4.page.tsx')
    ).toThrow()

    // Check if directories were deleted
    expect(() => fs.statSync('/mocked/path/(.routes)/nestedDir')).toThrow() // deeperDir should be deleted

    // Check if the files that shouldn't be deleted are still there
    expect(() => fs.statSync('/mocked/path/routes/(page).tsx')).not.toThrow()
  })

  it('should not delete the (.routes) directory even if it becomes empty', () => {
    // Set up a mocked filesystem with only one page file inside (.routes)
    mockFs({
      '/mocked/path/(.routes)': {
        foo: {
          'page.tsx': 'content here',
        },
      },
    })

    const routeFiles = [
      {
        routePath: '/mocked/path/routes/foo.(page).tsx',
        pagePath: '/mocked/path/(.routes)/foo/page.tsx',
      },
    ]

    deletePageFilesIfRouteMissing(routeFiles)

    // Check if the file was deleted as expected
    expect(() => fs.statSync('/mocked/path/(.routes)/foo/page.tsx')).toThrow()

    // Check that the (.routes) directory is still there
    expect(() => fs.statSync('/mocked/path/(.routes)')).not.toThrow()
  })
})
