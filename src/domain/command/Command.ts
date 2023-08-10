import { injectable } from 'inversify'
import { AnyObject } from '../../types'

@injectable()
export abstract class Command {
  abstract run(flags: AnyObject): void
}
