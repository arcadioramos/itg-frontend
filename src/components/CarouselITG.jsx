import React, { useState, useEffect } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Button from 'react-bootstrap/Button'
import Delete from '@material-ui/icons/Delete'
import Axios from 'axios'
import PruebaModal from './PruebaModal'
import '../../src/App.css'

const CarouselITG = () => {
    const [counter, setCounter] = useState(0)
    const [eliminar, setEliminar] = useState(false)
    const [actualId, setActualId] = useState(0)
    const [carousellItems, setCarousellItems] = useState([])
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getCarousell').then((response) => {
            setCarousellItems(response.data);
        })
    }, [counter])

    useEffect(() => {
        if(counter>0){
            setEliminar(true)
        }
    }, [counter])

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

    

    const onClickHandler = (e, id) => {
        e.preventDefault();
        setActualId(id)
        setCounter(prev => prev+1)
    }

    return (
        <>
            <Carousel infiniteLoop="true" autoPlay="true" interval="3000" dynamicHeight='true' className="carrusel">
                {
                    carousellItems &&
                    carousellItems.map((val) => {
                        return <div className="carrusel">
                            <img src={val.file} alt="imagen" />
                            {mostrar &&
                            <div className="carruselDeleteDiv">
                                <Button onClick={(e) => onClickHandler(e, val.id)}>
                                    <Delete className="carruselDeleteIcon" />
                                </Button>
                            </div>
                            }
                        </div>
                    })
                }
            </Carousel>
            <div>
                {
                    eliminar &&
                    <PruebaModal actualId={actualId} change={Math.random()}/>
                }
            </div>

        </>
    )
}

export default CarouselITG;