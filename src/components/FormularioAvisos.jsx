import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Moment from 'moment'
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

const FormularioAvisos = (() => {


    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [avisosAdd, setAvisosAdd] = useState(0);

    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Elige un archivo');
    //const [filePathSave, setFilePathSave] = useState("Hola");
    const [uploadedFile, setUploadedFile] = useState({})
    const [message, setMessage] = useState('');
    const fecha = Moment().format('YYYY/MM/DD')
    
const [mostrar, setMostrar] = useState(false);
Axios.defaults.withCredentials = true;
    var filePathSave = ""


    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getToken', {
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
        if(file !== ""){
        try {
            const res = await Axios.post('/uploads', formData, {
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

        if (titulo !== "" && descripcion !== "") {
            Axios.post('https://itg-backend.herokuapp.com/createAviso', {
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha,
                file: filePathSave
            }).then(() => {
                setAvisosAdd(1)
                document.getElementById("formAvisos").reset();
                setTimeout(function () { setAvisosAdd(0) }, 2000)
                setTitulo("")
                setDescripcion("")
                setFileName("Elige un archivo")
                setFile("")
            })
        }
        else {
            setAvisosAdd(2)
            setTimeout(function () { setAvisosAdd(0) }, 2000)
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
                        <Form id="formAvisos">
                            {
                                avisosAdd === 1 && <Confirmacion mensaje="Aviso añadido correctamente" />
                            }
                            {
                                avisosAdd === 2 && <RellenarCampos mensaje="Rellenar todos los campos" />
                            }
                            <Form.Group controlId="titulo">
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el título" onChange={(event) => { setTitulo(event.target.value); }} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Ingrese la información del aviso" onChange={(event) => { setDescripcion(event.target.value); }} />
                            </Form.Group>
                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {fileName}
                                </label>
                            </div>
                            <div className="buttons">
                            <Button variant="primary" onClick={onSubmit} >
                                    Añadir aviso
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

export default FormularioAvisos;