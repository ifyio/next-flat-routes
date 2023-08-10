import { Container } from 'inversify'
import { BuildCommand } from './commands/build'
import { CommandRunner } from './domain/command/CommandRunner'
import { Command } from './domain/command/Command'

export const container = new Container()

container.bind(CommandRunner).toSelf().inSingletonScope()

container.bind(Command).to(BuildCommand).inSingletonScope()
