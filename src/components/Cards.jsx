import React from 'react'
import NuevoIngreso from '../images/nuevo_ingreso.jpg'
import Reinscripcion from '../images/reinscripcion.jpg'
import Titulacion from '../images/titulacion.jpg'
import Egresados from '../images/egresados.jpg'
import '../../src/App.css'

const Cards = () => {

    const redireccion = (id)=>{
        
        window.location = '/CardIndividual/'+id
    }

    
    return (
        <div className="card-container">
            <div className="row">
            <div className="col-md-1"></div>
                <div className="col-md-2">
                    <div className="card" onClick={(e)=>{e.preventDefault(); redireccion(1)}}>
                        <img className="card-img-top" src={NuevoIngreso} alt="Nuevo ingreso"  />
                        <div className="card-img-overlay card-img-overlay h-100 d-flex flex-column justify-content-end">
                            <p className="card-text" >Nuevo ingreso</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card" onClick={(e)=>{e.preventDefault(); redireccion(2)}} >
                        <img className="card-img-top" src={Reinscripcion} alt="Reinscripcion" />
                        <div className="card-img-overlay h-100 d-flex flex-column justify-content-end">
                            <p className="card-text">Reinscripción</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card" onClick={(e)=>{e.preventDefault(); redireccion(3)}}>
                        <img className="card-img-top" src={Titulacion} alt="Titulacion" />
                        <div className="card-img-overlay card-img-overlay h-100 d-flex flex-column justify-content-end">
                            <p className="card-text">Titulación</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card" onClick={(e)=>{e.preventDefault(); redireccion(4)}} >
                        <img className="card-img-top" src={Egresados} alt="Egresados" />
                        <div className="card-img-overlay card-img-overlay h-100 d-flex flex-column justify-content-end">
                            <p className="card-text">Egresados</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card" onClick={(e)=>{e.preventDefault(); redireccion(5)}}>
                        <img className="card-img-top" src={Egresados} alt="Egresados" />
                        <div className="card-img-overlay card-img-overlay h-100 d-flex flex-column justify-content-end">
                            <p className="card-text">Egresados</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-1"></div>
            </div>
        </div>
    )
}

export default Cards;