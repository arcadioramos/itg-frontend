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


const FormularioCarousell = (() => {




    const [imageSelected, setImageSelected] = useState('Seleccione una imagen');
    const [message, setMessage] = useState("");
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;



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

    const uploadImage = () => {
        const formdata = new FormData();
        formdata.append("file", imageSelected);
        formdata.append("upload_preset", "wyz1clpz");
        if (imageSelected !== "") {
            if (!(/\.(jpg|png|gif)$/i).test(imageSelected.name)) {
                setMessage("Solo se permite subir archivos de tipo imagen('jpg o png')");
            } else {
                Axios.post('https://api.cloudinary.com/v1_1/arcadio-ramos/image/upload',
                formdata).then((response)=>{
                    console.log(response);
                })
            }


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

                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile" onChange={(e) => { setImageSelected(e.target.files[0], console.log(imageSelected))}} />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {imageSelected.name}
                                </label>
                            </div>
                            <div className="buttons">
                                <Button variant="primary" onClick={uploadImage} >
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