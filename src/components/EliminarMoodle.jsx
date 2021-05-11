import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Header from './Header';
import NavbarITG from './NavbarITG'
import NavbarContacto from './NavbarContacto'
import Footer from './Footer'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Axios from 'axios'
import '../../src/App.css'


const EliminarMoodle = () => {

    const { id } = useParams()
    const [moodleData, setMoodleData] = useState([])
    const [moodleAdd, setMoodleAdd] = useState(0);
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getMoodleData/' + id, {
        }).then((response) => {
            setMoodleData(response.data[0])
        })
    }, [id])

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

    const onSubmit = async (e) => {
        e.preventDefault();
        Axios.get('https://itg-backend.herokuapp.com/deleteMoodle/' + id, {
        }).then(() => {
            setMoodleAdd(1)
        })
    
    }


    return (
        <>
        {mostrar && <>
        <div>
            <Header />
            <NavbarITG />
            <NavbarContacto />
            {
                moodleAdd === 0 &&
                <Container>
                    <Row >
                        <Col lg={1}></Col>
                        <Col lg={8}><h1>¿Desea eliminar este elemento moodle?</h1></Col>
                        <Col lg={3}></Col>
                    </Row>
                    <Row>
                        <Col lg={1}></Col>
                        <Col lg={4}><h4>Titulo: </h4> <p>{moodleData.titulo}</p></Col>
                        <Col lg={4}><h4>Servidor: </h4> <p>{moodleData.servidor}</p></Col>
                        <Col lg={3}></Col>

                    </Row>
                    <Row>
                        <Col lg={1}></Col>
                        <Col lg={4}>
                            <Button className="button" onClick={onSubmit}>
                                Si
                        </Button>
                            <Button className="button">
                                <Link to="/crudMoodle" className="link">
                                    No
                            </Link>
                            </Button>
                        </Col>
                        <Col lg={4}>

                        </Col>
                        <Col lg={3}></Col>

                    </Row>


                </Container>
            }
            {
                moodleAdd === 1 &&
                <Container>
                    <Row >
                        <Col lg={1}></Col>
                        <Col lg={8}><h1>Elemento moodle eliminado exitosamente</h1></Col>
                        <Col lg={3}></Col>
                    </Row>
                    <Row>
                        <Button className="button">
                            <Link to="/crudMoodle" className="link">
                                Regresar
                            </Link>
                        </Button>
                    </Row>
                </Container>
            }
            <Footer />
        </div >
        </>}</>
    )
}

export default EliminarMoodle;