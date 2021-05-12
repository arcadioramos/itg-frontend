import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import Axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().email("El correo debe ser válido").required("El correo debe ser válido"),
    password: yup.string().min(4,'Ingrese una contraseña mínimo 4 caracteres').max(15,'Ingrese una contraseña máximo 15 caracteres').required("Ingrese una contraseña entre 4 y 15 caracteres"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null]),

});
const RegistroLogin = () => {

    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(false);
    const [rol, setRole] = useState('');
    const [rolReg, setRoleReg] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [mensajeLog, setMensajeLog] = useState('')
    const [mensajeLogT, setMensajeLogT] = useState('')
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),

    })
    const [mensajeRegistrado, setMensajeRegistrado] = useState('');
    const [mensajeRegistradoT, setMensajeRegistradoT] = useState('');

    const submitForm = (data) => {
        Axios.post('https://itg-backend.herokuapp.com/checkEmailDuplicated', {
            email: emailReg

        }).then((response) => {

            if (response.data.duplicated === true) {
                setMensajeRegistrado("El correo utilizado ya está en uso");
                setTimeout(function () { setMensajeRegistrado('') }, 5000)
            } else {
                registrar();
                setMensajeRegistradoT("El usuario fue registrado exitosamente");
                setTimeout(function () { setMensajeRegistradoT('') }, 5000)
            }
        })

    }
    useEffect(() => {
        Axios.get('https://itg-backend.herokuapp.com/getToken', {
        }).then((response) => {
            if (response.data.authorized === true) {
                console.log("estoy autorizado " + response.data.authorized)
                setAuth(true)
                if(response.data.authData.role === 'admin'){
                    setMostrar(true)
                }else{
                    setMostrar(false)
                    window.location = '/'
                }
            } else {
                console.log("no estoy autorizado" + response.data.authorized)

            }
        })
    }, [])

    //Si o si se debe escribir esto para que funcione la sesión
    Axios.defaults.withCredentials = true;

    const registrar = () => {
        Axios.get('https://itg-backend.herokuapp.com/getToken', {
        }).then((response) => {
            if (response.data.authorized === true) {
                Axios.post('/registrar',
                    {
                        email: emailReg,
                        password: passwordReg,
                        role: rolReg
                    }).then((response) => {
                        console.log(response);
                        return true;
                    })
            } else {
                console.log("no estoy autorizado" + response.data.authorized)
                window.location = '/'
            }
        })


    }


    const login = () => {
        Axios.post('https://itg-backend.herokuapp.com/login', {
            email: email,
            password: password
        }).then((response) => {
            console.log(response);
            if (!response.data.auth) {
                console.log(response.data.mensaje);
                setMensajeLog(response.data.mensaje);
                setTimeout(function () { setMensajeLog('') }, 5000)

            } else {
                setRole(response.data.user.role);
                console.log(response.data.user.role);
                var rolillo = response.data.user.role;

                if(rolillo === 'admin'){
                    setMostrar(true)
                    console.log(rol + "rooooool")
                    console.log('mostrar true')
                }else{
                    setMostrar(false)
                    console.log(rol + "rooooool")
                    console.log('mostrar false')
                }
                
                
                
                setMensajeLogT('Sesión iniciada correctamente');
                window.location = '/login'
                setTimeout(function () { setMensajeLogT('') }, 5000)

            }
        })
    }


    return (

        <>
            <Header></Header>
            <NavbarITG></NavbarITG>
            { auth === false &&
                <div className="container">
                    <div className="row">
                        <div className="lg-3" />
                        <div className="lg-9 mt-5 login-form">


                            
                                <h1 className="text-center">Inicio de sesión</h1>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Ingrese su usuario" name="email" required="required" onChange={(e) => { setEmail(e.target.value) }} />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Ingrese su contraseña" name="password" required="required" onChange={(e) => { setPassword(e.target.value) }} />
                                </div>
                                <div className="form-group">
                                    <button onClick={login} class="btn btn-primary btn-block">Iniciar sesión</button>
                                </div>

                                {mensajeLog !== '' && <p className='alert alert-danger'>{mensajeLog}</p>}
                            

                        </div>
                        <div className="lg-3" />
                    </div>
                </div>
            }

            {
                mostrar &&
                <div className="container">
                    <div className="row">
                        <div className="lg-3" />
                        <div className="lg-9 mt-5 login-form">
                            <form onSubmit={handleSubmit(submitForm)}>
                                <h1 className="text-center">Registro de usuario</h1>
                                <div className="form-group">
                                    <p>Ingrese un correo:</p>
                                    <input type="text" className="form-control" placeholder="Ingrese un correo" name="email" required="required" onChange={(e) => setEmailReg(e.target.value)} ref={register} />
                                    <strong>{errors.email?.message}</strong>
                                </div>
                                <div className="form-group">
                                    <p>Ingrese una contraseña:</p>
                                    <input type="password" className="form-control" placeholder="Ingrese contraseña" name="password" required="required" onChange={(e) => { setPasswordReg(e.target.value) }} ref={register} />
                                    <strong>{errors.password?.message}</strong>
                                </div>
                                <div className="form-group">
                                    <p>Confirme su contraseña:</p>
                                    <input type="password" className="form-control" placeholder="Confirmar contraseña" name="confirmPassword" required="required" onChange={(e) => { setPasswordReg(e.target.value) }} ref={register} />
                                    <strong>{errors.confirmPassword && "Las contraseñas deben coincidir"}</strong>
                                </div>


                                <p>Seleccione el rol que tendrá el usuario:</p>
                                <div class="custom-control custom-radio">
                                    <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input" onChange={(e) => { setRoleReg('moderador') }} />
                                    <label class="custom-control-label" for="customRadio1">Moderador</label>
                                </div>
                                <div class="custom-control custom-radio">
                                    <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input" onChange={(e) => { setRoleReg('admin') }} />
                                    <label class="custom-control-label" for="customRadio2">Administrador</label>
                                </div>

                                <div className="form-group mt-3" >
                                    <input type="submit" class="btn btn-primary btn-block" id="submit" value="Registrar usuario"></input>
                                </div>
                                {mensajeRegistrado !== '' && <p className=' alert alert-danger'>{mensajeRegistrado}</p>}
                                {mensajeRegistradoT !== '' && <p className='alert alert-success'>{mensajeRegistradoT}</p>}
                            </form>

                        </div>
                        <div className="lg-3" />
                    </div>
                </div>
            }





            <Footer></Footer>

        </>
    )


}

export default RegistroLogin;