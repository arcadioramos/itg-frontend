import React from 'react'
import Header from './Header';
import NavbarITG from './NavbarITG'
import NavbarContacto from './NavbarContacto'
import Footer from './Footer'

const MapaDelSitio = () => {
    return (
        <>
        <Header />
        <NavbarITG />
        <NavbarContacto />
        <div className="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3526.2268058334967!2d-110.89235726545246!3d27.895012434685587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86c970a075d21e87%3A0xbdbcabdc4ed64e81!2sInstituto%20Tecnol%C3%B3gico%20de%20Guaymas!5e0!3m2!1ses-419!2smx!4v1589587298250!5m2!1ses-419!2smx" 
            border={0}
            aria-hidden={false}
            tabindex={0}
            width={600}
            height={450}
            frameBorder={0}
        ></iframe>
        </div>
        <Footer />
        </>
    )
}

export default MapaDelSitio;