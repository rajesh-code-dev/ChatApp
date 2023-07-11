const { response, request } = require('express')
const database = require('./database.js')
const mysql = require('mysql2')

const createRestApi = app => {
    // exist user
    app.get('/existUser', async (request, response) => {
        const connection = await database.createConnection()

        try {
            const result = await connection.query(`
                SELECT username from users
            `)
            response.send(result)
        } catch (error) {
            console.log(error, 'existUser error')
        } finally {
            connection.end()
        }
    });

    // admin login
    app.post('/', async (request, response) => {
        if (request.session.userId) {
            response.json({ result: 'ERROR', message: 'User already logged in.' });
        } else {
            const user = {
                username: request.body.username,
                password: request.body.password
            };
            const connection = await database.createConnection();
            try {
                const result = await connection.query(`
                    SELECT id 
                    FROM users 
                    WHERE 
                            username=${mysql.escape(user.username)}
                        AND password=${mysql.escape(user.password)}
                    LIMIT 1
                `);
                if (result.length > 0) {
                    const user = result[0];
                    request.session.userId = user.id;
                    response.send({ result: 'SUCCESS', userId: user.id });
                } else {
                    response.json({ result: 'ERROR', message: 'Indicated username or/and password are not correct.' });
                }
            } catch (e) {
                console.error(e);
                response.json({ result: 'ERROR', message: 'Request operation error.' });
            } finally {
                await connection.end();
            }
        }
    });

    // register user
    app.post('/register', async (request, response) => {
        const user = {
            Name: request.body.Name,
            username: request.body.email,
            password: request.body.password,
        }

        const connection = await database.createConnection()

        try {
            const result = await connection.query(
                `INSERT INTO users (Name, username, password)
                VALUES (${mysql.escape(user.Name)}, ${mysql.escape(user.username)}, ${mysql.escape(user.password)})`
            )

            response.send({ result: 'SSUCESS' })
        } catch (error) {
            console.log('error', error)
        } finally {
            connection.end()
        }
    })

    // user logout
    app.get('/user/logout', async (request, response) => {
        if (request.session.userId) {
            delete request.session.userId
            response.json({ result: 'success' })
        }
        else {
            response.json({ result: 'error' })
        }
    })

    //get username
    app.get('/username', async (request, response) => {
        const connection = await database.createConnection()
        try {
            const result = await connection.query(`
            SELECT username FROM users
            `)
            response.send(result)
        } catch (error) {
            response.send(error)
        } finally {
            connection.end()
        }
    })

    // update password
    app.post('/forgotPassword', async (request, response) => {

        const data = {
            username: request.body.username,
            password: request.body.password
        }
        const connection = database.createConnection()
        try {
            const result = await connection.query(`
            UPDATE users set
            username = ${mysql.escape(data.username)},
            password = ${mysql.escape(data.password)},
            WHERE username = ${mysql.escape(data.username)}
            `)

            response.send(result)
            if (result.affectedRows > 0) {
                response.send('password updated successfully')
            } else {
                response.send({ statues: 404, message: 'something went wrong' })
            }

        } catch (error) {
            console.log(error)
        }
    })

    // Get otp
    app.post('/otp', async (request, response) => {
        const data = {
            otp: request.body.otp
        };
        const connection = await database.createConnection();

        try {
            const result = await connection.query(`
                INSERT INTO otp (otpvalue)
                VALUES (${mysql.escape(data.otp)})
            `);

            response.send({ result: 'success' });
        } catch (error) {
            response.send({ error: 'error' });
        }
    });

    // get otp and otp id
    app.get('/otpid', async (request, response) => {
        const connection = await database.createConnection()

        try {
            const result = await connection.query(`
                SELECT id, otpvalue from otp
            `)
            response.send(result)
        } catch (error) {
            response.send(error)
        }
    })

    // delete otp after 5 minutes
    app.delete('/otpValuedb/:id', async (request, response) => {
        const otpid = request.params.id
        const connection = await database.createConnection()
        try {
            const result = await connection.query(`
                DELETE from otp WHERE id = (${mysql.escape(otpid)}) 
            `)
            if(result.affectedRows > 0){
                response.send({result: 'success'})
            }else{
                response.send({message: 'error'})
            }
        } catch (error) {
            response.send(error)
        }
    })

}

module.exports = {
    createRestApi
}