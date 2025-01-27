import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './TelaInicial.css';

const TelaInicial = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/app'); // Altere '/app' para o caminho desejado
  };

  return (
    <div className='Inicio'>
      <span><FaHome /> Início</span>
    </div>
  );
};

export default TelaInicial;