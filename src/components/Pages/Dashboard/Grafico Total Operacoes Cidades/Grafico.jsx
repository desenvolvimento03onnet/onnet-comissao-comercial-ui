import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalOperacoesCidadesUsuario } from "../../../../services/loadGraficoTotalOperacoesCidadesUsuario";
import { loadCidades } from "../../../../services/loadCidades";
import styles from './Grafico.module.css';

const ApexChart = ({ filter }) => {
    const [dados, setDados] = useState({ labels: [], series: [] });
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalOperacoesCidadesUsuario(sessionStorage.getItem(0));
          const cidades = await loadCidades();
          const cid = cidades.reduce((index, item) => {
            index[item.name] = (index[item.name] || 0);
            return index;
          },{});

          const dadosFiltrados = filter.startDate && filter.endDate
            ? carrega.filter(item =>
                new Date(item.date) >= new Date(filter.startDate) &&
                new Date(item.date) <= new Date(filter.endDate)
              )
            : carrega;

          // Agrupar e contar ocorrências de cada contrato
          const agrupado = dadosFiltrados.reduce((index, item) => {
            index[item.city] = (index[item.city] || 0) + 1;
            return index;
          }, cid);
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
            legend: {
              show: false
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
                show: true,
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
          height={500}
        />
      </div>
  );
};

export default ApexChart;
