import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.css';
import '../../src/App.css'
import { useState } from 'react';
import Axios from 'axios'
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import Confirmacion from './Confirmacion'
import RellenarCampos from './RellenarCampos'

const FormularioCarousell = (() => {


    const [imagenAdd, setImagenAdd] = useState(0);

    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Elige una imagen');
    const [uploadedFile, setUploadedFile] = useState({})
    const [message, setMessage] = useState('');
    
const [mostrar, setMostrar] = useState(false);
Axios.defaults.withCredentials = true;

    var filePathSave = ""

    useEffect(() => {
        Axios.get('/getToken', {
        }).then((response) => {
            if (response.data.authorized === true) {
                console.log("estoy autorizado " + response.data.authorized)
                setMostrar(true);
            } else {
                console.log("no estoy autorizado" + response.data.authorized)
                window.location = '/'
            }
        })
    }, [])

    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        if (file !== "") {
            if (!(/\.(jpg|png|gif)$/i).test(file.name)) {
                setImagenAdd(3);
                setTimeout(function () { setImagenAdd(0) }, 2000)
            } else {
                try {
                    const res = await Axios.post('/uploads-carousell', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }

                    });

                    const { fileName, filePath } = res.data;
                    filePathSave = filePath

                    setUploadedFile({ fileName, filePath });
                    setMessage('Archivo subido')

                } catch (err) {
                    if (err.response.status === 500) {
                        setMessage("Hubo un problema con el servidor");
                    } else {
                        setMessage(err.response.data.msg);
                    }
                }
            }

            if (filePathSave !== "") {
                Axios.post('/createCarousell', {
                    file: filePathSave
                }).then(() => {
                    setImagenAdd(1)
                    document.getElementById("formCarousell").reset();
                    setTimeout(function () { setImagenAdd(0) }, 2000)
                    setFileName("Elige una imagen")
                    setFile("")
                })
            }

        } else {
            setImagenAdd(2)
            setTimeout(function () { setImagenAdd(0) }, 2000)
        }
    }

    return (
        <>{mostrar && <>
            <Header></Header>
            <NavbarITG></NavbarITG>
            <Container fluid className="mt-5 mb-5">
                <Row>
                    <Col lg={4} />
                    <Col lg={4}>
                        <Form id="formCarousell">
                            {
                                imagenAdd === 1 && <Confirmacion mensaje="Imagen añadida correctamente" />
                            }
                            {
                                imagenAdd === 2 && <RellenarCampos mensaje="Favor de añadir la imagen" />
                            }
                            {
                                imagenAdd === 3 && <RellenarCampos mensaje="Solo se permiten imagenes" />
                            }
                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {fileName}
                                </label>
                            </div>
                            <div className="buttons">
                                <Button variant="primary" onClick={onSubmit} >
                                    Añadir imagen
                            </Button>
                                <Button>
                                    <Link to="/" className="link">
                                        Regresar
                                </Link>
                                </Button>
                            </div>
                        </Form>
                    </Col>
                    <Col lg={4} />

                </Row>
            </Container>


            <Footer></Footer>

        </>}</>
    )
})

export default FormularioCarousell;