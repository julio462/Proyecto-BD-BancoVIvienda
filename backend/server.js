const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// CONFIGURACIÓN SQL SERVER
const config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'BancoVivienda',
    port: 1433, // 👈 ahora sí
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// CONEXIÓN
sql.connect(config)
    .then(() => console.log('✅ Conectado a SQL Server'))
    .catch(err => console.log('❌ Error conexión:', err));

// RUTA PRUEBA
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await sql.query`
            SELECT * FROM USUARIO
            WHERE username = ${username}
            AND password_hash = ${password}
        `;

        console.log('RESULTADO:', result.recordset);

        if (result.recordset.length > 0) {
            const usuario = result.recordset[0];

            // ✅ RESPUESTA CORRECTA
            res.json({
                success: true,
                mensaje: 'Login correcto',
                usuario: {
                    id_usuario: usuario.id_usuario,
                    username: usuario.username,
                    id_rol: usuario.id_rol
                }
            });

        } else {
            res.json({
                success: false,
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            mensaje: 'Error en el servidor'
        });
    }
});
//Registros
app.post('/registro', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.query`
            INSERT INTO USUARIO (username, password_hash, id_rol)
            VALUES (${username}, ${password}, 1)
        `;

        res.json({ mensaje: 'Usuario creado' });
    } catch (err) {
        res.json({ mensaje: 'Error al registrar' });
    }
});
//Usuarios
    //OBTENER USUARIOS
    app.get('/usuarios', async (req, res) => {
    const result = await sql.query("SELECT * FROM USUARIO");
    res.json(result.recordset);
});
    //Actualizar
    app.put('/usuarios/:id', async (req, res) => {
    const { username } = req.body;
    const id = req.params.id;

    await sql.query`
        UPDATE USUARIO
        SET username = ${username}
        WHERE id_usuario = ${id}
    `;

    res.json({ mensaje: 'Usuario actualizado' });
});
    //Eliminar
    app.delete('/usuarios/:id', async (req, res) => {
    const id = req.params.id;

    await sql.query`
        DELETE FROM USUARIO
        WHERE id_usuario = ${id}
    `;

    res.json({ mensaje: 'Usuario eliminado' });
});
// VER CUENTAS
app.get('/cuenta', async (req, res) => {
    const result = await sql.query("SELECT * FROM CUENTA");
    res.json(result.recordset);
});

// VER CREDITOS
app.get('/creditos', async (req, res) => {
    const result = await sql.query("SELECT * FROM CREDITO");
    res.json(result.recordset);
});

// VER CLIENTES
app.get('/clientes', async (req, res) => {
    const result = await sql.query("SELECT * FROM CLIENTE");
    res.json(result.recordset);
});

// VER SOLICITUDES
app.get('/solicitudes', async (req, res) => {
    const result = await sql.query("SELECT * FROM SOLICITUD");
    res.json(result.recordset);
});
// INICIAR SERVIDOR
app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
});
