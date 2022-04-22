

import { PgTs } from './pgts'


it('test', async () => {
  console.log('hi')

  const db = new PgTs('postgres://dbadmin:changeme@localhost:5400/postgres')
  await db.init()
  
  const res = await db.query('select * from pg_user', { schema: 'public' })
  console.log(res)


  const q1 = db.prepare('select count(1) from pg_user')
  const a1 = await q1.any()
  console.log(a1)
  
  const a2 = await q1.one()
  console.log(a2)



  const f1 = db.prepare('select * from pg_user')
  await expect(f1.one()).rejects.toThrowError('Multiple rows were not expected')

  await db.shutdown()

  console.log('done')
})