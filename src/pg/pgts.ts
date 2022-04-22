import moment from 'moment'
import PgPromise, { errors, IBaseProtocol, IDatabase } from 'pg-promise'
import { URL } from 'url'
import { IConnectionParameters, ITypes } from 'pg-promise/typescript/pg-subset'
import YeSQL from 'yesql'
import camelize from 'camelize'
import PgErrorCode from './pg-error-codes'
import { DatabaseError } from 'pg-protocol'
import { PgtsError, PgtsErrorType } from './error'
import { PgtsQuery } from './query'

export class PgTs {
  client: IDatabase<any>
  #url: string

  constructor(url: string, public yesql: YeSQL.Options = {
    useNullForMissing: true
  }){
    this.#url = url
  }

  get connection(): IBaseProtocol<any>{
    return this.client as unknown as IBaseProtocol<any>
  }

  async init(){
    // const options = {
    //   host: 'localhost',
    //   port: 5400,
    //   database: 'sandbox',
    //   user: 'dbadmin',
    //   password: 'changeme'
    // }

    const pgpOpts = {
      // query(e) {
      //   log.info('QUERY:', e.query, e.params);
      // },
      receive(e) {
        camelizeColumns(e)
      },
      // ...options
    } as PgPromise.IInitOptions
    const PgFactory = PgPromise(pgpOpts)
    typeConfigurer(PgFactory.pg.types)
     const uri = new URL(this.#url.replace("jdbc:", ""))

     const conf: IConnectionParameters = {
       host: uri.hostname,
       port: parseInt(uri.port) || 5432,
       database: uri.pathname.startsWith('/') ? uri.pathname.substring(1) : uri.pathname,
       user: uri.username,
       password: uri.password,
     }

    this.client = PgFactory(conf)
    return this
  }


  prepare(query: string) {
    return new PgtsQuery(query, this)
  }

  query(query: string, params: any = {}) {
    return this.prepare(query).any(params)
  }

  parseError(sql: string, values: any[], err: any) {
    const relevantErr = new PgtsError('An unexpected error occurred')
    relevantErr.sql = sql
    relevantErr.params = values
    let type: PgtsErrorType

    if (err instanceof errors.ParameterizedQueryError) {
      type = 'pquery'
    } else if (err instanceof errors.PreparedStatementError) {
      type = 'pstmt'
    } else if (err instanceof errors.QueryFileError) {
      type = 'qfile'
    } else if (err instanceof errors.QueryResultError) {
      type = 'result'
    } else if (err instanceof DatabaseError) {
      const code = PgErrorCode.from(err.code)
      // TODO support foreign key later?
      if (code && code.code === 'unique_violation') {
        type = 'unique'
      } else {
        type = 'db'
      }
    } else {
      type = 'other'
    }

    relevantErr.message = err?.message || `${err}`
    relevantErr.type = type
    relevantErr.cause = err?.message

    process.env.PGTS_LOG_WARNINGS && console.warn('PGTS error of type', relevantErr)

    return relevantErr
  }

  async shutdown(){
    await this.client?.$pool?.end()
  }
}

const typeConfigurer = (types: ITypes) => {
  types.setTypeParser(20, val => parseInt(val))
  types.setTypeParser(701, val => parseInt(val))

  types.setTypeParser(700, val => parseFloat(val)) // float4
  types.setTypeParser(701, val => parseFloat(val)) // float8
  types.setTypeParser(1700, val => parseFloat(val)) // numeric

  types.setTypeParser(types.builtins.TIMESTAMPTZ, parseTimestamp)
  types.setTypeParser(types.builtins.TIMESTAMP, parseTimestamp)
  types.setTypeParser(types.builtins.DATE, parseTimestamp)
}


const parseTimestamp = (val: any) => {
  if (val === null) {
    return null
  }
  return moment(val)
}

function camelizeColumns(data: any[]) {
  const tmp = data[0];
  for (const prop in tmp) {
    const camel = camelize(prop) //pgp.utils.camelize(prop);
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      d[camel] = typeof (d[prop]) === 'object' && !moment.isMoment(d[prop]) ? camelize(d[prop]) : d[prop];
      if (camel !== prop) {
        delete d[prop];
      }
    }
  }
}
