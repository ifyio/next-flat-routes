import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: ['semver', 'lru-cache', 'yallist'],
})
