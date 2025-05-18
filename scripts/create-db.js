require('dotenv').config()
const db = require('better-sqlite3')(process.env.DB_PATH, { verbose: console.log })
const schema = require('./dependencies/db-schema').schema

db.pragma('journal_mode = WAL')
for (const tableKey in schema) {
  const table = schema[tableKey]
  let statement = `CREATE TABLE IF NOT EXISTS ${tableKey} (`
  for (const fieldKey in table) {
    const field = table[fieldKey]
    statement += `\n  ${fieldKey} ${field.Type} ${field.Options?.join(' ') ?? ''},`
  }
  statement = statement.slice(0, -1) + '\n)' // Removes last comma to avoid SQLite errors
  db.prepare(statement).run()
}
db.close()
