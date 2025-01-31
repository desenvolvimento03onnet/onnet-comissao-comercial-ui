import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalRenovacoesUsuario } from "../../../../services/loadGraficoTotalRenovacoesUsuario";
import styles from './Grafico.module.css';

const ApexChart = () => {
    const [dados, setDados] = useState({ labels: [], series: [] });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalRenovacoesUsuario(sessionStorage.getItem(0));
          
          // Agrupar e contar ocorrências de cada contrato
          const agrupado = carrega.reduce((index, item) => {
            index[item.operation] = (index[item.operation] || 0) + 1;
            return index;
          }, {'Renovação':0,'Downgrade':0,'Upgrade':0});
          // Criar os arrays de labels e valores
          const labels = Object.keys(agrupado);
          const series = Object.values(agrupado);

          setDados({ labels, series });
        } catch (error) {
          console.error("Erro ao carregar dados: ", error);
        }
      };
      fetchData();
    }, []);
    
  return (
    <div>
      <div id="chart" className={styles.Grafico}>
        <ReactApexChart
          options={{
            chart: {
              type: "pie", // Tipo de gráfico
              toolbar: {
                show: true, // Mostra a barra de ferramentas
                tools: {
                  download: true, // Habilita o botão de download
                },
              },
              export: {
                csv: {
                  filename: "meu_grafico",
                  columnDelimiter: ";",
                  headerCategory: "Categoria",
                  headerValue: "Valor",
                },
                svg: {
                  filename: "meu_grafico_svg",
                },
                png: {
                  filename: "meu_grafico_png",
                },
              },
            },
            colors: ['#2E93fA', '#FF4560', '#66DA26'],
            labels: dados.labels,
            legend: {
              position: "bottom",
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            title: {
              text: 'Total Renovações',
              align: 'center',
              margin: 10,
              offsetX: 0,
              offsetY: 0,
              floating: false,
              style: {
                fontSize:  '24px',
                fontWeight:  'bold',
                fontFamily:  undefined,
                color:  '#263238'
              },
            },
            tooltip: {
              shared: true,
              hideEmptySeries: true,
            },
          }}
          series={dados.series}
          type="pie"
          width={410}
        />
      </div>
    </div>
  );
};

export default ApexChart;
