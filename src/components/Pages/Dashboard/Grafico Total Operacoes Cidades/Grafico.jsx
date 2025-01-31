import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalOperacoesCidadesUsuario } from "../../../../services/loadGraficoTotalOperacoesCidadesUsuario";
import styles from './Grafico.module.css';

const ApexChart = () => {
    const [dados, setDados] = useState({ labels: [], series: [] });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalOperacoesCidadesUsuario(sessionStorage.getItem(0));
          
          // Agrupar e contar ocorrências de cada contrato
          const agrupado = carrega.reduce((index, item) => {
            index[item.city] = (index[item.city] || 0) + 1;
            return index;
          }, {'Abadia dos Dourados':0, 'Araguari':0, 'Buritizeiro':0, 'Cruzeiro da Fortaleza':0, 'Guimarânia':0, 'Iraí de Minas':0, 'João Pinheiro':0, 'Lagoa Formosa':0, 'Patos de Minas':0, 'Patrocínio':0, 'Pirapora':0, 'Presidente Olegário':0, 'São Gonçalo do Abaeté':0, 'Três Marias':0, 'Varjão de Minas':0, 'Várzea da Palma':0});
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
      <div id="chart" className={styles.Grafico}>
        <ReactApexChart
          options={{
            legend: {
              show: true
            },
            plotOptions: {
              bar: {
                distributed: true,
                borderRadius: 12,
                dataLabels: {
                  position: 'top', // top, center, bottom
                },
              }
            },
            colors: ['#2E93fA', '#FF4560', '#66DA26', '#f92df1', '#2deaf9', '#e3f92d', '#9c1f02', '#b22df9', '#2df9c0', '#f9802d', '#f92d5b', '#2df947', '#f9e42d', '#2d8df9', '#e42df9', '#f9552d'],
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return val;
              },
              offsetY: -30,
              style: {
                fontSize: '12px',
                colors: ["#304758"]
              }
            },
            
            xaxis: {
              categories: dados.labels,
              //categories: ['Guimarânia'],
              position: 'bottom',
              axisBorder: {
                show: false
              },
              axisTicks: {
                show: false
              },
              labels: {
                show: false,
                style: {
                  fontSize:  '8px',
                  color:  '#263238'
                }
              },
              crosshairs: {
                fill: {
                  type: 'gradient',
                  gradient: {
                    colorFrom: '#D8E3F0',
                    colorTo: '#BED1E6',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                  }
                }
              },
              tooltip: {
                enabled: true,
              }
            },
            yaxis: {
              axisBorder: {
                show: false
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
                formatter: function (val) {
                  return val;
                }
              }
            
            },
            title: {
              text: 'Total Operações por Cidade',
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
          }}
          series={[{
            name: 'Total',
            data: dados.series
          }]}
          type="bar"
          width={1200}
          height={300}
        />
      </div>
  );
};

export default ApexChart;
