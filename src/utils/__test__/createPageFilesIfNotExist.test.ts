import fs from 'node:fs'
import mockFs from 'mock-fs'
import { createPageFilesIfNotExist } from '../createPageFilesIfNotExists'

describe('createPageFilesIfNotExist', () => {
  beforeEach(() => {
    // Set up mock file system before each test
    mockFs({
      'app/shop/routes/': {
        'basket.(page).tsx': 'mock content',
        'product.(page).jsx': 'mock content',
        'checkout.(page).js': 'mock content',
      },
    })
  })

  afterEach(() => {
    // Restore the file system after each test
    mockFs.restore()
  })

  it.each([
    [
      'tsx',
      'basket',
      "export * from '../../routes/basket.(page)';\n" +
        "export { default } from '../../routes/basket.(page)';\n",
    ],
    [
      'jsx',
      'product',
      "export * from '../../routes/product.(page)';\n" +
        "export { default } from '../../routes/product.(page)';\n",
    ],
    [
      'js',
      'checkout',
      "export * from '../../routes/checkout.(page)';\n" +
        "export { default } from '../../routes/checkout.(page)';\n",
    ],
  ])(
    'should create the page file for .%s extension if it does not exist',
    (extension, fileName, expectedContent) => {
      const mockRouteFiles = [
        {
          routePath: `app/shop/routes/${fileName}.(page).${extension}`,
          pagePath: `app/shop/(.routes)/${fileName}/page.${extension}`,
        },
      ]

      createPageFilesIfNotExist(mockRouteFiles)

      // Use the regular fs module to read the file
      const actualContent = fs.readFileSync(mockRouteFiles[0].pagePath, 'utf8')

      expect(actualContent).toBe(expectedContent)
    }
  )
})
