
import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, elements } from "chart.js";

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PatientStat = () => {
  // Data for the bar chart
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Inpatient",
        backgroundColor: "#3b82f6",
        data: [150, 200, 180, 265, 150, 180, 130],
      },
      {
        label: "Outpatient",
        backgroundColor: "#a3e635",
        data: [100, 140, 160, 220, 160, 140, 110],
      },
      {
        label: "Discharged",
        backgroundColor: "#fca5a5",
        data: [50, 80, 120, 121, 70, 90, 60],
      },
    ],
  };

  const options = {
    responsive: true,
    elements:{
        Line:{
            stepped: true,

            
        }
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent>
        {/* <Grid container alignItems="center" spacing={2}> */}
          {/* Left Side Text */}


          {/* Bar Chart */}
          <Grid item xs={12} md={8}>
             <Grid item xs={12} md={4}>
            <Typography variant="h4" color="textPrimary">
              224,763
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Patient Status
            </Typography>
            <Typography variant="body2" color="textSecondary">
              +1,526
            </Typography>
          </Grid>
            <Box>
              <Bar sx={{}} data={data} options={options} />
            </Box>
          </Grid>
        {/* </Grid> */}
      </CardContent>
    </Card>
  );
};

// export default PatientStatusCard;
export default PatientStat