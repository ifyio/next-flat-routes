#!/usr/bin/env node

import 'reflect-metadata'

import meow from 'meow'
import { findPageFiles } from './utils/findPageFiles'
import { findRouteFiles } from './utils/findRouteFiles'
import { watchDirectory } from './utils/watchDirectory'
import { createPageFilesIfNotExist } from './utils/createPageFilesIfNotExists'
import { deleteEmptyDirectoriesWithinRoutes } from './utils/deleteEmptyDirectoriesWithinRoutes'
import { deletePageFilesIfRouteMissing } from './utils/deletePageFilesIfRouteMissing'

meow(
  `
  Usage
    $ npx unflatten-next-routes

  Description
    Convert flat Next.js 13 route files to the nested structure

  How it works
    The CLI will watch for any flat route files located within '/routes/' folders located anywhere within the 'app' directory of your Next.js project.
    It will then generate the nested equivalent in a parallel '/(.routes)/' folder.

  Options
    --help      Show help
    --version   Show version

  Note
    Do not manually modify or delete files in the '/(.routes)/' directory, as they are auto-generated.

`,
  {
    importMeta: import.meta,
  }
)

function run() {
  const currentDirectory = process.cwd()

  unflatten(currentDirectory)

  watchDirectory(currentDirectory, () => {
    unflatten(currentDirectory)
  })
}

function unflatten(dir: string) {
  generatePageFiles(dir)
  removeUnlinkedPageFiles(dir)
  deleteEmptyDirectoriesWithinRoutes(dir)
}

function generatePageFiles(dir: string) {
  const routeFiles = findRouteFiles(dir)
  createPageFilesIfNotExist(routeFiles)
}

function removeUnlinkedPageFiles(dir: string) {
  const pageFiles = findPageFiles(dir)
  deletePageFilesIfRouteMissing(pageFiles)
}

run()
