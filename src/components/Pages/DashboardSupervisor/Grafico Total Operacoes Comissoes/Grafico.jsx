import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { serviceSupervisores } from "../../../../services/serviceSupervisores";
import styles from './Grafico.module.css';

const ApexChart = ({ filter }) => {
    const [dados, setDados] = useState({ labels: [], series: [] });
    const dataAtual = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await serviceSupervisores(sessionStorage.getItem(0));
          const dadosFiltrados = carrega.filter(item => {
            const dataValida = new Date(item.date) >= new Date(filter.startDate) && new Date(item.date) <= new Date(filter.endDate);
            const operadorValido = filter.operator.length === 0 || filter.operator.includes(item.operator);
            const operacaoValida = filter.operation.length === 0 || filter.operation.includes(item.operation);
            return dataValida && operadorValido && operacaoValida;
              });
          const agrupado = dadosFiltrados.reduce((index, item) => {
            if (!item.paid) {
              return index;
            }

            if (!index[item.operation]) {
              index[item.operation] = { formula: [], total: 0 };
            }
              const valorNumerico = parseFloat(eval(item.comission).toFixed(2)) || 0;
              index[item.operation].formula.push({ valores: item.operator + " : " + new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorNumerico) });
              index[item.operation].total += valorNumerico;
              // console.log(index[item.comission]);
              return index;
          }, {'Downgrade':0, 'Renovação':0, 'Upgrade':0, 'Venda':0, 'Dia 1':0, 'Dia 2':0});
          const labels = Object.keys(agrupado);
          const seriesData = labels.map(label => {
            const grupo = agrupado[label] || { total: 0, formula: [] };
            return {
              total: grupo.total,
              
              formula: grupo.formula.map(f => `<span style="display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #c9ebbb;
              border-radius: 50%;
              margin-right: 8px;"></span>`+f.valores).join(`<br>`)
            };
          });
          
          const series = [{
            name: 'Operações', // Nome da série (aparece na legenda)
            data: seriesData.map(item => item.total),
            formulas: seriesData.map(item => item.formula)
          }];
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
              height: '100%',
              width: '100%',
              zoom: {
                enabled: false
              },
              toolbar: {
                export: {
                  csv: {
                    filename: `Relatórios_Total_Operações_Comissões_${sessionStorage.getItem(0)}_${dataAtual}`,
                    columnDelimiter: ";",
                    headerCategory: "Categoria",
                    headerValue: "Valor",
                  },
                  svg: {
                    filename: `Relatórios_Total_Operações_Comissões_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                  png: {
                    filename: `Relatórios_Total_Operações_Comissões_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                },
              },
            },
            responsive: [
              {
                breakpoint: 2000,
                options: {
                  chart: {
                    height: 500,
                    width: 1245,
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }
            ],
            colors: ['#66DA26'],
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return 'R$ ' + val.toString().replaceAll('.',',');
              },
              style: {
                colors: ['#85c2ff']
              }
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Total de Comissões dos Operadores do Responsável:',
              align: 'left'
            },
            subtitle: {
              text: sessionStorage.getItem(0),
              align: 'left'
            },
            xaxis: {
              categories: dados.labels,
              range: 5,
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
              labels: {
                formatter: (value) => 
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value),
              },
              opposite: true
            },
            tooltip: {
              custom: function({ seriesIndex, dataPointIndex }) {
                // const formula = w.config.dados.series[seriesIndex].formulas[dataPointIndex];
                const formula = dados.series[seriesIndex].formulas[dataPointIndex]
                 return `<div style="background-color: #fcfcff;">
                  <div style="background-color: #eceff1;padding: 5px;">
                    Fórmulas:
                  </div>
                  <div style="padding-left: 10px;
                    padding-right: 10px;">
                    <p>${formula}</p>
                  </div>
                 </div>`;
              }
            },
            legend: {
              horizontalAlign: 'left'
            }
          }}
          series={dados.series}

          type="area"
          // width={800}
          // height={500}
        />
      </div>
  );
};

export default ApexChart;
