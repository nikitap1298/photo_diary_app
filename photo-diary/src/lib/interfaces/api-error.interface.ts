export class ApiErrorInterface extends Error {
  resultJSON: { code: number; message: string }

  constructor(resultJSON: { code: number; message: string }) {
    super(JSON.stringify(resultJSON))
    this.resultJSON = resultJSON
  }
}
