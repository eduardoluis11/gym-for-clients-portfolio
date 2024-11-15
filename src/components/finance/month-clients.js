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

  
export const MonthClients = (props) => {
    const {informaciones,newClients,oldClients,...other} = props

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
                    Altas
                </Typography>
                <Typography variant="h5">
                    {newClients.length}
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
                    Bajas
                </Typography>
                <Typography variant="h5">
                    {oldClients.length}
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
                    Informaciones
                </Typography>
                <Typography variant="h5">
                    {informaciones}
                </Typography>
                </div>
            </Grid>
        </Grid>
    </Card>
  );
}
  