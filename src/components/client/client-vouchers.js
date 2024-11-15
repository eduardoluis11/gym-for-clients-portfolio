import {
    Avatar,
    Box,
    Button,
    Checkbox,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    TextField
  } from "@mui/material";
import { ArrowRight as ArrowRightIcon } from "../../icons/arrow-right";
import NextLink from "next/link";
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Scrollbar } from "../scrollbar";
import PropTypes from "prop-types";
import { useState, useEffect,useCallback } from "react";
import toast from "react-hot-toast";
import { voucherApi } from "../../api/voucher-api";
import { useMounted } from "../../hooks/use-mounted";
import { PencilAlt as PencilAltIcon } from "../../icons/pencil-alt";
import Modal from '@mui/material/Modal'; 
import { width } from "@mui/system";


export const ClientVouchersListTable = (props) => {
const isMounted = useMounted();
  const {vouchers, vouchersCount, client, ...other} = props;
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Estado para controlar la apertura/cierre del modal
  const [voucherSale, setVoucherSale] = useState({})
  const [validFrom, setValidFrom] = useState('');
  const [validFor, setValidFor] = useState('');

  const handleOpenModal = (voucher) => {
    setOpenModal(true);
    setVoucherSale(voucher)
    setValidFrom(voucher.voucher_sale_valid_from)
    setValidFor(voucher.voucher_sale_valid_for)
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setVoucherSale({})
    setValidFrom('')
    setValidFor('')
  };

  const saveVoucherSale = useCallback(async()=>{
    try{
      let response = await voucherApi.updateVoucherSale(voucherSale.voucher_sale_id,{valid_from:validFrom,valid_for:validFor})
      toast.success('bono actulizado con éxito')
      location.reload()
    }catch(e){
      console.log(e)
      toast.error("Error en actualización")
    }
  })
  
 useEffect(
    () => {
      if (selectedVouchers.length) {
        setSelectedVouchers([]);
      }
    },
    [vouchers]
  );


  const handleSelectAllVouchers = (event) => {
    setSelectedVouchers(
      event.target.checked ? vouchers?.map((voucher) => voucher.voucher_id) : []
    );
  };

  const handleSelectOneVoucher = (event, voucherId) => {
    if (!selectedVouchers.includes(voucherId)) {
      setSelectedVouchers((prevSelected) => [...prevSelected, voucherId]);
    } else {
      setSelectedVouchers((prevSelected) =>
        prevSelected.filter((id) => id !== voucherId)
      );
    }
  };
  // TODO: Entender como se pueden realizar las modificaciones / borrado masivo con los BulkActions
  const enableBulkActions = selectedVouchers.length > 0;
  const selectedSomeVouchers =
    selectedVouchers.length > 0 && selectedVouchers.length < vouchers.length;
  const selectedAllVouchers = selectedVouchers.length === vouchers.length;


  return (
    <div {...other}>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          display: enableBulkActions ? "block" : "none",
          px: 2,
          py: 0.5,
        }}
      >
        <Checkbox
          checked={selectedAllVouchers}
          indeterminate={selectedSomeVouchers}
          onChange={handleSelectAllVouchers}
        />
        <Button size="small" 
        sx={{ ml: 2 }}>
          Delete
        </Button>
        <Button size="small" 
        sx={{ ml: 2 }}>
          Edit
        </Button>
      </Box>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead
            sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllVouchers}
                  indeterminate={selectedSomeVouchers}
                  onChange={handleSelectAllVouchers}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Fecha compra</TableCell>
              <TableCell>Válido desde</TableCell>
              <TableCell>Válido por</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers?.map((voucher) => {
              const isVoucherSelected = selectedVouchers.includes(
                voucher.voucher_id
              );

              return (
                <TableRow hover 
                key={voucher.voucher_id} 
                selected={isVoucherSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isVoucherSelected}
                      onChange={(event) =>
                        handleSelectOneVoucher(event, voucher.voucher_id)
                      }
                      value={isVoucherSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <NextLink href={`${client.id}/vouchers/${voucher.voucher_id}`} 
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {voucher.voucher_name}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                
                  <TableCell>
                    <Typography color="success.main" 
                      variant="subtitle2">
                        ${`${voucher.voucher_price}`}
                      </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${new Date(voucher.sale_date).toISOString().split('T')[0].split('-').reverse().join('/')}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${new Date(voucher.voucher_sale_valid_from).toISOString().split('T')[0].split('-').reverse().join('/')}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {voucher.voucher_sale_valid_for}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      <IconButton onClick={()=>handleOpenModal(voucher)}>
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" sx={{mb:3}}>
            Editar voucher  #{voucherSale?.voucher_sale_id} {voucherSale?.voucher_name}
          </Typography>
          
          <MobileDatePicker
             label="Válido desde"
             inputFormat="dd/MM/yyyy"
             value={validFrom}
             name="valid_from"
             onChange={(e) => setValidFrom(e)}
             renderInput={(inputProps) => <TextField fullWidth {...inputProps} />}
           />
          <TextField
            id="valid-for"
            label="Válido por"
            value={validFor}
            onChange={(e) => setValidFor(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            type="number"
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
          <Button onClick={handleCloseModal} variant="outlined">
              Cancelar
          </Button>
          <Button onClick={saveVoucherSale} variant="contained" >
              Guardar
          </Button>
          </Box>
        </Box>
        </>
        
      </Modal>
      
    </div>
  );
};

ClientVouchersListTable.propTypes = {
  vouchers: PropTypes.array.isRequired,
  vouchersCount: PropTypes.number.isRequired
};
