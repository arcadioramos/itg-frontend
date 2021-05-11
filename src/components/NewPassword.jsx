import React, { useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import Axios from 'axios';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

const schema = yup.object().shape({
    password: yup.string().min(4, 'Ingrese una contraseña mínimo 4 caracteres').max(15, 'Ingrese una contraseña máximo 15 caracteres').required("Ingrese una contraseña entre 4 y 15 caracteres"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null]),

});




const NewPassword = () => {
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const { token } = useParams();
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),

    })
    const nuevaContraseña = () => {
        Axios.post('https://itg-backend.herokuapp.com/newPassword', {
         password,token
        }).then((response) => {
            console.log(response);
            setMensaje(response.data.mensaje)
            setTimeout(function () { 
                setMensaje('') 
                window.location = '/'
            
            }, 5000); 

        })
    }



    return (

        <>
            <Header></Header>
            <NavbarITG></NavbarITG>

            <div className="container">
                <div className="row">
                    <div className="lg-3" />
                    <div className="lg-9 mt-5 login-form">

                        <h1 className="text-center">Crear nueva contraseña</h1>
                        {mensaje !== '' && <p className='alert alert-success'>{mensaje}</p>}
                        <div className="form-group">
                            <p>Ingrese una contraseña:</p>
                            <input type="password" className="form-control" placeholder="Ingrese contraseña" name="password" required="required" onChange={(e) => { setPassword(e.target.value) }} ref={register} />
                            <strong>{errors.password?.message}</strong>
                        </div>
                        <div className="form-group">
                            <p>Confirme su contraseña:</p>
                            <input type="password" className="form-control" placeholder="Confirmar contraseña" name="confirmPassword" required="required" onChange={(e) => { setPassword(e.target.value) }} ref={register} />
                            <strong>{errors.confirmPassword && "Las contraseñas deben coincidir"}</strong>
                        </div>
                        <div className="form-group mt-3" >
                            <button class="btn btn-primary btn-block" id="submit" value="Registrar usuario" onClick={handleSubmit(nuevaContraseña)}>Cambiar contraseña</button>
                        </div>
                    </div>
                </div>
            </div>


            <Footer></Footer>

        </>
    )


}

export default NewPassword;