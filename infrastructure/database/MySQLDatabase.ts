import mysql from "mysql2";

const db_connection = mysql.createConnection({
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "3306")
});

export class MySQLDatabase {
    async query(q: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            db_connection.query(q, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            });
        });

        try {
            let result = await promise;
            return result;
        } catch (err) {
            console.log({ err });
            return null;
        }
    }
};