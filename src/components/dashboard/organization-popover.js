import { MenuItem, Popover } from '@mui/material';

const organizations = [
  'Gym',
  'Salud y Bienestar'
];

export const OrganizationPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;

  const handleChange = (organization) => {
    onClose?.();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 248 } }}
      transitionDuration={0}
      {...other}>
      {organizations.map((organization) => (
        <MenuItem
          key={organization}
          onClick={() => handleChange(organization)}
        >
          {organization}
        </MenuItem>
      ))}
    </Popover>
  );
};
