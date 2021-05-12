import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Footer from './Footer';
import Header from './Header';
import NavbarContacto from './NavbarContacto';
import NavbarITG from './NavbarITG';
import Axios from 'axios'
import Button from 'react-bootstrap/Button'
import PictureAsPdf from '@material-ui/icons/PictureAsPdf'
import '../../src/App.css'

const OfertaAcademica = () => {
    const { id } = useParams();
    const [datosCarrera, setDatosCarrera] = useState([]);
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getOfertaAcademica/' + id).then((response) => {
            setDatosCarrera(response.data);
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
            }
        })
    }, [])

    return (
        <>
            <Header />
            <NavbarITG />
            <NavbarContacto />
            {
                datosCarrera &&
                datosCarrera.map((val) => {
                    var isImage = false
                    if ((/\.(jpg|png|gif)$/i).test(val.file)) {
                        isImage = true
                    } else {
                        isImage = false
                    }
                    return <div className="ofertaContainer">
                        <container fluid className="mt-5 mb-5">
                            <div className="row">
                                <div className="col-lg-1 " />
                                <div className="info-carrera col-lg-10">
                                    <h1>{val.licenciatura}</h1>
                                    <h2>{val.licenciatura}</h2>
                                    <h4>{val.codigo}</h4>
                                    <h3>Objetivo general</h3>
                                    <p>{val.objetivo}</p>
                                    <h3>Perfil de egreso</h3>
                                    <p className="perfilEgreso">{val.perfil}</p>
                                    {
                                        isImage === false &&
                                            val.file ?
                                            <Link to={val.file} target="_blank">
                                                Ver plan de estudios<PictureAsPdf className="avisoFile"></PictureAsPdf>
                                            </Link>
                                            :
                                            <p></p>
                                    }
                                    {
                                        isImage === true &&
                                            val.file ?
                                            <div>
                                                <a href={val.file} target="_blank">
                                                    <img src={val.file} className="img-fluid img-thumbnail" width="200px" height="200px" />
                                                </a>

                                            </div>
                                            :
                                            <p></p>
                                    }
                                </div>
                                {mostrar &&<>
                                <Button className="button">
                                    <Link to={`/editarCarrera/${val.id}`} className="link">
                                        Editar oferta academica
                                    </Link>
                                </Button>
                                <Button className="button">
                                    <Link to={`/eliminarCarrera/${val.id}`} className="link">
                                        Eliminar oferta academica
                                    </Link>
                                </Button>
                                </>}
                                <div className="col-lg-1" />
                            </div>
                        </container>
                    </div>
                })
            }
            <br>
            </br>
            <br>
            </br>
            <Button className="button">
                <Link to="/formularioCarreras" className="link">
                    Añadir oferta academica
                </Link>
            </Button>

            <Footer />
        </>
    )
}

export default OfertaAcademica;