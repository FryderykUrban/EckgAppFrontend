import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { EkgChartData } from "../model/EkgChartData";

interface ChartProps {
  chartData: EkgChartData[];
}

const Chart = ({ chartData }: ChartProps) => {
  return (
    <LineChart
      width={1000} // Możesz dostosować szerokość
      height={700}
      data={chartData}
      margin={{ top: 0, right: 30, left: -30, bottom: 0 }} // Dostosuj marginesy
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="seconds" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="mlII" stroke="#8884d8" dot={false} />
    </LineChart>
  );
};

export default Chart;