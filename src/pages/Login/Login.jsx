import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSession = (event) => {
    event.preventDefault(); 
    
    const formData = new FormData(event.target);
    const accountType = formData.get('rol');

    if (accountType === 'Empleado') {
      navigate('/empleado');
    } else if (accountType === 'Admin') {
      navigate('/admin');
    }
  };

  return (
    <section className={styles.container}>
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSession}>
        <div className={styles.field}>
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="Rol">Rol</label>
          <select name="Rol" id="Rol">
            <option value="Empleado">Empleado</option>
            <option value="Admin">Administrado o RRHH</option>
          </select>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <h5>No tienes una cuenta, <a href="/register">Registrate aqui</a></h5>
    </section>
  );
};

export default Login;
