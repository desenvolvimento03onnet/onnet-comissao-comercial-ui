import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import ImagemUsuario from '../Modal Imagem/Modal';
import { loadImagemUsuario } from "../../../../services/loadImagemUsuario";
import { loadInfoUsuario } from "../../../../services/loadInfoUsuários";
import img from "../../../../assets/user.png";
import { Buffer } from 'buffer';
import style from './Imagem.module.css';

Modal.setAppElement("#root");

const Imagem = () => {
  const navigate = useNavigate();
  
    const retorna = async (e) => {
      e.preventDefault();
      navigate("/");
    };
    const [dados, setDados] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadImagemUsuario(sessionStorage.getItem(0), sessionStorage.getItem(1));
          
          setDados(carrega);
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, []);

    const [modalOpen, setModalOpen] = useState(false);

    const UserProfileModal = ({ isOpen, onClose }) => {
      return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className={style.modalContent} overlayClassName={style.modalOverlay}>
          <h2>Perfil do Usuário</h2>
          <form>
            <div className={style.inputs}>
              <label>Nome:</label>
              <input type="text" placeholder="Seu nome" className={style.input} defaultValue={dados.map((item) => {
                sessionStorage.setItem(2,item.id);
                return item.name;
              })} />
              <ImagemUsuario />
              {/* <br />
              <label>Senha:</label>
              <input type="password" placeholder="Sua Senha" className={style.input} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{1,10}$" defaultValue={dados.map((item) => {
                return Buffer.from(item.password, 'base64').toString('utf-8');
              })} id="inputSenha" /> */}
            </div>
            <br />
            <div className={style.btn}>
              {/* <button type="submit" className={style.saveBtn}>Salvar</button> */}
              <button className={style.trocaBtn}>Trocar Senha</button>
              <button onClick={onClose} className={style.closeBtn}>Fechar</button>
            </div>
          </form>
        </Modal>
      );
    };

  return (
      <div className={style.Imagem}>
        <div className={style.dropdown}>
          <div className={style.dropbtn}>
            <p>{dados.map((item) => {
              return item.name;
            })}</p>
            <img src={img} alt="" />
          </div>
          <div className={style.dropdownContent}>
              <a onClick={() => setModalOpen(true)}>Perfil</a>
              <UserProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
              <a onClick={retorna}>Sair</a>
          </div>
        </div>
      </div>
  );
};

export default Imagem;