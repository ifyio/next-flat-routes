import fs from 'node:fs'
import path from 'node:path'
import { injectable } from 'inversify'
import { Command } from '../domain/command/Command'
import { command } from '../domain/command/@command'

@injectable()
@command('build')
export class BuildCommand extends Command {
  run() {
    const currentDirectory = process.cwd()

    generatePageFiles(currentDirectory)
    removeUnlinkedPageFiles(currentDirectory)
    deleteEmptyDirectoriesWithinRoutes(currentDirectory)

    watchDirectory(currentDirectory, (file) => {
      generatePageFiles(currentDirectory)
      removeUnlinkedPageFiles(currentDirectory)
      deleteEmptyDirectoriesWithinRoutes(currentDirectory)
      console.log('Changed file:', file)
    })
  }
}

function generatePageFiles(currentDirectory: string) {
  const routeFiles = findRouteFiles(currentDirectory)
  createPageFilesIfNotExist(routeFiles)
}

function removeUnlinkedPageFiles(currentDirectory: string) {
  const pageFiles = findPageFiles(currentDirectory)
  deletePageFilesIfRouteMissing(pageFiles)
}

interface RouteFile {
  routePath: string
  equivalentPagePath: string
}

function findRouteFiles(rootFolder: string): RouteFile[] {
  const routeFiles: RouteFile[] = []

  function traverseDirectory(directory: string): void {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const absolutePath = path.join(directory, file)
      const stat = fs.statSync(absolutePath)

      if (stat.isDirectory()) {
        traverseDirectory(absolutePath)
      } else if (/\/routes\/.*\(page\).*\.tsx$/.test(absolutePath)) {
        routeFiles.push({
          routePath: absolutePath,
          equivalentPagePath: convertRoutePathToPagePath(absolutePath),
        })
      }
    }
  }

  traverseDirectory(rootFolder)

  return routeFiles
}

function convertRoutePathToPagePath(routePath: string): string {
  const [beforeRoutes, afterRoutes] = routePath.split('/routes/')
  return [
    beforeRoutes,
    '/(.routes)/',
    afterRoutes
      .replace('(page).tsx', 'page.tsx')
      .replace('(page).(layout).tsx', 'layout.tsx')
      .replace('(page).(loading).tsx', 'loading.tsx')
      .replace('(page).(error).tsx', 'error.tsx')
      .replace('.tsx', '')
      .replace(/\./g, '/'),
    '.tsx',
  ].join('')
}

function createPageFilesIfNotExist(routeFiles: RouteFile[]): void {
  for (const routeFile of routeFiles) {
    if (!fs.existsSync(routeFile.equivalentPagePath)) {
      const relativePathWithoutExtension = path.join(
        path.dirname(
          path.relative(
            path.dirname(routeFile.equivalentPagePath),
            routeFile.routePath
          )
        ),
        path.basename(routeFile.routePath, '.tsx')
      )

      const content =
        "export * from '" +
        relativePathWithoutExtension +
        "';\n" +
        "export { default } from '" +
        relativePathWithoutExtension +
        "';\n"

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(routeFile.equivalentPagePath), {
        recursive: true,
      })

      // Write the content to the file
      fs.writeFileSync(routeFile.equivalentPagePath, content)
    }
  }
}

function findPageFiles(rootFolder: string): RouteFile[] {
  const pageFiles: RouteFile[] = []

  function traverseDirectory(directory: string): void {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const absolutePath = path.join(directory, file)
      const stat = fs.statSync(absolutePath)

      if (stat.isDirectory()) {
        traverseDirectory(absolutePath)
      } else if (/\/\(\.routes\)\/.*\.tsx$/.test(absolutePath)) {
        pageFiles.push({
          routePath: convertPagePathToRoutePath(absolutePath),
          equivalentPagePath: absolutePath,
        })
      }
    }
  }

  traverseDirectory(rootFolder)

  return pageFiles
}

function convertPagePathToRoutePath(pagePath: string): string {
  const [beforeRoutes, afterRoutes] = pagePath.split('/(.routes)/')
  return [
    beforeRoutes,
    '/routes/',
    afterRoutes
      .replace('/page.tsx', '.(page).tsx')
      .replace('/layout.tsx', '.(page).(layout).tsx')
      .replace('/loading.tsx', '.(page).(loading).tsx')
      .replace('/error.tsx', '.(page).(error).tsx')
      .replace(/\//g, '.'),
  ].join('')
}

function deletePageFilesIfRouteMissing(routeFiles: RouteFile[]): void {
  for (const routeFile of routeFiles) {
    if (!fs.existsSync(routeFile.routePath)) {
      fs.unlinkSync(routeFile.equivalentPagePath)

      // Delete all directories leading to to this one if it is now empty
      let currentDirectory = path.dirname(routeFile.equivalentPagePath)
      while (!currentDirectory.endsWith('(.route)')) {
        const files = fs.readdirSync(currentDirectory)
        if (files.length === 0) {
          currentDirectory = path.dirname(currentDirectory)
        } else {
          break
        }
      }
    }
  }
}

function watchDirectory(
  directory: string,
  callback: (changedFilePath: string) => void
): void {
  fs.watch(directory, { recursive: true }, (eventType, filename) => {
    if (filename && eventType === 'rename' && !filename.includes('(.routes)')) {
      const changedFilePath = path.join(directory, filename)
      callback(changedFilePath)
    }
  })
}

function deleteEmptyDirectoriesWithinRoutes(directory: string): void {
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

// TODO: Generate a README in the (.routes) folder
// TODO: Handle index route
// TODO: Write bin script that chooses between mjs and cjs
// TODO: Add a proper description to the node package and github repo
// TODO: Create readme
