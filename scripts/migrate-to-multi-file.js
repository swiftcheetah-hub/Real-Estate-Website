// Script to migrate from single database.json to multiple table files
// Run with: node scripts/migrate-to-multi-file.js

import { migrateToMultiFile } from '../lib/db.js'

console.log('Starting migration to multi-file database structure...\n')
migrateToMultiFile()
console.log('\n✅ Migration complete!')
console.log('Your database is now split into separate files:')
console.log('- data/admins.json')
console.log('- data/agents.json')
console.log('- data/properties.json')
console.log('- etc.')
console.log('\nThe old database.json has been backed up to database.json.backup')

