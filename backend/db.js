const sql = require('mssql');

const config = {
    user: 'tu_usuario',
    password: 'tu_password',
    server: 'localhost\\SQLEXPRESS', // 👈 AQUÍ haces el cambio
    database: 'BancoVivienda',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function conectarDB() {
    try {
        await sql.connect(config);
        console.log('Conectado a SQL Server');
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

module.exports = {
    sql,
    conectarDB
};