import fs from 'node:fs'
import path from 'node:path'
import { RouteFile } from '../types'

export function createPageFilesIfNotExist(routeFiles: RouteFile[]): void {
  for (const routeFile of routeFiles) {
    const fileExtension = path.extname(routeFile.pagePath)

    if (!fs.existsSync(routeFile.pagePath)) {
      const relativePathWithoutExtension = path.join(
        path.dirname(
          path.relative(path.dirname(routeFile.pagePath), routeFile.routePath)
        ),
        path.basename(routeFile.routePath, fileExtension)
      )

      const content =
        "export * from '" +
        relativePathWithoutExtension +
        "';\n" +
        "export { default } from '" +
        relativePathWithoutExtension +
        "';\n"

      const pagePathDirectory = path.dirname(routeFile.pagePath)

      // Ensure the directory exists before writing the file
      fs.mkdirSync(pagePathDirectory, { recursive: true })

      // Write the content to the file
      fs.writeFileSync(routeFile.pagePath, content)
    }
  }
}
