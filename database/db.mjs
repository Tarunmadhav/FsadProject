import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '127.0.0.1', // Changed from 'localhost' to '127.0.0.1' to avoid DNS delay
  user: 'root',
  password: 'Adish@104', // Replace with your MySQL root password
  database: 'app_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  connection.release(); // Release the connection back to the pool
});

export default pool;
