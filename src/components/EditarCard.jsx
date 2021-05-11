import React, { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser'
import Axios from 'axios';
import Footer from './Footer'
import Header from './Header'
import NavbarITG from './NavbarITG'



const EditarCard = (() => {
    
    const { id } = useParams();
    const [value, setValue] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [file, setFile] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');
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

    const updateCard = (filePath) => {
        
        Axios.post('/editarCard', {
            id: id,
            value: value,
            file: filePath
        }).then((response) => {
            
            setMensajeExito(response.data.mensaje);
            setMensajeError(response.data.mensajeError);
            setFileName("Elige un archivo")
            setTimeout(function () { setMensajeExito('') }, 5000);
            setTimeout(function () { setMensajeError('') }, 5000);
            setFile("")


        })
    }
    const onSubmit = async () => {
        console.log("simón")
        if (value === '' || value === null) {

            setMensaje('No se puede dejar vació el campo del contenido de la nota');
            setTimeout(function () { setMensaje('') }, 5000)
        } else {
            const formData = new FormData();
            formData.append('file', file);
            console.log(formData); 
            console.log(file);

            if (file === "") {
                Axios.post(`/uploadsCard-editDel/${id}`).then((response) => {
                    const { filePath } = response.data;
                    
                    updateCard(filePath)
                })
            }
            if (file !== "") {
                try {
                    const res = await Axios.post(`/uploads-editCard/${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }

                    });

                    const { fileName, filePath } = res.data;
                    


                    setUploadedFile({ fileName, filePath });
                    setMessage('Archivo subido')
                    updateCard(filePath);

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
            Axios.get('/getCardIndividual/' + id).then((response) => {
                
                setValue(response.data[0].contenido);
                console.log(response.data[0])
                

                
                


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
        <>{mostrar &&<>
            <Header></Header>
            <NavbarITG></NavbarITG>

            <div className="container">
                <div ckassName="row">
                    <div className="lg-3" />
                    <div className="lg-9 mt-5">
                        <h1 className="mb-3">Formulario Card</h1>
                        {mensajeExito !== '' && <p className='alert alert-success'>{mensajeExito}</p>}
                        <div className="form-group">

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
                        <button className="mt-3" onClick={(onSubmit)}>Editar</button>
                        {mensajeExito === 'Se ha editado con éxito' && <p className='alert alert-success'>{mensajeExito}</p>}
                        {mensajeError === 'ha ocurrido un error' && <p className='alert alert-danger'>{mensajeError}</p>}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>}</>

    )

})

export default EditarCard;