export function convertPagePathToRoutePath(pagePath: string): string {
  const [beforeRoutes, afterRoutes] = pagePath.split('/(.routes)/')
  return [
    beforeRoutes,
    '/routes/',
    afterRoutes
      // Replace / with . if not followed by ] or [
      .replace(/\/(?![^[]*])(?<!\[[^\]]*)/g, '.')
      .replace('page.', '(page).')
      .replace('route.', '(route).')
      .replace('layout.', '(layout).')
      .replace('loading.', '(loading).')
      .replace('error.', '(error).'),
  ].join('')
}
