import React, { useState, useEffect } from 'react'
import Header from './Header';
import NavbarITG from './NavbarITG'
import NavbarContacto from './NavbarContacto'
import Footer from './Footer'
import Button from 'react-bootstrap/Button'
import Axios from 'axios'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

const CrudMoodle = () => {
    const [moodleList, setMoodleList] = useState([])
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getMoodle').then((response) => {
            setMoodleList(response.data);
        })
    }, [])

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

    return (
        <>{mostrar && <>
            <Header />
            <NavbarITG />
            <NavbarContacto />
            {
                moodleList &&
                moodleList.map((val, key) => {
                    return <div className="moodle">
                        <h3 key={val.id} className="avisoTitulo">{val.titulo}</h3>
                        <p>{val.servidor}</p>
                        <div className="moodleButtons">
                        <Button className="button">
                            <Link to={`/editarMoodle/${val.id}`} className="link">
                                Editar
                                </Link>
                        </Button>
                        <Button className="button">
                            <Link to={`/eliminarMoodle/${val.id}`} className="link">
                                Eliminar
                                </Link>
                        </Button>
                        </div>
                    </div>
                })
            }
            <Footer />
        </>}</>
    )
}

export default CrudMoodle;