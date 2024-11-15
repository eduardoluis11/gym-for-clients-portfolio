import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../chart';

export const YearSales = (props) => {
  const theme = useTheme();
  const {salesPerMonth, ...other} = props;

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: ['#2F3EB1', '#6E7AD8'],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      borderColor: theme.palette.divider
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: Object.keys(salesPerMonth)
    }
  };

  const chartSeries = [
    {
      name: 'Ventas',
      data: Object.values(salesPerMonth)
    },
  ];

  return (
    <Card {...other}>
      <CardHeader title="Facturación por mes" />
      <Divider />
      <CardContent>
        <Chart
          height={467}
          options={chartOptions}
          series={chartSeries}
          type="area"
        />
      </CardContent>
    </Card>
  );
};
