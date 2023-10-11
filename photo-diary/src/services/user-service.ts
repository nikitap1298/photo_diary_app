import { UserInterface } from "../lib/interfaces/user.interface"
import { APIService } from "./api-service"

export class UserService extends APIService {
  checkUserAccess(user: UserInterface): Promise<unknown> {
    return this.methodPOST(`/api/login_check`, user)
  }

  readUser(): Promise<unknown> {
    return this.methodGET(`/api/users/current`)
  }

  registerUser(user: UserInterface): Promise<unknown> {
    return this.methodPOST(`/api/users`, user)
  }

  verifyUser(user: UserInterface): Promise<unknown> {
    return this.methodPOST(`/api/users/${user.id}/verify`, {})
  }

  updateUser(user: UserInterface): Promise<unknown> {
    return this.methodPATCH(`/api/users/${user.id}`, user)
  }

  sendResetPasswordMail(email: string): Promise<unknown> {
    return this.methodPOST(`/api/reset-password`, { email: email })
  }

  deleteUser(user: UserInterface): Promise<unknown> {
    return this.methodDELETE(`/api/users/${user.id}`, user)
  }
}
