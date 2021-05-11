import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import Header from './Header';
import NavbarITG from './NavbarITG'
import Footer from './Footer'
import Axios from 'axios'



const Menu = () => {
    const [mostrar, setMostrar] = useState(false);
    const history = useHistory();
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

    const onClickAvisos = (e) => {
        e.preventDefault()
        history.push('/formularioAvisos')
    }

    const onClickOfertas = (e) => {
        e.preventDefault()
        history.push('/formularioCarreras')
    }

    const onClickAlumnos = (e) => {
        e.preventDefault()
        history.push('/formularioAlumnos')
    }

    const onClickServicios = (e) => {
        e.preventDefault()
        history.push('/formularioServicios')
    }

    const onClickCarousell = (e) => {
        e.preventDefault()
        history.push('/formularioCarousell')
    }

    const onClickMoodle = (e) => {
        e.preventDefault()
        history.push('/formularioMoodle')
    }

    const onClickInstitucion = (e) => {
        e.preventDefault()
        history.push('/formularioInstitucion')
    }

    const onClickEditarMoodle = (e) => {
        e.preventDefault()
        history.push('/formularioAvisos')
    }

    return (
        <> {mostrar && <>

            <Header></Header>
            <NavbarITG></NavbarITG>
            <div class="row mt-5 ml-1 mr-1 mb-5" >
                <div class="col-sm-3 mb-1">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Avisos</h4>
                            <p>Ir a formulario para añadir avisos</p>
                            <button onClick={onClickAvisos} class="btn btn-primary btn-lg">Formulario avisos</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 mb-1">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Oferta académica</h4>
                            <p>Ir a formulario para añadir oferta académica</p>
                            <button onClick={onClickOfertas} class="btn btn-primary btn-lg">Formulario oferta académica</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 mb-1">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Alumnos</h4>
                            <p>Ir a formulario para añadir sección en alumnos</p>
                            <button onClick={onClickAlumnos} class="btn btn-primary btn-lg">Formulario oferta académica</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 mb-1">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Servicios</h4>
                            <p>Ir a formulario para añadir sección en servicios</p>
                            <button onClick={onClickServicios} class="btn btn-primary btn-lg">Formulario oferta académica</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 mb-1">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Carrusel de imagenes</h4>
                        <p>Ir a formulario para añadir imagenes al carrusel</p>
                        <button onClick={onClickCarousell} class="btn btn-primary btn-lg">Formulario oferta académica</button>
                    </div>
                </div>
            </div>
            <div class="col-sm-3 mb-1">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Moodle</h4>
                            <p>Ir a formulario para añadir sección en moodle</p>
                            <button onClick={onClickMoodle} class="btn btn-primary btn-lg">Formulario oferta académica</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 mb-1">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Institución</h4>
                            <p>Ir a formulario para añadir sección en institución</p>
                            <button onClick={onClickInstitucion} class="btn btn-primary btn-lg">Formulario oferta académica</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3 mb-1">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Editar moodle</h4>
                            <p>Ir a sección para editar elementos del moodle</p>
                            <button onClick={onClickEditarMoodle} class="btn btn-primary btn-lg">Formulario oferta académica</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer></Footer>
        </>}</>
    )
}

export default Menu;