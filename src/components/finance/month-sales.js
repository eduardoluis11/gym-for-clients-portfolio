import numeral from 'numeral';
import {
  Box,
  Card,
  Grid,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../chart';
import { useEffect, useState,useCallback } from "react";
import { useMounted } from '../../hooks/use-mounted';
import { saleApi } from '../../api/sale-api';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton } from '@mui/material';

  
export const MonthSales = (props) => {
    const {salesThisMonth,salesLastMonth,activeClients,informaciones,newClients,...other} = props

    return(
    <Card {...other}>
        <Grid container>
            <Grid
                item
                md={4}
                xs={12}
                sx={{
                alignItems: 'center',
                borderRight: (theme) => ({
                    md: `1px solid ${theme.palette.divider}`
                }),
                borderBottom: (theme) => ({
                    md: 'none',
                    xs: `1px solid ${theme.palette.divider}`
                }),
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
                }}
            >
                <div>
                <Typography
                    color="textSecondary"
                    variant="overline"
                >
                    Sales
                </Typography>
                <Typography variant="h5">
                    {numeral(salesThisMonth).format('$0,0.00')}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="body2"
                >
                    vs.
                    {numeral(salesLastMonth).format('$0,0.00')}
                    &nbsp;
                    last month
                </Typography>
                </div>
                <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    height: 54,
                    width: 177
                }}
                >
                    {salesThisMonth<salesLastMonth && 
                    <IconButton color="error">
                        <ArrowDownwardIcon />
                        -{100-(salesThisMonth*100/salesLastMonth).toFixed(2)}%
                    </IconButton>
                    }
                    {salesThisMonth>salesLastMonth && 
                    <IconButton color="success">
                        <ArrowUpwardIcon />
                        +{salesLastMonth>0? (salesThisMonth*100/salesLastMonth).toFixed(2)-100: 100}%
                    </IconButton>
                    }
                    {salesThisMonth == salesLastMonth &&
                    <IconButton sx={{ color: 'warning.main' }}>
                        <ArrowForwardIcon />
                        %0
                    </IconButton>
                    }
                </Box>
            </Grid>
            <Grid
                item
                md={4}
                xs={12}
                sx={{
                alignItems: 'center',
                borderRight: (theme) => ({
                    md: `1px solid ${theme.palette.divider}`
                }),
                borderBottom: (theme) => ({
                    md: 'none',
                    xs: `1px solid ${theme.palette.divider}`
                }),
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
                }}
            >
                <div>
                <Typography
                    color="textSecondary"
                    variant="overline"
                >
                    Ticket Medio
                </Typography>
                <Typography variant="h5">
                    {activeClients.length? numeral(salesThisMonth/activeClients.length).format('$0,0.00'):'$0'}
                </Typography>
                </div>
            </Grid>
            <Grid
                item
                md={4}
                xs={12}
                sx={{
                alignItems: 'center',
                borderRight: (theme) => ({
                    md: `1px solid ${theme.palette.divider}`
                }),
                borderBottom: (theme) => ({
                    md: 'none',
                    xs: `1px solid ${theme.palette.divider}`
                }),
                display: 'flex',
                justifyContent: 'space-between',
                p: 3
                }}
            >
                <div>
                <Typography
                    color="textSecondary"
                    variant="overline"
                >
                    Tasa de conversión
                </Typography>
                <Typography variant="h5">
                    {informaciones>0? (newClients.length*100/informaciones).toFixed(2) :0}%
                </Typography>
                </div>
            </Grid>
        </Grid>
    </Card>
  );
}
  