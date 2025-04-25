import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from './Card.module.css';

const Card = () => {
    
    
  return (
    <div className={styles.Card}>
      <div className={styles.titulo}>
        <h1>Título</h1>
      </div>
      <div className={styles.dados}>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
        <div className="teste"><input type="checkbox" /><span>teste</span></div>
      </div>
      <div className={styles.botaoAdd}>
        <button className={styles.botao}><FaPlus /></button>  
      </div>
    </div>
  );
};

export default Card;
