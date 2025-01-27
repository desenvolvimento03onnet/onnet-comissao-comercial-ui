import React from "react";
import ReactApexChart from "react-apexcharts";
import './GraficoTotal.css';

const ApexChart = () => {
  const [state, setState] = React.useState({
    series: [44], // Dados do gráfico
    options: {
      chart: {
        type: "pie", // Tipo de gráfico
      },
      labels: ["Team A"], // Rótulos
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
    },
  });

  return (
    <div>
      <div id="chart" className="Grafico">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          width={380}
        />
      </div>
    </div>
  );
};

export default ApexChart;
