const { Client } = require('pg');

async function setupDatabase() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'your-password',
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        // Create database if it doesn't exist
        await client.query(`
      SELECT 'CREATE DATABASE reddit_clone'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'reddit_clone')
    `);

        console.log('Database "reddit_clone" is ready');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await client.end();
    }
}

setupDatabase();
