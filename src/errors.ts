export class InvalidWatchInputError extends Error {
  readonly issues: readonly string[]

  constructor(issues: readonly string[]) {
    super("Invalid watch input")
    this.name = "InvalidWatchInputError"
    this.issues = issues
  }
}
