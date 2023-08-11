export function convertRoutePathToPagePath(routePath: string): string {
  const [beforeRoutes, afterRoutes] = routePath.split('/routes/')
  const pathExtension = ('.' + afterRoutes.split('.').pop()) as string

  return [
    beforeRoutes,
    '/(.routes)/',
    afterRoutes
      .replace('(page).', 'page.')
      .replace('(layout).', 'layout.')
      .replace('(loading).', 'loading.')
      .replace('(error).', 'error.')
      .replace('(route).', 'route.')
      .replace(pathExtension, '')
      .replace(/\.(?![^[]*])/g, '/'),
    pathExtension,
  ].join('')
}
