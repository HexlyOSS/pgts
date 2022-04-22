export type PgtsErrorType = 'unique' | 'db' | 'pquery' | 'pstmt' | 'qfile' | 'result' | 'other'

export class PgtsError extends Error {
  public cause: Error | undefined
  public type: PgtsErrorType = 'other'
  public sql: string | undefined
  public params: any[] = []

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, PgtsError.prototype)
  }
}