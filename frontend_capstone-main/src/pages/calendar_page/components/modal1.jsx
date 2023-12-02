import * as React from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";

import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import moment from "moment/moment";

import {
  ButtonStyle1,
  modalHeaderStyle,
  modalStyle,
} from "../styles";

export default function ModalOne(props) {

    return(
        <Modal
        disableAutoFocus={true}
        open={props.openModal1}
        
        onClose={() => props.setOpenModal1(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ width: "100%", overflow: "auto" }}
      >
        <Box sx={modalStyle}>
          <Box sx={modalHeaderStyle}>
            <Typography
              sx={{ fontWeight: "bold" }}
              id="modal-modal-title"
              variant="h5"
              component="h2"
              fontFamily="Oswald"
              color="white"
            >
              Booking Enrollment
            </Typography>
            <Button
              onClick={(e) => {
                e.preventDefault();
                props.setOpenModal1(false);
              }}
              sx={{ p: 0, m: 0, color: "white"}}
            >
              <CloseIcon></CloseIcon>
            </Button>
          </Box>

          <Box p={4} sx={{ maxHeight: "95%", overflow: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Venue:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {props.booking.current.venue}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Date:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {moment(props.booking.current.date).format("MMMM D Y")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                Start Time:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="5px"
                fontFamily="Roboto Slab"
              >
                {props.booking.current.startTime}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                fontWeight="bold"
                marginBottom="0px"
                fontFamily="Roboto Slab"
              >
                End Time:
              </Typography>
              <Typography
                fontWeight="bold"
                marginBottom="0px"
                fontFamily="Roboto Slab"
              >
                {props.booking.current.endTime}
              </Typography>
            </Box>

            <br></br>
            <TextField
              name="description"
              onChange={(e) => props.handleChange(e)}
              sx={{ width: "100%" }}
              value={props.booking.current.description}
              id="outlined-basic"
              label="Title"
              variant="standard"
              inputProps={{ maxLength: 50 }}
            />
            {props.error === true && props.booking.current.description === "" ? (
              <Typography color="red">
                Title or description is required
              </Typography>
            ) : (
              <div>
                <br></br>
              </div>
            )}

            <TextField
              name="officeName"
              onChange={(e) => props.handleChange(e)}
              sx={{ width: "100%" }}
              value={props.booking.current.officeName}
              id="outlined-basic"
              label="Office Name"
              variant="standard"
              inputProps={{ maxLength: 20 }}
            />
            <br></br>
            <br></br>
            <FormControl variant="standard" sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-filled-label">
                Purpose
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={props.booking.current.purpose}
                onChange={props.handleChange}
                label="Purpose"
                name="purpose"
              >
                {/* <MenuItem value="Purpose">
              <em>None</em>
            </MenuItem> */}
                <MenuItem value={"Studying"}>Studying</MenuItem>
                <MenuItem value={"Playing"}>Playing</MenuItem>
                <MenuItem value={"Meeting"}>Meeting</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              margin: "10px 15px 15px 10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                if (props.booking.current.description === "") {
                  props.setError(true);
                } else {
                  props.setError(false);
                  props.setOpenModal1(false);
                  props.setOpenModal2(true);
                }
              }}
              sx={ButtonStyle1}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Modal>
    )
}