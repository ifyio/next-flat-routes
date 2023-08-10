#!/usr/bin/env node

import 'reflect-metadata'

import meow from 'meow'
import { container } from './container'
import { CommandRunner } from './domain/command/CommandRunner'

const commandRunner = container.get(CommandRunner)

const cli = meow(
  `
    Usage
      $ nlr <input>

    Options
      --flag, -f  Description of flag

    Examples
      $ my-app hello --flag
`,
  {
    importMeta: import.meta,
    flags: {
      flag: {
        type: 'boolean',
        shortFlag: 'f',
      },
    },
  }
)

commandRunner.run(cli.input[0], cli.flags)
