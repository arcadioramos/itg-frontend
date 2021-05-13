const express = require("express");
const app = express();
//const usersRoute = require("../routes/usersRoute");
const moment = require('moment')
const myConn = require('express-myconnection');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { createTokens, validateToken } = require('./JWT')
var fs = require('fs');
const nodemailer = require('nodemailer')
const sendgridTransport = require("nodemailer-sendgrid-transport");
const path = require('path');

//const apiKey = "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";
const crypto = require('crypto');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))

app.use(fileUpload());

app.use(cookieParser());


app.use(cors());
//9. Serve Static files from react
app.use(express.static(path.join(__dirname, 'frontend/build')));
//Para poder comunicarle los json del frontend al server
app.use(express.json());

//app.use("/users/", usersRoute);
var PORT = 5000;
app.listen(process.env.PORT || PORT, () => {
    console.log("Express server está corriendo en port"+PORT);
})

//Middleware
const db = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'bbc5e2e75e2a38',
    password: '4258a355',
    database: 'heroku_0f898254769ba98',
    port: '3306'
});

//Posts
app.post('/createAviso', (req, res) => {
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const fecha = req.body.fecha;
    const file = req.body.file;

    db.query('INSERT INTO avisos (titulo,descripcion,fecha,file) VALUES (?,?,?,?)',
        [titulo, descripcion, fecha, file],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values inserted");
            }
        });


})

app.post('/createOfertaAcademica', (req, res) => {
    const licenciatura = req.body.licenciatura;
    const codigo = req.body.codigo;
    const objetivo = req.body.objetivo;
    const perfil = req.body.perfil;
    const file = req.body.file;

    db.query('INSERT INTO ofertaacademica (licenciatura,codigo,objetivo,perfil,file) VALUES (?,?,?,?,?)',
        [licenciatura, codigo, objetivo, perfil, file],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values inserted");
            }
        });


})

app.post('/createCarousell', (req, res) => {
    const file = req.body.file;

    db.query('INSERT INTO carousell (file) VALUES (?)',
        [file],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values inserted");
            }
        });


})

app.post('/createMoodle', (req, res) => {
    const titulo = req.body.titulo;
    const servidor = req.body.servidor;

    db.query('INSERT INTO moodle (titulo,servidor) VALUES (?,?)',
        [titulo, servidor],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values inserted");
            }
        });


})

app.post('/editMoodle/:id', (req, res) => {
    const titulo = req.body.titulo;
    const servidor = req.body.servidor;

    const query = 'UPDATE moodle SET titulo = ?, servidor = ? WHERE id = ?'
    db.query(query, [titulo, servidor, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})


//Upload endpoint
app.post('/uploads', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads/" + fileN
    var exist = false;

    db.query('SELECT file FROM avisos', (err, result) => {
        result.map((val) => {
            if (val.file === filePath) {
                exist = true;
            }
        })
        if (exist) {
            res.json({ fileName: file.name, filePath: filePath })
        }
        else {
            if (req.files === null) {
                return res.status(400).json({ msg: 'Ningún archivo fue subido' });

            }


            file.mv(`/frontend/build/uploads/${fileN}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath: filePath })
            })
        }
    })


})

app.post('/uploads-carrera', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-carreras/" + fileN
    var exist = false;

    db.query('SELECT file FROM ofertaacademica', (err, result) => {
        result.map((val) => {
            if (val.file === filePath) {
                exist = true;
            }
        })
        if (exist) {
            res.json({ fileName: file.name, filePath: filePath })
        }
        else {
            if (req.files === null) {
                return res.status(400).json({ msg: 'Ningún archivo fue subido' });

            }


            file.mv(`${__dirname}/.././frontend/build/uploads-carreras/${fileN}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath: filePath })
            })
        }
    })


})

app.post('/uploads-carousell', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-carousell/" + fileN
    var exist = false;

    db.query('SELECT file FROM carousell', (err, result) => {
        result.map((val) => {
            if (val.file === filePath) {
                exist = true;
            }
        })
        if (exist) {
            res.json({ fileName: file.name, filePath: filePath })
        }
        else {
            if (req.files === null) {
                return res.status(400).json({ msg: 'Ningún archivo fue subido' });

            }


            file.mv(`${__dirname}/.././frontend/build/uploads-carousell/${fileN}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath: filePath })
            })
        }
    })


})


app.get('/', (req, res) => {
    res.send("Hello world :) ");
})
app.get('/getAvisos', (req, res) => {
    db.query('SELECT * FROM avisos ORDER BY id DESC', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getCarreras', (req, res) => {
    db.query('SELECT id,licenciatura FROM ofertaacademica', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getMoodle', (req, res) => {
    db.query('SELECT * FROM moodle', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getMoodleData/:id', (req, res) => {
    const query = 'SELECT * FROM moodle WHERE id = ?'
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})


app.get('/getOfertaAcademica/:id', (req, res) => {
    const query = 'SELECT * FROM ofertaacademica WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getCarousell', (req, res) => {
    db.query('SELECT id, file FROM carousell', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getMoodle', (req, res) => {
    db.query('SELECT * FROM moodle', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/deleteCarousell/:id', (req, res) => {
    const qFile = "SELECT file FROM carousell WHERE id = ?"
    db.query(qFile, req.params.id, (err, resultFile) => {
        fs.unlinkSync(`${__dirname}/.././frontend/build${resultFile[0].file}`)
    })
    const query = 'DELETE FROM carousell WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getDatosAviso/:id', (req, res) => {
    const query = 'SELECT * FROM avisos WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/uploads-editDel/:id', (req, res) => {
    const query = 'SELECT file FROM avisos WHERE id = ?'
    db.query(query, req.params.id, (err, result) => {
        if (result[0].file != "") {
            const query2 = 'SELECT count(*) AS count FROM avisos WHERE file = ?'
            db.query(query2, result[0].file, (err, result2) => {
                if (result2[0].count < 2) {
                    fs.unlinkSync(`${__dirname}/.././frontend/build${result[0].file}`)
                    res.json({ filePath: "" })
                } else {
                    res.json({ filePath: "" })
                }
            })
        } else {
            res.json({ filePath: "" })
        }
    })
})

app.post('/uploads-edit/:id', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads/" + fileN
    var exist = false;

    const query = 'SELECT file FROM avisos'
    db.query(query, (err, result) => {
        const query2 = 'SELECT file FROM avisos WHERE id = ? LIMIT 1'
        db.query(query2, req.params.id, (err, result2) => {
            result.map((val) => {
                if (val.file === filePath) {
                    exist = true;
                }
            })
            if (exist) {
                const queryCount = 'SELECT count(*) AS count FROM avisos WHERE file = ?'
                db.query(queryCount, result2[0].file, (err, resultCount) => {
                    if (resultCount[0].count == 1 && result2[0].file != "" && result2[0].file != filePath) {
                        fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                    }
                })
                res.json({ fileName: file.name, filePath: filePath })
            }
            else {
                if (result2[0].file != "") {
                    const query3 = 'SELECT count(*) AS count FROM avisos WHERE file = ?'
                    db.query(query3, result2[0].file, (err, result3) => {
                        if (result3[0].count == 1 && result2[0].file != "") {
                            fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                        }
                    })
                }

                file.mv(`/frontend/build/uploads/${fileN}`, err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.json({ fileName: file.name, filePath: filePath })
                })
            }
        })
    })
})

app.post('/editAviso', (req, res) => {
    const id = req.body.id
    const titulo = req.body.titulo
    const descripcion = req.body.descripcion
    const file = req.body.file
    const query = 'UPDATE avisos SET titulo = ?, descripcion = ?, file = ? WHERE id = ?';
    db.query(query, [titulo, descripcion, file, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/deleteAviso/:id', (req, res) => {
    const query = 'DELETE FROM avisos WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/deleteMoodle/:id', (req, res) => {
    const query = 'DELETE FROM moodle WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getDatosCarrera/:id', (req, res) => {
    const query = 'SELECT * FROM ofertaacademica WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/uploads-carreras-editDel/:id', (req, res) => {
    const query = 'SELECT file FROM ofertaacademica WHERE id = ?'
    db.query(query, req.params.id, (err, result) => {
        if (result[0].file != "") {
            const query2 = 'SELECT count(*) AS count FROM ofertaacademica WHERE file = ?'
            db.query(query2, result[0].file, (err, result2) => {
                if (result2[0].count < 2) {
                    fs.unlinkSync(`${__dirname}/.././frontend/build${result[0].file}`)
                    res.json({ filePath: "" })
                } else {
                    res.json({ filePath: "" })
                }
            })
        } else {
            res.json({ filePath: "" })
        }
    })
})

app.post('/uploads-carreras-edit/:id', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-carreras/" + fileN
    var exist = false;

    const query = 'SELECT file FROM ofertaacademica'
    db.query(query, (err, result) => {
        const query2 = 'SELECT file FROM ofertaacademica WHERE id = ? LIMIT 1'
        db.query(query2, req.params.id, (err, result2) => {
            result.map((val) => {
                if (val.file === filePath) {
                    exist = true;
                }
            })
            if (exist) {
                const queryCount = 'SELECT count(*) AS count FROM ofertaacademica WHERE file = ?'
                db.query(queryCount, result2[0].file, (err, resultCount) => {
                    if (resultCount[0].count == 1 && result2[0].file != "" && result2[0].file != filePath) {
                        fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                    }
                })
                res.json({ fileName: file.name, filePath: filePath })
            }
            else {
                if (result2[0].file != "") {
                    const query3 = 'SELECT count(*) AS count FROM ofertaacademica WHERE file = ?'
                    db.query(query3, result2[0].file, (err, result3) => {
                        if (result3[0].count == 1 && result2[0].file != "") {
                            fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                        }
                    })
                }

                file.mv(`${__dirname}/.././frontend/build/uploads-carreras/${fileN}`, err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.json({ fileName: file.name, filePath: filePath })
                })
            }
        })
    })
})

app.post('/editCarrera', (req, res) => {
    const id = req.body.id
    const licenciatura = req.body.licenciatura
    const codigo = req.body.codigo
    const objetivo = req.body.objetivo
    const perfil = req.body.perfil
    const file = req.body.file
    const query = 'UPDATE ofertaacademica SET licenciatura = ?, codigo = ?, objetivo = ?, perfil = ?, file = ? WHERE id = ?';
    db.query(query, [licenciatura, codigo, objetivo, perfil, file, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/deleteCarrera/:id', (req, res) => {
    const query = 'DELETE FROM ofertaacademica WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/sendContacto', (req, res) => {
    const asunto = req.body.asunto;
    const mensaje = req.body.mensaje;
    const correo = req.body.correo;
    transporter.sendMail({
        to: 'carlinos1212@gmail.com',
        from: 'carlinos1212@gmail.com',
        subject: asunto,
        html: `
        <p>${mensaje}</p>
        <br>
        <p>Correo enviado desde: ${correo}</p>
        `
    })
    res.json({ mensaje: "todo salió bien" });
});


//Registro de usuarios en la base de datos
app.post('/registrar', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;


    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err)
        }

        db.query(
            "INSERT INTO usuarios(email,password,role) VALUES (?,?,?)",
            [email, hash, role],
            (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    transporter.sendMail({
                        to: email,
                        from: 'carlinos1212@gmail.com',
                        subject: 'Registro completado con éxito',
                        html: '<h1>Usted se ha registrado</h1>'
                    })
                    res.json({ mensaje: "todo salió bien" });
                }
            }
        );
    })


});

//No borrar funciona al cien
app.get('/getToken', (req, res) => {
    const token = req.cookies['access-token'];
    jwt.verify(token, 'jwtsecretplschange', (err, authData) => {
        if (err) {
            res.json({
                mensaje: "no estás autorizado",
                authorized: false
            })
        } else {
            req.authData = authData;
            res.json({
                mensaje: "validado",
                authorized: true,
                authData
            })
        }
    })

})


app.post('/checkEmailDuplicated', async (req, res) => {
    const email = req.body.email;

    await db.query('SELECT * FROM usuarios where email = ?',
        email,
        (err, result) => {
            if (err) {
                res.send({ err })
            }
            if (result.length > 0) {
                const user = result[0];
                res.json({
                    user,
                    duplicated: true,
                    mensaje: "El correo está en uso"
                })

            } else {
                res.json({
                    mensaje: "El correo no está en uso",
                    duplicated: false
                })
            }
        })
})

//Login 
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    await db.query('SELECT * FROM usuarios WHERE email = ?;',
        email,
        (err, result) => {

            if (err) {
                res.send({ err: err });

            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {

                    if (response) {
                        const user = result[0];
                        const accessToken = createTokens(user);


                        res.cookie("access-token", accessToken, {
                            maxAge: 60 * 60 * 24 * 1000 * 1,
                            httpOnly: true
                        }).json({
                            mensaje: "correcto inicio de sesión",
                            user: user,
                            auth: true
                        });




                    } else {
                        res.json({
                            auth: false,
                            mensaje: "Contraseña incorrecta"
                        });
                    }
                })
            } else {
                res.json({ auth: false, mensaje: "El usuario ingresado(correo electrónico) no existe" })

            }

        }
    )
})

app.post('/reset-password', async (req, res) => {
    await crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const fechaFea = Date.now() + 1800000
        const fechaBuena = moment(fechaFea).format();
        const resetToken = buffer.toString('hex');
        //El token sólo será válido por 30 minutos
        const expireToken = fechaBuena;
        const email = req.body.email;
        await db.query('SELECT * FROM usuarios WHERE email =?;',
            email, async (err, result) => {
                if (err) {
                    res.send(err)
                }
                if (result.length > 0) {
                    const query = 'UPDATE usuarios SET resetToken = ?, expireToken = ? WHERE email = ? LIMIT 1';
                    await db.query(query, [resetToken, expireToken, email], (err, result) => {
                        if (err) {
                            res.json({
                                err,
                                expireToken
                            })
                        } else {
                            transporter.sendMail({
                                to: email,
                                from: 'carlinos1212@gmail.com',
                                subject: 'Re asignación de contraseña',
                                html: `
                                <p>Haga click en el siguiente link para <a href="https://itg-done.herokuapp.com/reset/${resetToken}">reestablecer contraseña</a></p>
                                `

                            })
                            res.json({
                                mensaje: 'El correo de actualización de contraseña ha sido enviado, verifique su bandeja de correos',
                                result
                            })
                        }

                    })
                } else {
                    res.json({
                        mensaje: 'El usuario no existe/ el correo ingresado no existe',
                        email: email,
                        tipo: "ando acá",
                        result

                    })
                }
            })


    })

})

app.post('/newPassword', async (req, res) => {
    const password = req.body.password;
    const token = req.body.token;
    await db.query('SELECT * FROM usuarios WHERE resetToken =? LIMIT 1;',
        token, async (err, result) => {
            if (err) {
                res.json({
                    err: err
                })
            }
            const expireToken = result[0].expireToken;
            const fechaAhorita = Date.now();
            const fechaAhoritaa = moment(fechaAhorita).format();
            const parseadoToken = Date.parse(expireToken);
            const parseadoFechaAhorita = Date.parse(fechaAhoritaa);
            const parseadoFechaAhoritaa = moment(parseadoFechaAhorita).format();



            if (result.length > 0) {
                await bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) {
                        res.json({
                            err: err,
                            mensaje: "Hubo un error en el hasheo"
                        })
                    }

                    if (parseadoToken > parseadoFechaAhorita) {
                        const query = 'UPDATE usuarios SET password = ? WHERE resetToken = ? AND expireToken >' + "'" + parseadoFechaAhoritaa + "'";
                        await db.query(query, [hash, token], (err, result) => {
                            if (err) {
                                console.log(err);
                                res.json({
                                    err,
                                    mensaje: 'error en la actualización de contraseña'
                                })
                            } else {
                                res.json({
                                    mensaje: "La actualización de contraseña fue un éxito"
                                })
                            }

                        })
                    } else {
                        res.json({
                            mensaje: 'La contraseña no se pudo cambiar porque el link de actualización de contraseña expiró'
                        })
                    }
                })
            }
        })
})

app.get('/logout', (req, res) => {
    res.clearCookie('access-token');
    res.json({
        mensaje: 'Sesión cerrada con éxito',
        logout: true
    });

})

app.post('/publicarServicio', async (req, res) => {
    const titulo = req.body.titulo;
    const value = req.body.value;
    const file = req.body.file;

    await db.query(
        "INSERT INTO servicios(titulo,contenido,file) VALUES (?,?,?)",
        [titulo, value, file],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.json({
                    mensaje: "Se ha añadido con éxito",
                    file: file
                });
            }
        }
    );

})

app.get('/getServicio', async (req, res) => {
    const query = 'SELECT * FROM servicios';
    await db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    })
})

app.get('/getServicioIndividual/:id', (req, res) => {
    const query = 'SELECT * FROM servicios WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                result,
                mensaje: "ando acá",
                id: req.params.id
            });
        }
    })
})

app.get('/getAlumnoIndividual/:id', (req, res) => {
    const query = 'SELECT * FROM alumnos WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                result,
                mensaje: "ando acá",
                id: req.params.id
            });
        }
    })
})

app.post('/editarServicio', async (req, res) => {
    const id = req.body.id;
    const titulo = req.body.titulo;
    const value = req.body.value;
    const file = req.body.file
    const query = 'UPDATE servicios SET titulo = ?, contenido = ?, file = ? WHERE id = ?';
    await db.query(query, [titulo, value, file, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                mensaje: 'Se ha editado con éxito',
                result: result
            });
        }
    })
})


app.post('/uploadsServicios-editDel/:id', (req, res) => {
    const query = 'SELECT file FROM servicios WHERE id = ?'
    db.query(query, req.params.id, (err, result) => {
        if (result[0].file !== "") {
            const query2 = 'SELECT count(*) AS count FROM servicios WHERE file = ?'
            db.query(query2, result[0].file, (err, result2) => {
                if (result2[0].count < 2) {
                    fs.unlinkSync(`${__dirname}/.././frontend/build${result[0].file}`)
                    res.json({ filePath: "" })
                } else {
                    res.json({ filePath: "" })
                }
            })
        } else {
            res.json({ filePath: "" })
        }
    })
})
app.post('/uploads-editServicio/:id', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-servicios/" + fileN
    var exist = false;

    const query = 'SELECT file FROM servicios'
    db.query(query, (err, result) => {
        const query2 = 'SELECT file FROM servicios WHERE id = ? LIMIT 1'
        db.query(query2, req.params.id, (err, result2) => {
            result.map((val) => {
                if (val.file === filePath) {
                    exist = true;
                }
            })
            if (exist) {
                const queryCount = 'SELECT count(*) AS count FROM servicios WHERE file = ?'
                db.query(queryCount, result2[0].file, (err, resultCount) => {
                    if (resultCount[0].count == 1 && result2[0].file != "" && result2[0].file != filePath) {
                        fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                    }
                })
                res.json({ fileName: file.name, filePath: filePath })
            }
            else {
                if (result2[0].file != "") {
                    const query3 = 'SELECT count(*) AS count FROM servicios WHERE file = ?'
                    db.query(query3, result2[0].file, (err, result3) => {
                        if (result3[0].count == 1 && result2[0].file != "") {
                            fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                        }
                    })
                }

                file.mv(`${__dirname}/.././frontend/build/uploads-servicios/${fileN}`, err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.json({ fileName: file.name, filePath: filePath })
                })
            }
        })
    })
})

app.get('/deleteServicio/:id', (req, res) => {
    const query = 'DELETE FROM servicios WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/getAlumnos', (req, res) => {
    db.query('SELECT * FROM Alumnos ORDER BY id DESC', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/uploadsServicios', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-servicios/" + fileN
    var exist = false;

    db.query('SELECT file FROM servicios', (err, result) => {
        result.map((val) => {
            if (val.file === filePath) {
                exist = true;
            }
        })
        if (exist) {
            res.json({ fileName: file.name, filePath: filePath })
        }
        else {
            if (req.files === null) {
                return res.status(400).json({ msg: 'Ningún archivo fue subido' });

            }


            file.mv(`${__dirname}/.././frontend/build/uploads-servicios/${fileN}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath: filePath })
            })
        }
    })


})

app.post('/uploadsAlumnos', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-alumnos/" + fileN
    var exist = false;

    db.query('SELECT file FROM alumnos', (err, result) => {
        result.map((val) => {
            if (val.file === filePath) {
                exist = true;
            }
        })
        if (exist) {
            res.json({ fileName: file.name, filePath: filePath })
        }
        else {
            if (req.files === null) {
                return res.status(400).json({ msg: 'Ningún archivo fue subido' });

            }


            file.mv(`${__dirname}/.././frontend/build/uploads-alumnos/${fileN}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath: filePath })
            })
        }
    })


})

app.post('/publicarAlumno', async (req, res) => {
    const titulo = req.body.titulo;
    const value = req.body.value;
    const file = req.body.file;

    await db.query(
        "INSERT INTO alumnos(titulo,contenido,file) VALUES (?,?,?)",
        [titulo, value, file],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.json({
                    mensaje: "Se ha añadido con éxito",
                    file: file
                });
            }
        }
    );

})
app.get('/getAlumnoIndividual/:id', (req, res) => {
    const query = 'SELECT * FROM alumnos WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/deleteAlumno/:id', (req, res) => {
    const query = 'DELETE FROM alumnos WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                result,
                mensaje: 'Se ha eliminado con éxito el artículo'
            })
        }
    })
})
app.post('/uploadsAlumnos-editDel/:id', (req, res) => {
    const query = 'SELECT file FROM alumnos WHERE id = ?'
    db.query(query, req.params.id, (err, result) => {
        if (result[0].file !== "") {
            const query2 = 'SELECT count(*) AS count FROM alumnos WHERE file = ?'
            db.query(query2, result[0].file, (err, result2) => {
                if (result2[0].count < 2) {
                    fs.unlinkSync(`${__dirname}/.././frontend/build${result[0].file}`)
                    res.json({ filePath: "" })
                } else {
                    res.json({ filePath: "" })
                }
            })
        } else {
            res.json({ filePath: "" })
        }
    })
})
app.post('/editarAlumno', async (req, res) => {
    const id = req.body.id;
    const titulo = req.body.titulo;
    const value = req.body.value;
    const file = req.body.file
    const query = 'UPDATE alumnos SET titulo = ?, contenido = ?, file = ? WHERE id = ?';
    await db.query(query, [titulo, value, file, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                mensaje: 'Se ha editado con éxito',
                result: result
            });
        }
    })
})

app.post('/uploads-editAlumno/:id', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-alumnos/" + fileN
    var exist = false;

    const query = 'SELECT file FROM alumnos'
    db.query(query, (err, result) => {
        const query2 = 'SELECT file FROM alumnos WHERE id = ? LIMIT 1'
        db.query(query2, req.params.id, (err, result2) => {
            result.map((val) => {
                if (val.file === filePath) {
                    exist = true;
                }
            })
            if (exist) {
                const queryCount = 'SELECT count(*) AS count FROM alumnos WHERE file = ?'
                db.query(queryCount, result2[0].file, (err, resultCount) => {
                    if (resultCount[0].count == 1 && result2[0].file != "" && result2[0].file != filePath) {
                        fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                    }
                })
                res.json({ fileName: file.name, filePath: filePath })
            }
            else {
                if (result2[0].file != "") {
                    const query3 = 'SELECT count(*) AS count FROM alumnos WHERE file = ?'
                    db.query(query3, result2[0].file, (err, result3) => {
                        if (result3[0].count == 1 && result2[0].file != "") {
                            fs.unlinkSync(`${__dirname}/./frontend/build${result2[0].file}`)
                            fs.unlinkSync(`${__dirname}/./frontend/build${result2[0].file}`)

                        }
                    })
                }

                file.mv(`${__dirname}/.././frontend/build/uploads-alumnos/${fileN}`, err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.json({ fileName: file.name, filePath: filePath })
                })
            }
        })
    })
})

app.post('/editarInstitucion', async (req, res) => {
    const id = req.body.id;
    const titulo = req.body.titulo;
    const value = req.body.value;
    const file = req.body.file
    const query = 'UPDATE institucion SET titulo = ?, contenido = ?, file = ? WHERE id = ?';
    await db.query(query, [titulo, value, file, id], (err, result) => {
        if (err) {
            res.json({
                mensajeError: "ha ocurrido un error",
                err
            })
        } else {
            res.json({
                mensaje: 'Se ha editado con éxito',
                result: result
            });
        }
    })
})
app.get('/deleteInstitucion/:id', (req, res) => {
    const query = 'DELETE FROM institucion WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                result,
                mensaje: 'Se ha eliminado con éxito el artículo'
            })
        }
    })
})
app.post('/publicarInstitucion', async (req, res) => {
    const titulo = req.body.titulo;
    const value = req.body.value;
    const file = req.body.file;

    await db.query(
        "INSERT INTO institucion(titulo,contenido,file) VALUES (?,?,?)",
        [titulo, value, file],
        (err, result) => {
            if (err) {
                res.json({
                    err,
                    mensaje: "Ocurrió un error"
                })
            } else {
                res.json({
                    mensaje: "Se ha añadido con éxito",
                    file: file,
                    result
                });
            }
        }
    );

})
app.get('/getInstitucionIndividual/:id', (req, res) => {
    const query = 'SELECT * FROM institucion WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})
app.get('/getInstitucion', (req, res) => {
    db.query('SELECT * FROM institucion ORDER BY id DESC', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})
app.post('/uploadsInstitucion', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-institucion/" + fileN
    var exist = false;

    db.query('SELECT file FROM institucion', (err, result) => {
        result.map((val) => {
            if (val.file === filePath) {
                exist = true;
            }
        })
        if (exist) {
            res.json({ fileName: file.name, filePath: filePath })
        }
        else {
            if (req.files === null) {
                return res.status(400).json({ msg: 'Ningún archivo fue subido' });

            }


            file.mv(`${__dirname}/.././frontend/build/uploads-institucion/${fileN}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath: filePath })
            })
        }
    })


})
app.post('/uploads-editInstitucion/:id', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-institucion/" + fileN
    var exist = false;

    const query = 'SELECT file FROM institucion'
    db.query(query, (err, result) => {
        const query2 = 'SELECT file FROM institucion WHERE id = ? LIMIT 1'
        db.query(query2, req.params.id, (err, result2) => {
            result.map((val) => {
                if (val.file === filePath) {
                    exist = true;
                }
            })
            if (exist) {
                const queryCount = 'SELECT count(*) AS count FROM institucion WHERE file = ?'
                db.query(queryCount, result2[0].file, (err, resultCount) => {
                    if (resultCount[0].count == 1 && result2[0].file != "" && result2[0].file != filePath) {
                        fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                    }
                })
                res.json({ fileName: file.name, filePath: filePath })
            }
            else {
                if (result2[0].file != "") {
                    const query3 = 'SELECT count(*) AS count FROM institucion WHERE file = ?'
                    db.query(query3, result2[0].file, (err, result3) => {
                        if (result3[0].count == 1 && result2[0].file != "") {
                            fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                        }
                    })
                }

                file.mv(`${__dirname}/.././frontend/build/uploads-institucion/${fileN}`, err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.json({ fileName: file.name, filePath: filePath })
                })
            }
        })
    })
})
app.post('/uploadsInstitucion-editDel/:id', (req, res) => {
    const query = 'SELECT file FROM institucion WHERE id = ?'
    db.query(query, req.params.id, (err, result) => {
        if (result[0].file !== "") {
            const query2 = 'SELECT count(*) AS count FROM institucion WHERE file = ?'
            db.query(query2, result[0].file, (err, result2) => {
                if (result2[0].count < 2) {
                    fs.unlinkSync(`${__dirname}/.././frontend/build${result[0].file}`)
                    res.json({ filePath: "" })
                } else {
                    res.json({ filePath: "" })
                }
            })
        } else {
            res.json({ filePath: "" })
        }
    })
})

app.get('/getCardIndividual/:id', (req, res) => {
    const query = 'SELECT * FROM cards WHERE id = ?';
    db.query(query, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})
app.post('/editarCard', async (req, res) => {
    const id = req.body.id;
    const value = req.body.value;
    const file = req.body.file
    const query = 'UPDATE cards SET contenido = ?, file = ? WHERE id = ?';
    await db.query(query, [value, file, id], (err, result) => {
        if (err) {
            res.json({
                mensajeError: "ha ocurrido un error",
                err
            })
        } else {
            res.json({
                mensaje: 'Se ha editado con éxito',
                result: result
            });
        }
    })
})
app.post('/uploadsCard', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-cards/" + fileN
    var exist = false;

    db.query('SELECT file FROM cards', (err, result) => {
        result.map((val) => {
            if (val.file === filePath) {
                exist = true;
            }
        })
        if (exist) {
            res.json({ fileName: file.name, filePath: filePath })
        }
        else {
            if (req.files === null) {
                return res.status(400).json({ msg: 'Ningún archivo fue subido' });

            }


            file.mv(`${__dirname}/.././frontend/build/uploads-cards/${fileN}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                res.json({ fileName: file.name, filePath: filePath })
            })
        }
    })


})
app.post('/uploads-editCard/:id', (req, res) => {
    const file = req.files.file;
    if ('replaceAll' in String.prototype) {
        const fileN = file.name.replaceAll(" ", "-")
    } else {
        String.prototype.replaceAll = function (find, replace) {
            let exp = new RegExp(find, 'g');
            return this.replace(exp, replace);
        };
    }
    const fileN = file.name.replaceAll(" ", "-")
    const filePath = "/uploads-cards/" + fileN
    var exist = false;

    const query = 'SELECT file FROM cards'
    db.query(query, (err, result) => {
        const query2 = 'SELECT file FROM cards WHERE id = ? LIMIT 1'
        db.query(query2, req.params.id, (err, result2) => {
            result.map((val) => {
                if (val.file === filePath) {
                    exist = true;
                }
            })
            if (exist) {
                const queryCount = 'SELECT count(*) AS count FROM cards WHERE file = ?'
                db.query(queryCount, result2[0].file, (err, resultCount) => {
                    if (resultCount[0].count == 1 && result2[0].file != "" && result2[0].file != filePath) {
                        fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                    }
                })
                res.json({ fileName: file.name, filePath: filePath })
            }
            else {
                if (result2[0].file !== "") {
                    const query3 = 'SELECT count(*) AS count FROM cards WHERE file = ?'
                    db.query(query3, result2[0].file, (err, result3) => {
                        if (result3[0].count == 1 && result2[0].file != "") {
                            fs.unlinkSync(`${__dirname}/.././frontend/build${result2[0].file}`)
                        }
                    })
                }

                file.mv(`${__dirname}/.././frontend/build/uploads-cards/${fileN}`, err => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
                    res.json({ fileName: file.name, filePath: filePath })
                })
            }
        })
    })
})

app.post('/uploadsCard-editDel/:id', (req, res) => {
    const query = 'SELECT file FROM cards WHERE id = ?'
    db.query(query, req.params.id, (err, result) => {
        if (result[0].file !== "") {
            const query2 = 'SELECT count(*) AS count FROM cards WHERE file = ?'
            db.query(query2, result[0].file, (err, result2) => {
                if (result2[0].count < 2) {
                    fs.unlinkSync(`${__dirname}/.././frontend/build${result[0].file}`)
                    res.json({ filePath: "" })
                } else {
                    res.json({ filePath: "" })
                }
            })
        } else {
            res.json({ filePath: "" })
        }
    })
})





app.post('/', function (req, res, next) {
    res.json({mensaje: "todo un éxito"})
});

app.get('*', (req,res,next)=>{
    res.sendFile(path.join(__dirname+'frontend/build/index.html')); 
})

//app.use(myConn(mysql, conn, 'single'));