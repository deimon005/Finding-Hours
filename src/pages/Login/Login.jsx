const Login = () => {
    return (
        <section>
            <form action="#">
                <div>
                    <label htmlFor="email">Correo Electronico</label>
                    <input type="email" id='email' name="email" required/>
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" name="password" required/>
                </div>
                <button type="sumbit">Iniciar Sesion</button>
            </form>
        </section>
    )
} 

export default Login; 