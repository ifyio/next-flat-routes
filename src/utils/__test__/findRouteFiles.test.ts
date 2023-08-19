import mockFs from 'mock-fs'
import { convertRoutePathToPagePath } from '../convertRoutePathToPagePath'
import { findRouteFiles } from '../findRouteFiles'

describe('findRouteFiles', () => {
  afterEach(() => {
    // Restore the real filesystem after each test
    mockFs.restore()
  })

  it('should return the expected RouteFile objects', () => {
    // Set up a mocked filesystem
    mockFs({
      '/mocked/path/routes': {
        // Index routes
        '(page).js': '',
        '(layout).tsx': '',
        '(loading).jsx': '',
        '(error).tsx': '',
        '(route).ts': '',
        // Nested routes
        'test1.(page).tsx': '',
        'test2.(layout).tsx': '',
        'test2.foo.[...any].[id].bar.(loading).tsx': '',
        'test2.(error).tsx': '',
        'test2.(route).tsx': '',

        subDir: {
          'test3.(error).tsx': '',
        },
      },
    })

    const expected = [
      // Index routes
      {
        pagePath: '/mocked/path/(.routes)/error.tsx',
        routePath: '/mocked/path/routes/(error).tsx',
      },
      {
        pagePath: '/mocked/path/(.routes)/layout.tsx',
        routePath: '/mocked/path/routes/(layout).tsx',
      },
      {
        pagePath: '/mocked/path/(.routes)/loading.jsx',
        routePath: '/mocked/path/routes/(loading).jsx',
      },
      {
        pagePath: '/mocked/path/(.routes)/page.js',
        routePath: '/mocked/path/routes/(page).js',
      },
      {
        pagePath: '/mocked/path/(.routes)/route.ts',
        routePath: '/mocked/path/routes/(route).ts',
      },
      // Nested routes
      {
        routePath: '/mocked/path/routes/subDir/test3.(error).tsx',
        pagePath: convertRoutePathToPagePath(
          '/mocked/path/routes/subDir/test3.(error).tsx'
        ),
      },
      {
        routePath: '/mocked/path/routes/test1.(page).tsx',
        pagePath: convertRoutePathToPagePath(
          '/mocked/path/routes/test1.(page).tsx'
        ),
      },
      {
        routePath: '/mocked/path/routes/test2.(error).tsx',
        pagePath: convertRoutePathToPagePath(
          '/mocked/path/routes/test2.(error).tsx'
        ),
      },
      {
        routePath: '/mocked/path/routes/test2.(layout).tsx',
        pagePath: convertRoutePathToPagePath(
          '/mocked/path/routes/test2.(layout).tsx'
        ),
      },
      {
        routePath:
          '/mocked/path/routes/test2.foo.[...any].[id].bar.(loading).tsx',
        pagePath: convertRoutePathToPagePath(
          '/mocked/path/routes/test2.foo.[...any].[id].bar.(loading).tsx'
        ),
      },
      {
        routePath: '/mocked/path/routes/test2.(route).tsx',
        pagePath: convertRoutePathToPagePath(
          '/mocked/path/routes/test2.(route).tsx'
        ),
      },
    ]

    const result = findRouteFiles('/mocked/path')
    expect(result).toEqual(expect.arrayContaining(expected))
    expect(expected).toEqual(expect.arrayContaining(result))
  })
})
