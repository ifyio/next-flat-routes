import fs from 'node:fs'
import path from 'node:path'
import { RouteFile } from '../types'
import { convertPagePathToRoutePath } from './convertPagePathToRoutePath'

export function findPageFiles(rootFolder: string): RouteFile[] {
  const pageFiles: RouteFile[] = []

  function traverseDirectory(directory: string): void {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const absolutePath = path.join(directory, file)
      const stat = fs.statSync(absolutePath)

      if (stat.isDirectory()) {
        traverseDirectory(absolutePath)
      } else if (/\/\(\.routes\)\/.*\.(tsx|ts|jsx|js)$/.test(absolutePath)) {
        pageFiles.push({
          routePath: convertPagePathToRoutePath(absolutePath),
          pagePath: absolutePath,
        })
      }
    }
  }

  traverseDirectory(rootFolder)

  return pageFiles
}
