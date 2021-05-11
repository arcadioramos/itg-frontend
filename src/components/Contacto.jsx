import React from 'react'
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

const Contacto = (() => {


    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [correo, setCorreo] = useState("");
    const [correoSend, setCorreoSend] = useState(0);
    
Axios.defaults.withCredentials = true;


    const onSubmit = async (e) => {
        if (asunto !== "" && mensaje !== "" && correo !== "") {
            Axios.post('https://itg-backend.herokuapp.com/sendContacto', {
                asunto: asunto,
                mensaje: mensaje,
                correo: correo
            }).then(() => {
                setCorreoSend(1)
                document.getElementById("formContacto").reset();
                setTimeout(function () { setCorreoSend(0) }, 2000)
                setAsunto("")
                setMensaje("")
            })
        }
        else {
            setCorreoSend(2)
            setTimeout(function () { setCorreoSend(0) }, 2000)
        }
    }

    return (
        <>
            <Header></Header>
            <NavbarITG></NavbarITG>
            <Container fluid className="mt-5 mb-5">
                <Row>
                    <Col lg={4} />
                    <Col lg={4}>
                        <Form id="formContacto">
                            {
                                correoSend === 1 && <Confirmacion mensaje="Correo enviado correctamente" />
                            }
                            {
                                correoSend === 2 && <RellenarCampos mensaje="Rellenar todos los campos" />
                            }
                            <Form.Group controlId="correo">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su correo" onChange={(event) => { setCorreo(event.target.value); }} />
                            </Form.Group>

                            <Form.Group controlId="asunto">
                                <Form.Label>Asunto</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el asunto" onChange={(event) => { setAsunto(event.target.value); }} />
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Mensaje</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Ingrese el mensaje" onChange={(event) => { setMensaje(event.target.value); }} />
                            </Form.Group>
                            <div className="buttons">
                            <Button variant="primary" onClick={onSubmit} >
                                    Enviar correo
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

        </>
    )
})

export default Contacto;