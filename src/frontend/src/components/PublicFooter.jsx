import { Link } from 'react-router-dom'

const PublicFooter = () => {
    return (
        <footer className='public'>
            <div className="info">
                <div>
                    <h5>
                        Dónde estamos
                    </h5>
                    <a href="#">
                        Psje. Don Alejo Mz.B,<br />Santiago de Surco - Lima.
                    </a>
                    <a href="#" style={{
                        marginTop: "0.25em"
                    }}>
                        Av. Alfonso Ugarte 524,<br />Cercado de Arequipa - Arequipa.
                    </a>
                </div>
                <div>
                    <h5>
                        Llámanos
                    </h5>
                    <a href="#">
                        <i className="fa fa-phone" />
                        &nbsp;Celular: 983 503 728
                    </a>
                    <a href="#">
                        <i className="fa fa-phone" />
                        &nbsp;Celular: 942 849 532
                    </a>
                    <a href="#">
                        Te llamamos nosotros
                    </a>
                </div>
                <div>
                    <h5>
                        Escríbanos
                    </h5>
                    <a href="#">
                        Por correo electrónico
                    </a>
                </div>
                <div>
                    <h5>
                        Síguenos
                    </h5>
                    <div className="social">
                        <a href="#"><i className="fab fa-facebook-f" /></a>
                        <a href="#"><i className="fab fa-instagram" /></a>
                        <a href="#"><i className="fab fa-twitter" /></a>
                        <a href="#"><i className="fab fa-youtube" /></a>
                    </div>
                </div>
            </div>
            <div className="foot">
                <div>
                    <img src="/menu/images/logo-2.png" alt="Centro Nutricional Rodríguez" style={{ width: '8.5rem' }} />
                </div>
                <a href="#">© Copyright 2024</a>
                <a href="#">Aviso Legal</a>
                <a href="#">Política de privacidad</a>
                <a href="#">Política de cookies</a>
                <a href="#">Política de devoluciones</a>
            </div>
        </footer>
    );
}

export default PublicFooter;
