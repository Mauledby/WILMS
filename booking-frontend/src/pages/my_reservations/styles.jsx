import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { TableRow} from "@mui/material";
export const selectedStyle = {
    backgroundColor: "#fecc00",
    color: "white",
    fontWeight: "bold",
    borderColor: "#fecc00",
    fontFamily:'Poppins',
    "&:hover": {
      backgroundColor: "#fecc00",
      color: "white",
      borderColor: '#fecc00',
      fontFamily:'Poppins',
    },

  };
  export const unselectedStyle = {
    fontFamily:'Poppins',
    backgroundColor: "",
    fontWeight: "bold",
    borderColor: "black",
    border:'2px solid black',
    color: "black",
    "&:hover": {
      backgroundColor: "#5A5A5A",
      color: "white",
      borderColor: "#5A5A5A",
      fontFamily:'Poppins',
    },


  };
  export const modalHeaderStyle = {
    p: 3,
    fontWeight: "bold",
    display: "flex",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
  };

  export const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { lg: 400, xs: 350, sm: 400, md: 400, xl: 400 },

    bgcolor: "background.paper",
    // border: "1px solid #fff",
    boxShadow: 24,
    borderRadius: "15px",
  };

  export const ButtonStyle1 = {
    backgroundColor: "#fecc00",
    borderColor: "#fecc00",
    fontWeight: "bold",
    color: "black",
    ":hover": {
      bgcolor: "#9c7b16",
      color: "white",
    },
  };

  export const ButtonStyle2 = {
    backgroundColor: "black",
    borderColor: "black",
    fontWeight: "bold",
    color: "white",
    ":hover": {
      bgcolor: "#444444",
      borderColor: "#444444",
      color: "white",
    },
  };

  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontFamily: "Poppins",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontFamily: "Poppins",
    },
    width: "100px",
    textAlign: 'center',
  }));

  export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      fontFamily: "Poppins",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '50%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));