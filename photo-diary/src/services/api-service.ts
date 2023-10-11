import { StorageKeys } from "../lib/enums/StorageKeys"
import { ApiErrorInterface } from "../lib/interfaces/api-error.interface"

export class APIService {
  protected backendServerURL = import.meta.env.VITE_URL_BACKEND

  protected headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(StorageKeys.ACCESS_TOKEN) as string) || ""
    }`,
  }

  protected async methodGET(path: string): Promise<unknown> {
    const response = await fetch(this.backendServerURL + path, {
      method: "GET",
      headers: this.headers,
    })

    const resultJSON = await response.json()

    if (!response.ok) {
      throw new ApiErrorInterface(resultJSON)
    }

    return resultJSON
  }

  protected async methodPOST(path: string, data: unknown): Promise<unknown> {
    const response = await fetch(this.backendServerURL + path, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(data),
    })

    const resultJSON = await response.json()

    if (!response.ok) {
      throw new ApiErrorInterface(resultJSON)
    }

    return resultJSON
  }

  protected async methodPUT(path: string, data: unknown): Promise<unknown> {
    const response = await fetch(this.backendServerURL + path, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(data),
    })

    const resultJSON = await response.json()

    if (!response.ok) {
      throw new ApiErrorInterface(resultJSON)
    }

    return resultJSON
  }

  protected async methodPATCH(path: string, data: unknown): Promise<unknown> {
    const response = await fetch(this.backendServerURL + path, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(data),
    })

    const resultJSON = await response.json()

    if (!response.ok) {
      throw new ApiErrorInterface(resultJSON)
    }

    return resultJSON
  }

  protected async methodDELETE(path: string, data: unknown): Promise<unknown> {
    const response = await fetch(this.backendServerURL + path, {
      method: "DELETE",
      headers: this.headers,
      body: JSON.stringify(data),
    })

    const resultJSON = await response.json()

    if (!response.ok) {
      throw new ApiErrorInterface(resultJSON)
    }

    return resultJSON
  }
}
