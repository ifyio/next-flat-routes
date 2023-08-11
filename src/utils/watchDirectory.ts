import fs from 'node:fs'
import path from 'node:path'

export function watchDirectory(
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
