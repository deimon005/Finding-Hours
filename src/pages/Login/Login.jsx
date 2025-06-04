import styles from './Login.module.css'

const Login = () => {
    return (
        <section className={styles.container}>
            <h2>Incio de Sesion</h2>
            <form action="#">
                <div className={styles.field}>
                    <label htmlFor="email">Correo Electronico</label>
                    <input type="email" id='email' name="email" placeholder='Ingrese su correo electronico' required/>
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" name="password" placeholder='Ingrese su contraseña'required/>
                </div>
                <button type="sumbit">Iniciar Sesion</button>
            </form>
        </section>
    )
} 

export default Login; 