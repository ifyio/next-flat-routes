#!/usr/bin/env node

import semver from 'semver'
import chalk from 'chalk'

const requiredNodeVersion = '16.0.0'

if (!semver.satisfies(process.version, `>=${requiredNodeVersion}`)) {
  console.error(
    chalk.red(
      `Error: This tool requires Node.js version ${requiredNodeVersion} or newer. You are using ${process.version}. Please update your Node.js version and try again.`
    )
  )
  process.exit(1) // eslint-disable-line unicorn/no-process-exit
}

// If version check passes, dynamically import the main CLI
import('./run')
