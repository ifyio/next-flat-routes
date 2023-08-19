import { convertRoutePathToPagePath } from '../convertRoutePathToPagePath'

describe('convertRoutePathToPagePath', () => {
  it.each([
    // Index routes
    {
      routePath: '/somePath/routes/(page).tsx',
      pagePath: '/somePath/(.routes)/page.tsx',
    },
    {
      routePath: '/somePath/routes/(layout).jsx',
      pagePath: '/somePath/(.routes)/layout.jsx',
    },
    {
      routePath: '/somePath/routes/(loading).tsx',
      pagePath: '/somePath/(.routes)/loading.tsx',
    },
    {
      routePath: '/somePath/routes/(error).js',
      pagePath: '/somePath/(.routes)/error.js',
    },
    {
      routePath: '/somePath/routes/(route).ts',
      pagePath: '/somePath/(.routes)/route.ts',
    },
    // Nested routes
    {
      routePath: '/somePath/routes/foo.[...any].[id].baz.(page).tsx',
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/page.tsx',
    },
    {
      routePath: '/somePath/routes/foo.[...any].[id].baz.(layout).js',
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/layout.js',
    },
    {
      routePath: '/somePath/routes/foo.[...any].[id].baz.(loading).tsx',
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/loading.tsx',
    },
    {
      routePath: '/somePath/routes/foo.[...any].[id].baz.(error).tsx',
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/error.tsx',
    },
    {
      routePath: '/somePath/routes/foo.[...any].[id].baz.(route).tsx',
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/route.tsx',
    },
  ])('converts $routePath to $pagePath', ({ routePath, pagePath }) => {
    const output = convertRoutePathToPagePath(routePath)

    expect(output).toBe(pagePath)
  })
})
