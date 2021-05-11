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

const FormularioCarreras = (() => {

    const [licenciatura, setLicenciatura] = useState("");
    const [codigo, setCodigo] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [perfil, setPerfil] = useState("");
    const [carreraAdd, setCarreraAdd] = useState(0);

    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Elige un archivo');
    const [uploadedFile, setUploadedFile] = useState({})
    const [message, setMessage] = useState('');
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;
    var filePathSave = ""



    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        if (file !== "") {
            try {
                const res = await Axios.post('/uploads-carrera', formData, {
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

        if (licenciatura !== "" && codigo !== "" && objetivo !== "" && perfil !== "") {
            Axios.post('/createOfertaAcademica', {
                licenciatura: licenciatura,
                codigo: codigo,
                objetivo: objetivo,
                perfil: perfil,
                file: filePathSave
            }).then(() => {
                setCarreraAdd(1)
                document.getElementById("formCarreras").reset();
                setTimeout(function () { setCarreraAdd(0) }, 2000)
                setLicenciatura("")
                setCodigo("")
                setFileName("Elige un archivo")
                setFile("")
            })
        }
        else {
            setCarreraAdd(2)
            setTimeout(function () { setCarreraAdd(0) }, 2000)
        }
    }

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

    return (
        <>{ mostrar && <>
            <Header></Header>
            <NavbarITG></NavbarITG>
            <Container fluid className="mt-5 mb-5">
                <Row>
                    <Col lg={4} />
                    <Col lg={4}>
                        <Form id="formCarreras">
                            {
                                carreraAdd === 1 && <Confirmacion mensaje="Oferta academica" />
                            }
                            {
                                carreraAdd === 2 && <RellenarCampos />
                            }
                            <Form.Group controlId="licenciatura">
                                <Form.Label>Licenciatura</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese la licenciatura" onChange={(event) => { setLicenciatura(event.target.value); }} />
                            </Form.Group>

                            <Form.Group controlId="codigo">
                                <Form.Label>Código</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el código" onChange={(event) => { setCodigo(event.target.value); }} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Objetivo</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Ingrese el objetivo" onChange={(event) => { setObjetivo(event.target.value); }} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Perfil</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Ingrese el perfil" onChange={(event) => { setPerfil(event.target.value); }} />
                            </Form.Group>

                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {fileName}
                                </label>
                            </div>
                            <div className="buttons">
                            <Button variant="primary" onClick={onSubmit} >
                                    Añadir Carrera
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

export default FormularioCarreras;