import { injectable, multiInject } from 'inversify'
import { Command } from './Command'
import { commandNameOf } from './@command'

type Flags = {
  [key: string]: any
}

@injectable()
export class CommandRunner {
  constructor(@multiInject(Command) private commands: Command[]) {}

  run(command: string, flags: Flags) {
    console.log(`-------------------------------------- this.commands`)
    console.log(this.commands)
    console.log('--------------------------------------')

    const cmd = this.commands.find((instance) => {
      console.log(
        `-------------------------------------- commandNameOf(instance)`
      )
      console.log(commandNameOf(instance))
      console.log('--------------------------------------')
      return commandNameOf(instance) === command
    })

    if (!cmd) {
      throw new Error(`'${command}' is an invalid command`)
    }

    cmd.run(flags)
  }
}
