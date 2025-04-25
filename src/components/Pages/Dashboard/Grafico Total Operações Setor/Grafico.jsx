import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";
import { loadGraficoTotalOperacoesSetor } from "../../../../services/loadGraficoTotalOperacoesSetor";
import './Grafico.module.css';

const ApexChart = ({ filter }) => {
    const [chartData, setChartData] = useState({ categories: [], series: [] });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const carrega = await loadGraficoTotalOperacoesSetor(sessionStorage.getItem(0));
          //const usuaSe = await loadUsuarioSetores(sessionStorage.getItem(0));

          // Filtrar dados conforme data selecionada
        const dadosFiltrados = filter.startDate && filter.endDate
        ? carrega.filter(item =>
            new Date(item.date) >= new Date(filter.startDate) &&
            new Date(item.date) <= new Date(filter.endDate)
          )
        : carrega;

      // Criar estrutura para armazenar os valores agrupados
      const agrupados = {};

      dadosFiltrados.forEach(({ date, sector, operation }) => {
        const [year, month] = date.split('T')[0].split('-');
        const mesAno = `${month}/${year}`;

        if (!agrupados[mesAno]) {
          agrupados[mesAno] = { setores: {}, operacoes: { 'Venda': 0, 'Renovação': 0, 'Upgrade': 0, 'Downgrade': 0 } };
        }

        // Contar setores (colunas)
        agrupados[mesAno].setores[sector] = (agrupados[mesAno].setores[sector] || 0) + 1;

        // Contar operações (linhas)
        agrupados[mesAno].operacoes[operation] += 1;
      });

      // Criar categorias do eixo X (Mês-Ano)
      const categories = Object.keys(agrupados).sort(); // Ordenar por data

      // Criar séries de colunas (setores)
      const setoresUnicos = [...new Set(dadosFiltrados.map(d => d.sector))]; // Capturar setores únicos
      const seriesColunas = setoresUnicos.map(setor => ({
        name: setor,
        type: "column",
        data: categories.map(mesAno => agrupados[mesAno]?.setores[setor] || 0)
      }));
      
      // Criar séries de linhas (operações)
      const seriesLinhas = ["Venda", "Renovação", "Upgrade", "Downgrade"].map(op => ({
        name: op,
        type: "line",
        data: categories.map(mesAno => agrupados[mesAno]?.operacoes[op] || 0)
      }));
      
      // setChartData({ categories, series: [...seriesColunas, ...seriesLinhas] });
      setChartData({ categories, series: [...seriesColunas, ...seriesLinhas] });
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
    <div>
      <div id="chart" className="Grafico">
        <ReactApexChart
          options={{
            chart: {
              height: 500,
              type: 'line',
              stacked: false,
              toolbar: {
                export: {
                  csv: {
                    filename: `Relatório_Total_Operações_Setor_${sessionStorage.getItem(0)}_${dataAtual}`,
                    columnDelimiter: ";",
                    headerCategory: "Categoria",
                    headerValue: "Valor",
                  },
                  svg: {
                    filename: `Relatório_Total_Operações_Setor_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                  png: {
                    filename: `Relatório_Total_Operações_Setor_${sessionStorage.getItem(0)}_${dataAtual}`,
                  },
                },
              },
            },
            dataLabels: { enabled: true },
            colors: [({ seriesIndex, w }) => getColor(seriesIndex, w)],
            stroke: { width: [1, 1, 4] },
            title: { text: "Quantidades de Operações por Setor", align: "left" },
            xaxis: { categories: chartData.categories },
            tooltip: { shared: true },
            legend: { horizontalAlign: "center", offsetX: 0, offsetY: 0 },
            responsive: [{
              breakpoint: 1000,
              options: {},
            }]
          
          }}
          series={chartData.series}
          type="line"
          width={1500}
          height={500}
        />
      </div>
    </div>
  );
};

export default ApexChart;
