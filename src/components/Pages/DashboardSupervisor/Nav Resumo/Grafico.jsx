import React from "react";
import { useState, useEffect } from "react";
import { loadTabelaSupervisores } from "../../../../services/loadTabelaSupervisores";
import style from './Grafico.module.css';
import { FaCheck } from "react-icons/fa";

const ApexChart = ({ filter }) => {
    const [valorPago, setValorPago] = useState();
    const [valorNaoPago, setValorNaoPago] = useState();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadTabelaSupervisores(sessionStorage.getItem(0));
          //const usuaSe = await loadUsuarioSetores(sessionStorage.getItem(0));
          
          // Filtrar dados conforme data selecionada
        const dadosFiltrados = filter.startDate && filter.endDate
        ? carrega.filter(item =>
            new Date(item.date) >= new Date(filter.startDate) &&
            new Date(item.date) <= new Date(filter.endDate)
          )
        : carrega;
        
        const agrupado = dadosFiltrados.reduce((index, item) => {
          const op = item.operation;
          const pago = item.paid === true || item.paid === 'true';
          const valorNumerico = parseFloat(eval(item.comission).toFixed(2)) || 0;
          if (!index[op]) {
            index[op] = {
              pagos: { total: 0 },
              naoPagos: { total: 0 }
            };
          }

          if (pago) {
            index[op].pagos.total += valorNumerico;
          } else {
            index[op].naoPagos.total += valorNumerico;
          }
          
          return index
        }, {});
        const Valorpagos = Object.values(agrupado).map(op => op.pagos.total);
        const totalGeralPago = Valorpagos.reduce((soma, valor) => soma + valor, 0);
        const ValorNaopagos = Object.values(agrupado).map(op => op.naoPagos.total);
        const totalGeralNaoPago = ValorNaopagos.reduce((soma, valor) => soma + valor, 0);
        
        setValorPago(totalGeralPago);
        setValorNaoPago(totalGeralNaoPago);
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);
    
    // 🔹 Função para definir cores dinamicamente com base na série
  const getColor = (seriesIndex, w) => {
    const seriesName = w.globals.seriesNames[seriesIndex];

    const colorMap = {
      "FRENTE-LOJA": "#7d7ac9",
      "TELEMARKETING": "#fbefa5",
      "PAP": "#1c8080",
      "Venda": "#FF9800",
      "Renovação": "#2E93fA",
      "Downgrade": "#FF4560",
      "Upgrade": "#66DA26"
    };

    return colorMap[seriesName] || "#333"; // Cor padrão
  };
  const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
  return (
    <div className={style.content}>
      <div className={`${style.card} ${style.totalPago}`}>
        <div className={style.descricao}>Pago</div>
        <div className={style.valor}>{`${parseFloat(valorPago || 0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}`}</div>
      </div>
      <div className={`${style.card} ${style.totalNaoPago}`}>
        <div className={style.descricao}>Em Aberto</div>
        <div className={style.valor}>{`${parseFloat(valorNaoPago || 0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}`}</div>
      </div>
      <div className={`${style.card} ${style.ComissaoAprovada}`}>
        <div className={style.descricao}>Aprovadas</div>
        <div className={style.valor}>{`${'' || 0}`}</div>
      </div>
      <div className={`${style.card} ${style.ComissaoAprovar}`}>
        <div className={style.descricao}>À Aprovar</div>
        <div className={style.valor}>{`${'' || 0}`}</div>
      </div>
      <div className={`${style.card} ${style.CCC}`}>
        <div className={style.descricao}>Total Pago</div>
        <div className={style.valor}>{`${'' || 0}`}</div>
      </div>
      <div className={`${style.card} ${style.CCC}`}>
        <div className={style.descricao}>Total Pago</div>
        <div className={style.valor}>{`${'' || 0}`}</div>
      </div>
      
    </div>
  );
};

export default ApexChart;
