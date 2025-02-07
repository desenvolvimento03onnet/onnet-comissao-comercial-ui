import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalOperacoesComissoes } from "../../../../services/loadGraficoTotalOperacoesComissoes";
import { validaUsuarioClienteComissao } from "../../../../services/validaUsuarioClienteComissao";
import insereUsuarioClienteComissao from "../../../../services/insereUsuarioClienteComissao";
import styles from './Grafico.module.css';

const ApexChart = ({ filter }) => {
    const [dados, setDados] = useState({ labels: [], series: [] });
    const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalOperacoesComissoes(sessionStorage.getItem(0));
          const valida = await validaUsuarioClienteComissao();
          const resultado = carrega.filter(inserir => !valida.some(cadastrados => inserir.id_client == cadastrados.id_client) || valida.some(cadastrados => inserir.id_client == cadastrados.id_client && sessionStorage.getItem(2) != cadastrados.id_user) || valida.some(cadastrados => inserir.id_client == cadastrados.id_client && sessionStorage.getItem(2) == cadastrados.id_user && inserir.value != cadastrados.comission_value));

          resultado.map(async(item) => {
            await insereUsuarioClienteComissao(sessionStorage.getItem(2), item.id_client, item.value, dataAtual);
          });

          const dadosFiltrados = filter.startDate && filter.endDate
            ? carrega.filter(item =>
                new Date(item.date) >= new Date(filter.startDate) &&
                new Date(item.date) <= new Date(filter.endDate)
              )
            : carrega;
          // Agrupar e contar ocorrências de cada contrato
          const agrupado = dadosFiltrados.reduce((index, item) => {
            if (index[item.comission]) {
              index[item.comission] += item.value || 0; // Soma os valores
            } else {
                index[item.comission] = item.value || 0; // Inicializa
            }
            return index;
          }, {'Downgrade':0, 'Renovação':0, 'Upgrade':0, 'Venda':0});
          // Criar os arrays de labels e valores
          const labels = Object.keys(agrupado);
          const series = Object.values(agrupado);
          setDados({ labels, series });
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, [filter]);
    
  return (
      <div id="chart" className={styles.Grafico}>
        <ReactApexChart
          options={{
            chart: {
              type: 'area',
              height: 500,
              zoom: {
                enabled: false
              }
            },
            colors: ['#66DA26'],
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return 'R$ ' + val
              },
              style: {
                colors: ['#2E93fA']
              }
            },
            stroke: {
              curve: 'straight'
            },
            
            title: {
              text: 'Comissões do(a) operador(a):',
              align: 'left'
            },
            subtitle: {
              text: sessionStorage.getItem(0),
              align: 'left'
            },
            labels: dados.labels,
            xaxis: {
              range: 3,
              labels: {
                rotate: -45,
                style: {
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400
                },
                offsetX: 6
              }
            },
            yaxis: {
              opposite: true
            },
            legend: {
              horizontalAlign: 'left'
            }
          }}
          series={[{
            name: 'Valor Total (R$)',
            data: dados.series
          }]}
          type="area"
          width={1200}
          height={500}
        />
      </div>
  );
};

export default ApexChart;
