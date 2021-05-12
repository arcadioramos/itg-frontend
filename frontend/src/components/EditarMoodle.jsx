import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.css';
import '../../src/App.css'
import Axios from 'axios'
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import Confirmacion from './Confirmacion'
import { useParams } from 'react-router-dom'
import RellenarCampos from './RellenarCampos'

const EditarMoodle = (() => {

    const [campoVacio, setCampoVacio] = useState(false)
    const [titulo, setTitulo] = useState("");
    const [servidor, setServidor] = useState("");
    const [moodleAdd, setMoodleAdd] = useState(0);
    const [moodleData, setMoodleData] = useState([]);
    const { id } = useParams();

    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get('/getMoodleData/' + id, {
        }).then((response) => {
            setMoodleData(response.data[0])
        })
    }, [id])

    useEffect(() => {
        setTitulo(moodleData.titulo);
        setServidor(moodleData.servidor)
    }, [moodleData])

    useEffect(() => {
        if (titulo === "" || servidor === "") {
            setCampoVacio(true)
        } else {
            setCampoVacio(false)
        }
    }, [titulo, servidor])

    const handleTitleChange = (t) => {
        setTitulo(t)
    }
    
    const handleServerChange = (s) => {
        setServidor(s)
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

    const onSubmit = async (e) => {
        if (titulo !== "" && servidor !== "") {
            Axios.post('/editMoodle/' + id, {
                titulo: titulo,
                servidor: servidor
            }).then(() => {
                setMoodleAdd(1)
                setTimeout(function () { setMoodleAdd(0) }, 2000)
            })
        }
        else {
            setMoodleAdd(2)
            setTimeout(function () { setMoodleAdd(0) }, 2000)
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
                        <Form id="formMoodle">
                            {
                                moodleAdd === 1 && <Confirmacion mensaje="Elemento moodle editado correctamente" />
                            }
                            {
                                moodleAdd === 2 && <RellenarCampos mensaje="Rellenar todos los campos" />
                            }
                            <Form.Group controlId="titulo">
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" value={titulo} onChange={(event) => { const t = event.target.value; handleTitleChange(t); }} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Servidor</Form.Label>
                                <Form.Control type="text" value={servidor} onChange={(event) => { const s = event.target.value; handleServerChange(s); }} />
                            </Form.Group>
                            <div className="buttons">
                            <Button variant="primary" onClick={onSubmit} >
                                    Editar elemento
                            </Button>
                                <Button>
                                    <Link to="/crudMoodle" className="link">
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

export default EditarMoodle;