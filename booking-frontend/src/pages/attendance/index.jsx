import React, { useState } from "react";
import { BASE_URL } from "../../links";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { Box, Button, TextField, Typography } from "@mui/material";
import {
  modalHeaderStyle,
  ButtonStyle1,
  ButtonStyle2,
} from "./styles";

export default function Attendance(props) {
  const [attendance, setAttendance] = useState(false);
  const [name, setName] = useState("");
  // const [id, setId] = useState("");
  const [isVenueModalOpen, setVenueModal] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [isLoggedOutModalOpen, setLoggedOutModal] = useState(false);

  const openAttendanceModal = () => {
    setAttendance(true);
  };

  const closeModal = () => {
    setAttendance(false);
  };

  const closeLoggedOutModal = () => {
    setLoggedOutModal(false);
  };

  const WelcomeModal = () => {
    setVenueModal(false);
  };

  const handleSave = () => {
    const data = { name: name };
    axios.post(`${BASE_URL}/api/logAttendance/`, data)
      .then((response) => {
        if (response.data.state === "login") {
          console.log("Data saved successfully", response.data);
          setUserLoggedIn(true);
          setLastBooking(response.data);
          setVenueModal(true);
          closeModal();
        } else if (response.data.state === "noBooking") {
          alert("You Have No Booking within 30 minutes!");
        } else {
          setLoggedOutModal(true);
        }
      })
      .catch((error) => {
        console.error("Error saving data", error);
      });
  };
  

  return (
    <div>
      <div style={{ margin: "80px" }}></div>
      <Button
        variant="contained"
        sx={{ ...ButtonStyle1, fontSize: 45 }}
        onClick={openAttendanceModal}
      >
        Tap In
      </Button>
      <div>
        <Modal
          open={attendance}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              fontFamily: "Poppins",
            }}
          >
            <h2 sx={{ modalHeaderStyle }}>Tap In</h2>
            <Typography sx={{fontFamily: "Poppins"}}>Please input your ID number or name:</Typography>
            <div style={{ margin: "20px" }}></div>
            <TextField
              label="ID Number"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ fontFamily: 'Poppins' }}
            />
            <Box sx={{ justifyContent: "space-between" }}>
              <div style={{ margin: "20px" }}></div>
              <Button
                variant="contained"
                sx={ButtonStyle1}
                style={{ marginRight: "15px" }}
                onClick={() => {
                  handleSave();
                  // setVenueModal(true);
                }}
              >
                Tap In
              </Button>
              <Button
                variant="contained"
                sx={ButtonStyle2}
                onClick={closeModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={isVenueModalOpen && userLoggedIn}
          onClose={() => setVenueModal(true)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2 sx={{ modalHeaderStyle }}>Welcome!</h2>
            <Typography>
              Your attendance has been logged, you can now proceed!
              {/* {venueName} */}
            </Typography>
            <div style={{ margin: "20px" }}></div>
            <Button
              variant="contained"
              sx={ButtonStyle1}
              style={{ marginRight: "15px" }}
              onClick={WelcomeModal}
            >
              Okay
            </Button>
          </Box>
        </Modal>
        <Modal
          open={isLoggedOutModalOpen}
          onClose={closeLoggedOutModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2 sx={{ modalHeaderStyle }}>You are Now Logged Out</h2>
            <Typography>You have been successfully logged out.</Typography>
            <div style={{ margin: "20px" }}></div>
            <Button
              variant="contained"
              sx={ButtonStyle1}
              style={{ marginRight: "15px" }}
              onClick={closeLoggedOutModal}
            >
              OK
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
    //   <Modal
    //     open={isLogoutModalOpen}
    //     onClose={closeLogoutModal}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
    //     <h2 sx={{modalHeaderStyle}}>Are you sure you want to log out?</h2>
    //       <div style={{ margin: '20px' }}></div>
    //       <Button variant="contained" style={{ marginRight: '15px' }} sx={ButtonStyle1} onClick={handleLogout}>
    //         Yes
    //       </Button>
    //       <Button variant="contained" sx={ButtonStyle2} onClick={closeLogoutModal}>
    //         Cancel
    //       </Button>
    //     </Box>
    //   </Modal>
    // </div>
  );
}
