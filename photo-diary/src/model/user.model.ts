import { UserInterface } from "../lib/interfaces/user.interface"
import { Serializable } from "../lib/interfaces/serializable.interface"

export class User implements Serializable<UserInterface> {
  id?: number
  userName?: string
  email?: string
  password?: string
  verified?: boolean

  constructor() {
    this.id = undefined
    this.userName = undefined
    this.email = undefined
    this.password = undefined
    this.verified = undefined
  }

  deserialize(input: UserInterface): UserInterface {
    this.id = input.id
    this.userName = input.userName
    this.email = input.email
    this.password = input.password
    this.verified = input.verified
    return this
  }
}
