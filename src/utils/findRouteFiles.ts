import fs from 'node:fs'
import path from 'node:path'
import { RouteFile } from '../types'
import { convertRoutePathToPagePath } from './convertRoutePathToPagePath'

export function findRouteFiles(rootFolder: string): RouteFile[] {
  const routeFiles: RouteFile[] = []

  function traverseDirectory(directory: string): void {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const absolutePath = path.join(directory, file)
      const stat = fs.statSync(absolutePath)

      if (stat.isDirectory()) {
        traverseDirectory(absolutePath)
      } else if (
        /\/routes\/(.*\.)?\((page|layout|error|loading|route)\)\.(tsx|ts|jsx|js)$/.test(
          absolutePath
        )
      ) {
        routeFiles.push({
          routePath: absolutePath,
          pagePath: convertRoutePathToPagePath(absolutePath),
        })
      }
    }
  }

  traverseDirectory(rootFolder)

  return routeFiles
}
