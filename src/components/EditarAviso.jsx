import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
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

const EditarAviso = (() => {

    const [campoVacio, setCampoVacio] = useState(false)
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [avisosAdd, setAvisosAdd] = useState(0);
    const { id } = useParams();
    const [datos, setDatos] = useState([])

    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Elige un archivo');
    const [message, setMessage] = useState('');
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getDatosAviso/' + id).then((response) => {
            setDatos(response.data[0]);
        })
    }, [id])

    useEffect(() => {
        setTitulo(datos.titulo);
        setDescripcion(datos.descripcion)
    }, [datos])

    useEffect(() => {
        if (titulo == "" || descripcion == "") {
            setCampoVacio(true)
        } else {
            setCampoVacio(false)
        }
    }, [titulo, descripcion])

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

    const updateAviso = (filePath) => {
        Axios.post('https://itg-backend.herokuapp.com/editAviso', {
            titulo: titulo,
            descripcion: descripcion,
            id: id,
            file: filePath
        }).then(() => {
            setAvisosAdd(1)
            setTimeout(function () { setAvisosAdd(0) }, 2000)
            setFileName("Elige un archivo")
            setFile("")
        })
    }

const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
}

const handleTitleChange = (t) => {
    setTitulo(t)
}

const handleDescriptionChange = (d) => {
    setDescripcion(d)
}

const onSubmit = async (e) => {
    if (campoVacio === false) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    if (file === "") {
        Axios.post(`/uploads-editDel/${id}`).then((response) => {
            const { filePath } = response.data;
            updateAviso(filePath)
        })
    }

    if (file !== "") {
        try {
            const res = await Axios.post(`/uploads-edit/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            });

            const { fileName, filePath } = res.data;

            setMessage('Archivo subido')
            updateAviso(filePath)
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
        setAvisosAdd(2)
        setTimeout(function () { setAvisosAdd(0) }, 2000)
    }

}

return (
    <>{ mostrar && <>
        <Header></Header>
        <NavbarITG></NavbarITG>
        <Container fluid className="mt-5 mb-5">
            <Row>
                <Col lg={4} />
                <Col lg={4}>
                    <Form id="formAvisos">
                        {
                            avisosAdd == 1 && <Confirmacion mensaje="Aviso editado correctamente" />
                        }
                        {
                            avisosAdd == 2 && <RellenarCampos mensaje="Rellenar todos los campos" />
                        }
                        <Form.Group controlId="titulo">
                            <Form.Label>Título</Form.Label>
                            <Form.Control type="text" value={titulo} onChange={(event) => { const t = event.target.value; handleTitleChange(t); }} />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} value={descripcion} onChange={(event) => { const d = event.target.value; handleDescriptionChange(d); }} />
                        </Form.Group>
                        <div className="custom-file mb-3">
                            <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                            <label className="custom-file-label" htmlFor="customFile">
                                {fileName}
                            </label>
                        </div>
                        <div className="buttons">
                            <Button variant="primary" onClick={onSubmit} >
                                Editar aviso
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

export default EditarAviso;