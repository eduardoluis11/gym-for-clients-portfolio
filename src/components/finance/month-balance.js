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

  
export const MonthBalance = (props) => {
    const {balanceThisMonth,balanceLastMonth, ...other} = props
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
                    Balance
                </Typography>
                <Typography variant="h5">
                    {numeral(balanceThisMonth).format('$0,0.00')}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="body2"
                >
                    vs.
                    {numeral(balanceLastMonth).format('$0,0.00')}
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
                    {balanceThisMonth<balanceLastMonth && 
                    <IconButton color="error">
                        <ArrowDownwardIcon />
                        -{100-(balanceThisMonth*100/balanceLastMonth).toFixed(2)}%
                    </IconButton>
                    }
                    {balanceThisMonth>balanceLastMonth && 
                    <IconButton color="success">
                        <ArrowUpwardIcon />
                        +{balanceLastMonth>0? (balanceThisMonth*100/balanceLastMonth).toFixed(2)-100: 100}%
                    </IconButton>
                    }
                    {balanceThisMonth == balanceLastMonth  &&
                    <IconButton sx={{ color: 'warning.main' }}>
                        <ArrowForwardIcon />
                        %0
                    </IconButton>
                    }
                </Box>
                
            </Grid>
        </Grid>
    </Card>
  );
}
  