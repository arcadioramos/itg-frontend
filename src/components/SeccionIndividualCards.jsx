import React, { useState, useEffect } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import PictureAsPdf from '@material-ui/icons/PictureAsPdf'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
const SeccionIndividualCards= () => {

    const { id } = useParams();
    const [value, setValue] = useState('');
    const [file, setFile] = useState('');
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;


    useEffect(() => {
        Axios.get('/getCardIndividual/' + id).then((response) => {
            console.log(response.data[0])
           setValue(response.data[0].contenido);
            setFile(response.data[0].file);

        })
    }, [id])

    useEffect(() => {
        Axios.get('/getToken', {
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
            <Header></Header>
            <NavbarITG></NavbarITG>
            <div className="container">
                <div className="row">

                    <div className="col-lg-12 mt-5">
                        <div className="contenido-servicio mt-3 mb-3">{ReactHtmlParser(value)}
                        </div>
                        {file &&
                            <Link to={file} target="_blank">
                                <PictureAsPdf className="avisoFile"></PictureAsPdf>
                                <p>Descargar documento</p>
                            </Link>
                        }
                        {mostrar &&<>
                        <button className="button">
                            <Link to={`/editarCard/${id}`} className="link">
                                Editar
                                            </Link>
                        </button>
                        </>}
                    </div>

                </div>
            </div>
            <Footer></Footer>
        </>

    )

}
export default SeccionIndividualCards;