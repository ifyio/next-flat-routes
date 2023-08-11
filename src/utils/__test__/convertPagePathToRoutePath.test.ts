import { convertPagePathToRoutePath } from '../convertPagePathToRoutePath'

describe('convertPagePathToRoutePath', () => {
  it.each([
    // Index routes
    {
      pagePath: '/somePath/(.routes)/page.tsx',
      routePath: '/somePath/routes/(page).tsx',
    },
    {
      pagePath: '/somePath/(.routes)/layout.jsx',
      routePath: '/somePath/routes/(layout).jsx',
    },
    {
      pagePath: '/somePath/(.routes)/loading.tsx',
      routePath: '/somePath/routes/(loading).tsx',
    },
    {
      pagePath: '/somePath/(.routes)/error.tsx',
      routePath: '/somePath/routes/(error).tsx',
    },
    {
      pagePath: '/somePath/(.routes)/route.tsx',
      routePath: '/somePath/routes/(route).tsx',
    },
    // Nested routes
    {
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/page.tsx',
      routePath: '/somePath/routes/foo.[...any].[id].baz.(page).tsx',
    },
    {
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/layout.tsx',
      routePath: '/somePath/routes/foo.[...any].[id].baz.(layout).tsx',
    },
    {
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/loading.js',
      routePath: '/somePath/routes/foo.[...any].[id].baz.(loading).js',
    },
    {
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/error.tsx',
      routePath: '/somePath/routes/foo.[...any].[id].baz.(error).tsx',
    },
    {
      pagePath: '/somePath/(.routes)/foo/[...any]/[id]/baz/route.tsx',
      routePath: '/somePath/routes/foo.[...any].[id].baz.(route).tsx',
    },
  ])(`converts $pagePath to $routePath`, ({ pagePath, routePath }) => {
    expect(convertPagePathToRoutePath(pagePath)).toBe(routePath)
  })
})
