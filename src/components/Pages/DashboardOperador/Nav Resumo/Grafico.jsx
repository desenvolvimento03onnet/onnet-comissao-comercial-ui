import React from "react";
import html2canvas from 'html2canvas';
import { useState, useRef, useEffect } from "react";
import { serviceOperadores } from "../../../../services/serviceOperador";
import style from './Grafico.module.css';
import { FaBars } from "react-icons/fa";

const ApexChart = ({ filter }) => {
    const [valorPago, setValorPago] = useState();
    const [valorNaoPago, setValorNaoPago] = useState();
    const [totalAceito, setTotalAceito] = useState();
    const [totalNaoAceito, setTotalNaoAceito] = useState();
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const contentRef = useRef(null);
    const cardRefs = useRef([]);

    const downloadAsPNG = async (element, fileName) => {
      if (!element) return;

      const descricoes = element.querySelectorAll(`.${style.descricao}`);
      descricoes.forEach(el => {
        el.classList.add(style.print_adjust);
        el.style.height = '90%';
      });

      const scale = 2;

      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        scrollY: -window.scrollY,
        backgroundColor: null,
      });
      
      

      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.click();



      descricoes.forEach(el => {
        el.classList.remove(style.print_adjust);
        el.style.height = '110%';
      });
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await serviceOperadores(sessionStorage.getItem(0));
          const dadosFiltrados = carrega.filter(item => {
            const dataValida = new Date(item.date) >= new Date(filter.startDate) && new Date(item.date) <= new Date(filter.endDate);
            const operacaoValida = filter.operation.length === 0 || filter.operation.includes(item.operation);
            return dataValida && operacaoValida;
              });
          const agrupado = dadosFiltrados.reduce((index, item) => {
            const op = item.operation;
            const pago = item.paid === true || item.paid === 'true';
            const aceito = item.accepted === 'Sim';
            const valorNumerico = parseFloat(eval(item.comission).toFixed(2)) || 0;
            if (!index[op]) {
              index[op] = { pagos: { total: 0 }, naoPagos: { total: 0 }, aceitos: { total: 0 }, naoAceitos: { total: 0 } };
            }
            pago ? (index[op].pagos.total += valorNumerico) : (index[op].naoPagos.total += valorNumerico);
            aceito ? (index[op].aceitos.total += valorNumerico) : (index[op].naoAceitos.total += valorNumerico);
            return index;
          }, {});
          const totalGeralPago = Object.values(agrupado).reduce((soma, op) => soma + op.pagos.total, 0);
          const totalGeralNaoPago = Object.values(agrupado).reduce((soma, op) => soma + op.naoPagos.total, 0);
          const totalGeralAceito = Object.values(agrupado).reduce((soma, op) => soma + op.aceitos.total, 0);
          const totalGeralNaoAceito = Object.values(agrupado).reduce((soma, op) => soma + op.naoAceitos.total, 0);
          
          setValorPago(totalGeralPago);
          setValorNaoPago(totalGeralNaoPago);
          setTotalAceito(totalGeralAceito);
          setTotalNaoAceito(totalGeralNaoAceito);
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);
  
    const cards = [
      { label: 'Pagos pelo Cliente', value: valorPago, styleClass: style.totalPago },
      { label: 'Em Aberto pelo Cliente', value: valorNaoPago, styleClass: style.totalNaoPago },
      { label: 'Aprovadas Pelo Supervisor', value: totalAceito, styleClass: style.ComissaoAprovada },
      { label: 'À Aprovar Pelo Supervisor', value: totalNaoAceito, styleClass: style.ComissaoAprovar },
    ];
  
    const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    return (
      <div className={style.content}>
        {/* Botão Global */}
        <div className={style.botaoNav}>
          <button
            onClick={() => setDropdownIndex(dropdownIndex === 'global' ? null : 'global')}
            className={style.dropDownbtn}
          >
            <FaBars />
          </button>
          {dropdownIndex === 'global' && (
            <div className={`${style.dropdown} ${style.fadeIn}`}>
              <div
                onClick={() => downloadAsPNG(contentRef.current, `Resumo_${sessionStorage.getItem(0)}_${dataAtual}.png`)}
                className={style.dropdownItem}
              >
                Download PNG
              </div>
            </div>
          )}
        </div>
  
        <div className={style.content2} ref={contentRef}>
          {cards.map((card, i) => (
            <div key={i} className={`${style.card} ${card.styleClass} relative`} ref={el => cardRefs.current[i] = el}>
              {/* <div className={`${style.dropdown} ${style.fadeIn}`}>
                <button
                  onClick={() => setDropdownIndex(dropdownIndex === i ? null : i)}
                  className={style.dropdownItem}
                >
                  <FaBars />
                </button>
                {dropdownIndex === i && (
                  <div className={`${style.dropdown} ${style.fadeIn}`}>
                    <div
                      onClick={() => downloadAsPNG(cardRefs.current[i], `${card.label}.png`)}
                      className={style.dropdownItem}
                    >
                      Download PNG
                    </div>
                  </div>
                )}
              </div> */}
  
              <div className={style.descricao}>{card.label}</div>
              <div className={style.valor}>
                {card.value !== ''
                  ? parseFloat(card.value || 0).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  : 'R$ 0,00'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default ApexChart;
