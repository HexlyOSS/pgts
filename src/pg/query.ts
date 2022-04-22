import YeSQL from 'yesql'
import { PgTs } from './pgts'

export class PgtsQuery<P, R> {
  
  compiled: Function

  constructor(public query: string, private _pgts?: PgTs, 
      public yesql: YeSQL.Options = 
      _pgts?.yesql || {
        useNullForMissing: true
      }
    ){ 
    this.compiled = YeSQL.pg(this.query, this.pgts.yesql)
  }

  get pgts(): PgTs {
    if( this._pgts ){
      return this._pgts
    }
    // eventually use async storage
    throw new Error('No PgTs instance available')
  }

  execute(params: P, fn: <T = any>(query: P, values?: any) => Promise<T>): Promise<R>
  execute(params: P, fn: <T = any>(query: P, values?: any) => Promise<T[]>): Promise<R[]>
  execute(params: P, fn: <T = any>(query: P, values?: any) => Promise<T | T[]>): Promise<any>{
    const { text: sql, values } = this.compiled(params)
    return fn(sql, values)
      .catch(err => {
        throw this.pgts.parseError(sql, values, err)
      })
  }

  one(params?: P): Promise<R> {
    return this.execute(params, this.pgts.connection.one)
  }

  any(params?: P): Promise<R[]> {
    return this.execute(params, this.pgts.connection.any)
  }
  
  oneOrNone(params?: P): Promise<R | undefined> {
    return this.execute(params, this.pgts.connection.oneOrNone)
  }

  many(params?: P): Promise<R[]> {
    return this.execute(params, this.pgts.connection.many)
  }

}