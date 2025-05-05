import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import valida from "../../../services/valida";
import insereLogUsuario from "../../../services/insereLogUsuário";
import Lottie from "lottie-react";
import animation from "../../../assets/animation.json";
import styles from './Login.module.css';
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  sessionStorage.clear();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIp(data.ip))
      .catch((error) => console.error("Erro ao obter IP:", error));
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    try {
      const isValid = await valida(user, password);
      if (isValid.length != 0) {
        sessionStorage.setItem(0,user);
        await insereLogUsuario(dataAtual, 'Acesso Sistema', isValid[0].id, 'Usuário: '+sessionStorage.getItem(0)+' acessou o sistema em: '+dataAtual+' com o IP: '+ip);
        sessionStorage.setItem(3,isValid[0].level);
        navigate("/Dashboard");
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
      <div className={styles.container}>
        <div className={styles.esquerda}>
          <div className={styles.Imagem}>
            {/* <h2 className={styles.title1}>OnNet Comissões</h2> */}
            {/* <img src={animation} alt="" /> */}
              <Lottie animationData={animation} loop={true} />
          </div>
        </div>
        <div className={styles.direitaA}>
          <h2 className={styles.title} data-text="OnNet Comissões">OnNet Comissões</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                className={styles.input}
                placeholder='Usuário'
              />
            </div>
            <div className={styles.inputGroup} style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder='Senha'
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.botaoMostrar}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <button type="submit" className={styles.button}>Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
