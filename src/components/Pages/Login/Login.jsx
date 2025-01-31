import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import valida from "../../../services/valida";
import animation from '../../../assets/animation.gif'
import styles from './Login.module.css';

const Login = () => {
  sessionStorage.clear();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const isValid = await valida(user, password);
      if (isValid.length != 0) {
        sessionStorage.setItem(0,user);
        navigate("/Dashboard"); // Redireciona para a Dashboard
      } else {
        alert("Usuário ou senha inválidos!");
      }
    } catch (error) {
      console.error("Erro na validação:", error);
      alert("Erro ao validar o login. Tente novamente.");
    }
  };

  return (
    <div className={styles.Geral}>
      <div className={styles.Imagem}>
        <img src={animation} alt="" />
      </div>
      <div className={styles.container}>
        <h2 className={styles.title}>OnNet Comissões</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Usuário:</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;