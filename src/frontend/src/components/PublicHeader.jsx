import { Link } from 'react-router-dom'

const PublicHeader = () => {
    return (
        <header className='public'>
            <div className="info">
                <div style={{ fontWeight: '600', }}>
                    Nutricionistas especializados con estándares de calidad
                </div>
                <div style={{ width: '5%', }}></div>
                <div className="icons">
                    <a href="https://www.facebook.com/Centro-Nutricional-Rodriguez-102559994841758" target="_blank">
                        <i className="fa-brands fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="https://www.instagram.com/centro_nutricional_rodriguez/?hl=es-la" target="_blank">
                        <i className="fa-brands fa-instagram fa-lg"></i>
                    </a>
                    <a href="https://api.whatsapp.com/send?phone=51983503728&amp;text=Necesito información" target="_blank">
                        <i className="fa-brands fa-whatsapp fa-lg"></i>
                    </a>
                </div>
                <div className="divisor" style={{ borderLeft: '1px solid #42657F', }}></div>
                <div className="cellphone">
                    <i className="fa-solid fa-mobile-screen-button"></i>
                    &nbsp;Cel.: 983503728 / 942849532
                </div>
                <div>
                    <i className="fa-solid fa-envelope"></i>
                    &nbsp;nativas.ventasaqp@gmail.com
                </div>
            </div>
            <nav>
                <Link className="center" to="/">
                    <img src="/menu/images/logo-1.png" alt="Centro Nutricional Rodriguez" style={{ width: '12.5rem', }} />
                </Link>
            </nav>
        </header>
    );
}

export default PublicHeader;
