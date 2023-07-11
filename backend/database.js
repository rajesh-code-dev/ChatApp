
const mysql = require('mysql2');

const config = {
    user: 'root',
    password: '12Rajesh',
    database: 'chatdatabase',
    host: 'localhost',
    port: '3306'
};

const createConnection = () => {
    const connection = mysql.createConnection(config);
    
    const query = sql => {
        return new Promise((resolve, reject) => {
            connection.query(sql, (error, result) => {
                if (error) {
                    reject(error, "reject1");
                } else {
                    resolve(result, "resolve1");
                }
            });
        });
    };

    const end = () => {
        return new Promise((resolve, reject) => {
            connection.end(error => {
                if (error) {
                    reject("reject2");
                } else {
                    resolve("resolve2");
                }
            })
        });
    };

    return new Promise((resolve, reject) => {
        connection.connect(error => {
            if (error) {
                reject(error, "reject3");
            } else {
                resolve({ query, end }, "resolve3");
            }
        });
    })
};

module.exports = {
    createConnection
};