import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

const EditarCarrera = (() => {

    const [campoVacio, setCampoVacio] = useState(false)
    const [datos, setDatos] = useState("")
    const [licenciatura, setLicenciatura] = useState("");
    const [codigo, setCodigo] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [perfil, setPerfil] = useState("");
    const [carreraAdd, setCarreraAdd] = useState(0);
    const { id } = useParams();

    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Elige un archivo');
    const [uploadedFile, setUploadedFile] = useState({})
    const [message, setMessage] = useState('');
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;
    var filePathSave = ""

    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getDatosCarrera/' + id).then((response) => {
            setDatos(response.data[0]);
        })
    }, [id])

    useEffect(() => {
        setLicenciatura(datos.licenciatura);
        setCodigo(datos.codigo);
        setObjetivo(datos.objetivo);
        setPerfil(datos.perfil);
    }, [datos])

    useEffect(() => {
        if (licenciatura === "" || codigo === "" || objetivo === "" || perfil === "") {
            setCampoVacio(true)
        } else {
            setCampoVacio(false)
        }
    }, [licenciatura, codigo, objetivo, perfil])

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

    const handleLicenciaturaChange = (l) => {
        setLicenciatura(l)
    }

    const handleCodigoChange = (c) => {
        setCodigo(c)
    }

    const handleObjetivoChange = (o) => {
        setObjetivo(o)
    }

    const handlePerfilChange = (p) => {
        setPerfil(p)
    }

    const updateCarrera = (filePath) => {

            Axios.post('https://itg-backend.herokuapp.com/editCarrera', {
                licenciatura: licenciatura,
                codigo: codigo,
                objetivo: objetivo,
                perfil: perfil,
                id: id,
                file: filePath
            }).then(() => {
                setCarreraAdd(1)
                setTimeout(function () { setCarreraAdd(0) }, 2000)
                setFileName("Elige un archivo")
                setFile("")
            })
    }

    const onSubmit = async (e) => {
        if (campoVacio === false) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        if (file === "") {
            Axios.post(`/uploads-carreras-editDel/${id}`).then((response) => {
                const { filePath } = response.data;
                updateCarrera(filePath)
            })
        }

        if (file !== "") {
            try {
                const res = await Axios.post(`/uploads-carreras-edit/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }

                });

                const { fileName, filePath } = res.data;
                filePathSave = filePath

                setUploadedFile({ fileName, filePath });
                setMessage('Archivo subido')
                updateCarrera(filePath)

            } catch (err) {
                if (err.response.status === 500) {
                    setMessage("Hubo un problema con el servidor");
                } else {
                    setMessage(err.response.data.msg);
                }
            }
        }
    }
    else {
        setCarreraAdd(2)
        setTimeout(function () { setCarreraAdd(0) }, 2000)
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
                        <Form id="formCarreras">
                            {
                                carreraAdd === 1 && <Confirmacion mensaje="Oferta academica editada correctamente" />
                            }
                            {
                                carreraAdd === 2 && <RellenarCampos mensaje="Rellenar todos los campos" />
                            }
                            <Form.Group controlId="licenciatura">
                                <Form.Label>Licenciatura</Form.Label>
                                <Form.Control type="text" value={licenciatura} onChange={(event) => { const l = event.target.value; handleLicenciaturaChange(l); }} />
                            </Form.Group>

                            <Form.Group controlId="codigo">
                                <Form.Label>Código</Form.Label>
                                <Form.Control type="text" value={codigo} onChange={(event) => { const c = event.target.value; handleCodigoChange(c); }} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Objetivo</Form.Label>
                                <Form.Control as="textarea" rows={3} value={objetivo} onChange={(event) => { const o = event.target.value; handleObjetivoChange(o); }} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Perfil</Form.Label>
                                <Form.Control as="textarea" rows={3} value={perfil} onChange={(event) => { const p = event.target.value; handlePerfilChange(p); }} />
                            </Form.Group>

                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {fileName}
                                </label>
                            </div>
                            <div className="buttons">
                                <Button variant="primary" onClick={onSubmit} >
                                    Editar Carrera
                            </Button>
                                <Button>
                                    <Link to={`/ofertaAcademica/${id}`} className="link">
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

export default EditarCarrera;