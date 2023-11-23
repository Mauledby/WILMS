import DashBoardTemplate from "../containers/dashboard_template";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../links";

import {
  Box,
  Button,
  ButtonGroup,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import axios from "axios";
import {
  selectedStyle,
  unselectedStyle,
  StyledTableCell,
  StyledTableRow,
  SearchIconWrapper,
  StyledInputBase,
  Search,
} from "./styles";

export default function Logs(props) {
  const [venueSelected, setVenueSelected] = useState("Coworking Space");
  const [venueId, setVenueId] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/getAllAttendance/`)
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  useEffect(() => {
    const filtered = events.filter((item) => item.venueName === venueSelected);
    setFilteredEvents(filtered);
  }, [venueSelected, events]);

    //searchbar
    const handleSearchTextChange = (e) => {
      const searchText = e.target.value;
      setSearchText(searchText);
    
      if (searchText === "") { // if empty dipslay all events
        const filtered = events.filter((item) => {
          return (
            (item.venueId ===venueId && item.name.toLowerCase().includes(searchText.toLowerCase()))
          ||
            (item.venueId ===venueId&& item.date.toString().includes(searchText))
          );
        });
        console.log(filtered)
        setFilteredEvents(filtered);
      } else {
        const filtered = events.filter((item) => {
          return (
            (item.venueId ===venueId && item.name.toLowerCase().includes(searchText.toLowerCase()))
          ||
            (item.venueId ===venueId&& item.date.toString().includes(searchText))
          );
        });
        console.log(filtered)
        setFilteredEvents(filtered);
      }
    };

  //pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); //reset to first page
  };
  
  
  return (
    <div>
      <DashBoardTemplate title="Attendance Logs">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            fontFamily: "Poppins",
          }}
        ></div>
        <br></br>
        <Box
          backgroundColor="white"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <div>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                border: "3px solid rgba(0, 0, 0, 0.05)",
                marginLeft: "745px",
                alignItems: "center",
                paddingLeft: 2,
                backgroundColor: "white",
              }}
            >
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                value={searchText}
                onChange={handleSearchTextChange}
                inputProps={{ "aria-label": "search" }}
              />
            </Box>
          </div>
  
          <Box
            sx={{
              p: "0px 0px 0px 0px",
            }}
            maxWidth="90%"
          >
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <ButtonGroup>
                  <Button
                    sx={
                      venueSelected === "Coworking Space"
                        ? selectedStyle
                        : unselectedStyle
                    }
                    onClick={() => {
                      setVenueSelected("Coworking Space");
                      setVenueId(1);
                    }}
                  >
                    CO-WORKING SPACE
                  </Button>
                  <Button
                    sx={
                      venueSelected === "Conference Room A"
                        ? selectedStyle
                        : unselectedStyle
                    }
                    onClick={() => {
                      setVenueSelected("Conference Room A");
                      setVenueId(2);
                    }}
                  >
                    CONFERENCE A
                  </Button>
                  <Button
                    sx={
                      venueSelected === "Conference Room B"
                        ? selectedStyle
                        : unselectedStyle
                    }
                    onClick={() => {
                      setVenueSelected("Conference Room B");
                      setVenueId(3);
                    }}
                  >
                    CONFERENCE B
                  </Button>
                </ButtonGroup>
            </div>
            <TableContainer>
              <Table
                style={{
                  width: 1000,
                  textAlign: "center",
                  fontFamily: "Oswald",
                }}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">isLoggedin</StyledTableCell>
                    <StyledTableCell align="center">
                      isOverstaying
                    </StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Login Time</StyledTableCell>
                    <StyledTableCell align="center">
                      Logout Time
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredEvents.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((event, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {event.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {event.isSignedIn === true ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {event.isOverstaying === true ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {event.date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {event.signInTime}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {event.signOutTime}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                  component="div"
                  count={filteredEvents.length}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  labelRowsPerPage=""
                />
            </TableContainer>
          </Box>
        </Box>
      </DashBoardTemplate>
    </div>
  );
}