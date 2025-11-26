import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import clientAxios from '../../../config/axios'
import Alerta from '../../components/Alerta'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alert, setAlert] = useState([null, undefined]);

    const { cargando, auth, setAuth } = useAuth()

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(email == "" || password == "") {
            setAlert([2, "Todos los campos son obligatorios"]);
            return;
        }

        try {
            const a = await clientAxios.post('/users/login', {email: email, password: password})
            const token = a.data.token
            localStorage.setItem('token', token)
            const config = {
                headers: {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clientAxios('/users/profile', config)
            setAuth(data)
            navigate('/app/admin')
        } catch (error) {
            setAlert([2, error.response.data.msg])
            return;
        }
    }

    if (cargando) {
        return (
            <main style={
                {
                    height: "35em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }
            }>
                <h3>Cargando...</h3>
            </main>
        )
    }

    if (auth.id) {
        return (
            <Navigate to="/app/admin" />
        )
    }

    return (
        <main className="login">
            <div className="login-panel">
                <div className='center'>
                    <div className="login__title">
                        <i className="fa-solid fa-user"></i>
                    </div>
                </div>
                <div className="login__form">
                    <form onSubmit={handleSubmit}>
                        <div className='login__form__input'>
                            <div>
                                Email Address
                            </div>
                            <div className="input">
                                <i className="fa-solid fa-user"></i>
                                <input 
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='login__form__input'>
                            <div>
                                Password
                            </div>
                            <div className="input">
                                <i className="fa-solid fa-lock"></i>
                                <input 
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <input
                            className="login__form__button"
                            type="submit"
                            value="Iniciar Sesión"
                        />
                    </form>
                </div>
            </div>
            { alert[1] && <Alerta alert={alert}/> }
        </main>
    );
};

export default Login;
