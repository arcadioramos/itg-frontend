import React, { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser'
import Axios from 'axios';
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

const schema = yup.object().shape({
    titulo: yup.string().min(4, 'El título debe contener al menos 4 caracteres').required("Ingrese el título que quiera que aparezca en la barra de navegación"),


});
const EditarServicio = (() => {
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),

    })
    const { id } = useParams();
    const [value, setValue] = useState('');
    const [titulo, setTitulo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [file, setFile] = useState('');
    const [uploadedFile, setUploadedFile] = useState({})
    const [message, setMessage] = useState('');
    const [fileName, setFileName] = useState('Elige un archivo');
    const [mostrar, setMostrar] = useState(false);
    Axios.defaults.withCredentials = true;

    const handleOnChange = (e, editor) => {

        const data = editor.getData();
        setValue(data);
    }
    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const updateServicio = (filePath) => {
        Axios.post('/editarServicio', {
            id: id,
            titulo: titulo,
            value: value,
            file: filePath
        }).then((response) => {
            console.log(response.data);
            setMensajeExito(response.data.mensaje);
            setTimeout(function () { setMensajeExito('') }, 5000);
            setFileName("Elige un archivo")
            setFile("")


        })
    }
    const onSubmit = async () => {
        if (value === '' || value === null) {

            setMensaje('No se puede dejar vació el campo del contenido de la nota');
            setTimeout(function () { setMensaje('') }, 5000)
        } else {
            const formData = new FormData();
            formData.append('file', file);

            if (file === "") {
                Axios.post(`/uploadsServicios-editDel/${id}`).then((response) => {
                    const { filePath } = response.data;
                    console.log(response.data)
                    updateServicio(filePath)
                })
            }

            if (file !== "") {
                try {
                    const res = await Axios.post(`/uploads-editServicio/${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }

                    });

                    const { fileName, filePath } = res.data;
                    


                    setUploadedFile({ fileName, filePath });
                    setMessage('Archivo subido')
                    updateServicio(filePath);

                } catch (err) {
                    if (err.response.status === 500) {
                        setMessage("Hubo un problema con el servidor");
                    } else {
                        setMessage(err.response.data.msg);
                    }
                }
            }




        }
    }


        useEffect(() => {
            Axios.get('/getServicioIndividual/' + id).then((response) => {
                
                
                setTitulo(response.data.result[0].titulo);
                setValue(response.data.result[0].contenido);
                

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
                    window.location = '/'
                }
            })
        }, [])

    return (
        <>{mostrar && <>
            <Header></Header>
            <NavbarITG></NavbarITG>

            <div className="container">
                <div ckassName="row">
                    <div className="lg-3" />
                    <div className="lg-9 mt-5">
                        <h1 className="mb-3">Formulario servicios</h1>
                        {mensajeExito !== '' && <p className='alert alert-success'>{mensajeExito}</p>}
                        <div className="form-group">
                            <h2>Título</h2>
                            <input type="text" className="form-control" placeholder="Ingrese el título" name="titulo" required="required" onChange={(e) => { setTitulo(e.target.value) }} ref={register} value={titulo} />
                            {errors.titulo?.message &&
                                <p className='aler alert-danger'>{errors.titulo?.message}</p>
                            }
                            <p className="mt-2">Seleccione un archivo si desea subir uno opcional</p>
                            <div className="custom-file ">

                                <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {fileName}
                                </label>
                            </div>
                        </div>
                        <h2>Contenido</h2>
                        <CKEditor editor={ClassicEditor}
                            data={value}
                            onChange={handleOnChange}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'numberedList', 'bulletedList', '|', 'insertTable',
                                    'tableColumn', 'tableRow', '|', 'undo', 'redo']
                            }}

                        />
                        {mensaje !== '' && <p className='alert alert-danger'>{mensaje}</p>}

                        <div className="contenido-servicio mt-3 mb-3"><h1>Previsualización</h1>{ReactHtmlParser(value)}</div>

                    </div>

                    <div className="lg-3">
                        <button className="mt-3" onClick={handleSubmit(onSubmit)}>Editar</button>
                        {mensajeExito !== '' && <p className='alert alert-success'>{mensajeExito}</p>}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>}</>

    )

})

export default EditarServicio;