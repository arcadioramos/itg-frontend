import React from 'react'
import logoFooter from '../images/logo_footer.png'

const Footer = () => {
    return (
        <div className="footer">
            <div className="row">
                <div className="col-md-6">
                    <div className="imagenFooter">
                        <img id="logoFooter" src={logoFooter} alt="logoFooter" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="infoFooter">
                        <p>Carretera al Varadero Nacional km. 4 Sector Las Playitas, C.P. 85480 Guaymas, Sonora. Tel. (622) 221 53 67</p>
                        <p className="opcionesFooter">Aviso de Privacidad</p>
                        <p className="opcionesFooter">/</p>
                        <p className="opcionesFooter">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;