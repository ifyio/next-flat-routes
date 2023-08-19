import mockFs from 'mock-fs'
import { convertPagePathToRoutePath } from '../convertPagePathToRoutePath'
import { findPageFiles } from '../findPageFiles'

describe('findPageFiles', () => {
  afterEach(() => {
    // Restore the real filesystem after each test
    mockFs.restore()
  })

  it('should return the expected RouteFile objects', () => {
    // Set up a mocked filesystem
    mockFs({
      '/mocked/path/(.routes)': {
        // Index routes
        'page.tsx': 'content here',
        'layout.tsx': 'content here',
        'loading.jsx': 'content here',
        'error.tsx': 'content here',
        'route.ts': 'content here',
        // Nested routes
        'test1.page.tsx': 'content here',
        'test2.layout.tsx': 'content here',
        'test2.error.tsx': 'content here',
        'test2.route.js': 'content here',
        'test2.foo': {
          '[...any]': {
            '[id]': {
              baz: {
                'loading.tsx': 'content here',
              },
            },
          },
        },
        subDir: {
          'test3.error.tsx': 'content here',
        },
      },
    })

    const expected = [
      // Index routes
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/error.tsx'
        ),
        pagePath: '/mocked/path/(.routes)/error.tsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/layout.tsx'
        ),
        pagePath: '/mocked/path/(.routes)/layout.tsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/loading.jsx'
        ),
        pagePath: '/mocked/path/(.routes)/loading.jsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/page.tsx'
        ),
        pagePath: '/mocked/path/(.routes)/page.tsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/route.ts'
        ),
        pagePath: '/mocked/path/(.routes)/route.ts',
      },
      // Nested routes
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/subDir/test3.error.tsx'
        ),
        pagePath: '/mocked/path/(.routes)/subDir/test3.error.tsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/test1.page.tsx'
        ),
        pagePath: '/mocked/path/(.routes)/test1.page.tsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/test2.error.tsx'
        ),
        pagePath: '/mocked/path/(.routes)/test2.error.tsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/test2.layout.tsx'
        ),
        pagePath: '/mocked/path/(.routes)/test2.layout.tsx',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/test2.route.js'
        ),
        pagePath: '/mocked/path/(.routes)/test2.route.js',
      },
      {
        routePath: convertPagePathToRoutePath(
          '/mocked/path/(.routes)/test2.foo/[...any]/[id]/baz/loading.tsx'
        ),
        pagePath:
          '/mocked/path/(.routes)/test2.foo/[...any]/[id]/baz/loading.tsx',
      },
    ]

    const result = findPageFiles('/mocked/path')
    expect(result).toEqual(expect.arrayContaining(expected))
    expect(expected).toEqual(expect.arrayContaining(result))
  })
})
