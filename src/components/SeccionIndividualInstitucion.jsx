import React, { useState, useEffect } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import PictureAsPdf from '@material-ui/icons/PictureAsPdf'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
const SeccionIndividualInstitucion = () => {

    const { id } = useParams();
    const [value, setValue] = useState('');
    const [file, setFile] = useState('');
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getInstitucionIndividual/' + id).then((response) => {
            console.log(response.data[0])
           setValue(response.data[0].contenido);
            setFile(response.data[0].file);

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

    const eliminarInstitucion = (async (e) => {

        Axios.get('https://itg-backend.herokuapp.com/deleteInstitucion/' + id, {
        }).then((response) => {
            console.log(response);
        })

    })
    const onSubmit = async (e) => {
        e.preventDefault();

        if (file === "") {
            eliminarInstitucion()
        }

        if (file !== "") {
            Axios.post(`https://itg-backend.herokuapp.com/uploadsInstitucion-editDel/${id}`).then(() => {
                eliminarInstitucion()
            })
        }

    }





    return (
        <>
            <Header></Header>
            <NavbarITG></NavbarITG>
            <div className="container">
                <div className="row">

                    <div className="col-lg-12 mt-5">
                        <div className="contenido-servicio mt-3 mb-3">{ReactHtmlParser(value)}
                        </div>
                        {file !== "" &&
                            <Link to={file} target="_blank">
                                <PictureAsPdf className="avisoFile"></PictureAsPdf>
                                <p>Descargar documento</p>
                            </Link>
                        }
                        {mostrar&&<>
                        <button className="button">
                            <Link to={`/editarInstitucion/${id}`} className="link">
                                Editar
                                            </Link>
                        </button>
                        <button className="button" onClick={onSubmit}>
                            Eliminar nota
                        </button>
                        </>}
                    </div>

                </div>
            </div>
            <Footer></Footer>
        </>

    )

}
export default SeccionIndividualInstitucion;