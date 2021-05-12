import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css';
import '../../src/App.css'

const NavbarITG = () => {

  const [counter, setCounter] = useState(0)
  const [ofertaAcademicaList, setofertaAcademicaList] = useState([]);
  const [counterServicio, setCounterServicio] = useState(0)
  const [serviciosList, setServiciosList] = useState([]);
  const [counterAlumnos, setCounterAlumno] = useState(0)
  const [alumnosList, setAlumnosList] = useState([]);
  const [counterInstitucion, setCounterInstitucion] = useState(0)
  const [institucionList, setInstitucionList] = useState([]);
  const [counterMoodle, setCounterMoodle] = useState(0)
  const [moodleList, setMoodleList] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const history = useHistory();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get('/getCarreras').then((response) => {
      setofertaAcademicaList(response.data);
    })
  }, [counter])

  useEffect(() => {
    Axios.get('/getServicio').then((response) => {
      setServiciosList(response.data);
      console.log(response.data)
    })
  }, [counterServicio])
  useEffect(() => {
    Axios.get('/getAlumnos').then((response) => {
      setAlumnosList(response.data);
      console.log(response.data)
    })
  }, [counterAlumnos])
  useEffect(() => {
    Axios.get('/getMoodle').then((response) => {
      setMoodleList(response.data);
    })
  }, [counterMoodle])
  useEffect(() => {
    Axios.get('/getInstitucion').then((response) => {
      setInstitucionList(response.data);
      console.log(response.data)
    })
  }, [counterInstitucion])


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

  const onClickHandler = (e, s) => {
    e.preventDefault()
    window.open(s, "_blank")
  }
  const onClickInicio = (e, s) => {
    e.preventDefault()
    history.push('/')
  }

  const cerrarSesion = () => {
    Axios.get('/logout', {
    }).then((response) => {
      history.push('/')
    })
  }
  const iniciarSesion = () => {
    history.push('/login')
  }
  const menu = () => {
    history.push('/menu')
  }


  return (
    <>
      <Navbar bg="light" expand="lg">

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={onClickInicio}>Inicio</Nav.Link>
            <NavDropdown title="Institución" id="basic-nav-dropdown" onClick={() => setCounter(prev => prev + 1)}>
              {
                institucionList &&
                institucionList.map((val) => {
                  return <NavDropdown.Item>
                    <Link to={`/institucionindividual/${val.id}`}>
                      {val.titulo}
                    </Link>
                  </NavDropdown.Item>
                })
              }

            </NavDropdown>
            <NavDropdown title="Oferta académica" id="basic-nav-dropdown" onClick={() => setCounter(prev => prev + 1)}>
              {
                ofertaAcademicaList &&
                ofertaAcademicaList.map((val) => {
                  return <NavDropdown.Item>
                    <Link to={`/ofertaAcademica/${val.id}`}>
                      {val.licenciatura}
                    </Link>
                  </NavDropdown.Item>
                })
              }
            </NavDropdown>
            <NavDropdown title="Alumnos" id="basic-nav-dropdown" onClick={() => setCounterAlumno(prev => prev + 1)}>
              {
                alumnosList &&
                alumnosList.map((val) => {
                  return <NavDropdown.Item>
                    <Link to={`/alumnosindividual/${val.id}`}>
                      {val.titulo}
                    </Link>
                  </NavDropdown.Item>
                })
              }

            </NavDropdown>
            <NavDropdown title="Moodle" id="basic-nav-dropdown" onClick={() => setCounterMoodle(prev => prev + 1)}>
              {
                moodleList &&
                moodleList.map((val) => {
                  return <NavDropdown.Item onClick={(e) => onClickHandler(e, val.servidor)}>
                    {val.titulo}
                  </NavDropdown.Item>
                })
              }

            </NavDropdown>
            <NavDropdown title="Servicios" id="basic-nav-dropdown" onClick={() => setCounterServicio(prev => prev + 1)}>
              {
                serviciosList &&
                serviciosList.map((val) => {
                  return <NavDropdown.Item>
                    <Link to={`/serviciosindividual/${val.id}`}>
                      {val.titulo}
                    </Link>
                  </NavDropdown.Item>
                })
              }

            </NavDropdown>


          </Nav>
          {mostrar &&
            <Button variant="outline-primary mr-2" onClick={(e) => { e.preventDefault(); menu() }}>Menu</Button>}
          {mostrar &&
            <Button variant="outline-primary" onClick={(e) => { e.preventDefault(); cerrarSesion() }}>Cerrar sesión</Button>
          }
          {!mostrar &&
            <Button variant="outline-primary" onClick={(e) => { e.preventDefault(); iniciarSesion() }}>Iniciar sesión</Button>
          }


        </Navbar.Collapse>
      </Navbar>
    </>

  );
}

export default NavbarITG;