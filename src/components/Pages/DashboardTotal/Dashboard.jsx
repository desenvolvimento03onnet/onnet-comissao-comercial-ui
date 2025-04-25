import React from 'react';
import { FaHome } from "react-icons/fa";
import styles from './Dashboard.module.css';
import logo from '../../../assets/logoonnet.png';
import ImagemUser from './Imagem Cliente/Imagem';
import Card from './Card/Card'
import "react-tabs/style/react-tabs.css";
import { useState, useEffect } from "react";


const Dashboard = () => {
  

  return (
    <div className={styles.card}>
      <div className={styles.principal}>
        <div className={styles.esquerda}>
          <div className={styles.navCima}></div>
          <div className={styles.navContent}>
            <p className={styles.links}><FaHome className={styles.icone} /> Início</p>
            {/* <p className={styles.links}><FaCogs className={styles.icone} /> Configurações</p> */}
          </div>
          <div className={styles.navBaixo}></div>
        </div>
        <div className={styles.direita}>
          <div className={styles.top}>
            <ImagemUser />
          </div>
          <div className={styles.baixo}>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.empresa}>
          <img src={logo} alt="Logo" />
        </div>
        <div className={styles.direitos}>
          <span>Copyright &#169; 2025 OnNet Telecom &#174;</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
