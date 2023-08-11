import fs from 'node:fs'
import path from 'node:path'

export function deleteEmptyDirectoriesWithinRoutes(directory: string): void {
  const filesAndDirs = fs.readdirSync(directory)

  for (const item of filesAndDirs) {
    const itemPath = path.join(directory, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      deleteEmptyDirectoriesWithinRoutes(itemPath) // Recursively check the directory

      // After checking and potentially deleting subdirectories, check if the current directory is empty
      if (
        fs.readdirSync(itemPath).length === 0 &&
        !itemPath.endsWith('(.routes)')
      ) {
        fs.rmdirSync(itemPath)
      }
    }
  }
}
