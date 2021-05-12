import React from 'react'
import Header from './Header';
import NavbarITG from './NavbarITG'
import NavbarContacto from './NavbarContacto'
import Cards from './Cards'
import CarouselITG from './CarouselITG'
import Footer from './Footer'
import Feed from './Feed'

const Main = () => {
    return (
        <div>
            <Header />
            <NavbarITG />
            <NavbarContacto />
            <CarouselITG />
            <Cards />
            <Feed />
            <Footer />
        </div>
    )
}

export default Main;
