<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,700;1,100&display=swap');
</style>

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
 export const selectedStyle = {
    backgroundColor: "#fecc00",
    color: "black",
    fontWeight: "bold",
    borderColor: "#fecc00",
    fontFamily: "Poppins",
    "&:hover": {
      backgroundColor: "#9c7b16",
      color: "white",
      borderColor: "#9c7b16",
      fontFamily: "Poppins",
    },
  };
 export const unselectedStyle = {
    fontFamily: "Poppins",
    backgroundColor: "",
    fontWeight: "bold",
    borderColor: "black",
  
    color: "black",
    "&:hover": {
      backgroundColor: "#5A5A5A",
      color: "white",
      borderColor: "#5A5A5A",
      fontFamily: "Poppins",
    },
  };
export  const modalStyle = {
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