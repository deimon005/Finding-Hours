import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault();
        navigate('/');
    };

    return (
        <section className={styles.container}>
            <h2>Registro de usuario</h2>
            <form onSubmit={handleRegister}>
                <div className={styles.field}>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" id="name" name="name" placeholder="Ingrese su nombre" required />
                </div>
                <div className={styles.field}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" id="email" name="email" placeholder="Ingrese su correo electrónico" required />
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" required />
                </div>
                <div className={styles.field}>
                    <label htmlFor="rol">Rol</label>
                    <select id="rol" name="rol" required>
                        <option value="Empleado">Empleado</option>
                        <option value="Admin">Admin o RRHH</option>
                    </select>
                </div>
                <button type="submit">Registrarse</button>
            </form>
        </section>
    );
};

export default Register;
