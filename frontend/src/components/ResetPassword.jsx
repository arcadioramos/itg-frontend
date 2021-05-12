import React,{useState} from 'react'
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import Axios from 'axios';





const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [mensaje,setMensaje] = useState(''); 

    const recuperarContraseña = () => {
        Axios.post('/reset-password', {
            email: email,
        }).then((response) => {
            setMensaje(response.data.mensaje)
            setTimeout(function () { setMensaje('') }, 5000); 

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
                        <h1 className="text-center">Recuperar contraseña</h1>
                        {mensaje !== '' && <p className='alert alert-success'>{mensaje}</p>}
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Ingrese su usuario/correo" name="email" required="required" onChange={(e) => { setEmail(e.target.value) }} />
                        </div>
                        <div className="form-group">
                            <button onClick={recuperarContraseña} class="btn btn-primary btn-block">Enviar correo de recuperación de contraseña</button>
                        </div>


                    </div>
                    <div className="lg-3" />
                </div>
            </div>








            <Footer></Footer>

        </>
    )


}

export default ResetPassword;