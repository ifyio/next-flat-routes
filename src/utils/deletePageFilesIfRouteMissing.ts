import fs from 'node:fs'
import path from 'node:path'
import { RouteFile } from '../types'

export function deletePageFilesIfRouteMissing(routeFiles: RouteFile[]): void {
  for (const routeFile of routeFiles) {
    if (!fs.existsSync(routeFile.routePath)) {
      fs.unlinkSync(routeFile.pagePath)

      // Delete all directories leading to to this one if it is now empty
      let currentDirectory = path.dirname(routeFile.pagePath)
      while (!currentDirectory.endsWith('(.routes)')) {
        const files = fs.readdirSync(currentDirectory)

        if (files.length === 0) {
          // Delete the current directory
          fs.rmdirSync(currentDirectory)

          // Move up to the parent directory
          currentDirectory = path.dirname(currentDirectory)
        } else {
          break
        }
      }
    }
  }
}
