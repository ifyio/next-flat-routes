import { Constructor } from '../../types'

export function command(name: string) {
  return function (target: Constructor) {
    Reflect.defineMetadata('command', name, target)
  }
}

export function commandNameOf(instance: object): string | undefined {
  return Reflect.getMetadata('command', instance.constructor)
}
