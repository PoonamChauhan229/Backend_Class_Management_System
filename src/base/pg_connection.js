require('dotenv').config()

const {Client}=require('pg')

// clients will also use environment variables
// for connection information

async function pg_connection(query,params){
  try{
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  })
  
  await client.connect()

  const res = await client.query(query,params)
  await client.end()
  //console.log(res.rows)
  return res.rows
}
catch(e){
  console.log("Some internal error")
}
}
module.exports=pg_connection


// pg_connection('INSERT into students (student_name,student_email,student_contact,student_class,student_attendance,student_grade) Values ($1,$2,$3,$4,$5,$6) returning  *;',['Renu', 'renu@gmail.com', '765457', '13th', 85, 'A'])