import express from 'express'
import db from '../src/config/db.js'

const app = express();

const startServer = async () => {
    try {
        await db.getConnection();
        app.listen(5001, () => {
            console.log('Server start ...');
        })
    } catch (error) {
        console.error('Server start fail: ', error.message);
        process.exit(1);
    }
}

startServer();