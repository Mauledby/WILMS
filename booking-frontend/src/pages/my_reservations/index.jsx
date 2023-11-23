import DashBoardTemplate from "../containers/dashboard_template";
import { BASE_URL } from "../../links";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
  MenuItem,
  InputLabel,
  TablePagination,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import Table from "@mui/material/Table";
import SearchIcon from "@mui/icons-material/Search";
import TableBody from "@mui/material/TableBody";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import axios from "axios";
import * as React from "react";
import {
  selectedStyle,
  unselectedStyle,
  modalHeaderStyle,
  modalStyle,
  ButtonStyle1,
  ButtonStyle2,
  StyledTableCell,
  StyledTableRow,
  SearchIconWrapper,
  StyledInputBase,
} from "./styles";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// const events = [
//   {
//     title: "Meeting",
//     date: "05/20/2023",
//     start: "7:00",
//     end: "10:00",
//     venue: "Coworking Space",
//     reference: "12",
//     computers: "2",
//   },
//   {
//     title: "Meeting",
//     date: "05/20/2023",
//     start: "8:00",
//     end: "11:00",
//     venue: "Conference A",
//     reference: "12",
//     computers: "2",
//   },
// ];
const maxComputers = 10;
export default function MyReservations(props) {
  const [bookingsRefresher, setBookingsRefresher] = useState(true);
  const [fakeUserDb, setFakeUserDb] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [attendeeName, setAttendeeName] = useState("");
  const [bookingAttendees, setBookingAttendees] = useState([]);
  const [attendee, setAttende] = useState(0);
  const [tempId, setTempId] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [role, setRole] = useState("admin"); //default role
  const [attendeesModal, setAttendeesModal] = useState(false);
  const [viewDetails, setViewDetails] = useState({});

  const found = (element) => element.name === attendeeName;
  const deleteUser = (index) => {
    setAttendeeList([
      ...attendeeList.slice(0, index),
      ...attendeeList.slice(index + 1),
    ]);
  };

  // const [user, setUser] = useState({
  //   id: 1,
  //   username: "francis",
  // });
  const { user, userLogout } = React.useContext(AuthContext);

  const handleView = (id) => {
    setTempId(id);

    let a = events.find((item) => {
      return item.id === id;
    });
    axios.get(`${BASE_URL}/api/getAttendees/${a.id}/`).then((res) => {
      setAttendeeList(res.data);
      setViewDetails(a);
      console.log(a);
      setViewModal(true);
      console.log(id);
    });
  };

  const handleEdit = (id) => {
    setTempId(id);
    setEditModal(true);
    let b = events.find((item) => {
      return item.id === id;
    });
    setViewDetails(b);
    booking.current.title = b.description;
    console.log(b);
  };

  //init page
  // React.useEffect(() => {
  //   axios.get("http://127.0.0.1:8000/api/getUsers/").then((res) => {
  //     setFakeUserDb(res?.data);
  //   });
  // }, []);

  const handleChange = (e) => {
    var tempBooking = booking.current;
    if (e.target.name === "description") {
      tempBooking[e.target.name] = parseInt(e.target.value);
    } else {
      tempBooking[e.target.name] = e.target.value;
    }
    booking.current = tempBooking;
    setRefresh(!refresh);
  };
  
  //display bookings
  const [events, setEvents] = useState([]);
  // React.useEffect(() => {
  //   if (user?.role === "admin") {
  //     axios.get(`${BASE_URL}/api/getAllBookings/`).then((res) => {
  //       setEventData(res.data);
  //       setEvents(res.data);
  //       // ...
  //     });
  //     // } else if (role === "user") {
  //     //   setUser({id:1,
  //     //             username: "francis",})
  //     //   axios
  //     //     .get(`http://localhost:8000/api/getAllUserBooking/${user.id}`)
  //     //     .then((res) => {
  //     //       setEventData(res.data);
  //     //       setEvents(
  //     //         // res?.data.map((item) => {
  //     //         //   return {
  //     //         //     id: item?.id,
  //     //         //     title: item?.description,
  //     //         //     date: item?.date,
  //     //         //     start: item?.startTime,
  //     //         //     end: item?.endTime,
  //     //         //     venue: item?.venue,
  //     //         //   };
  //     //         // })
  //     //         res.data
  //     //       );
  //     //     });
  //   }
  // }, [bookingsRefresher]);

  const cancelBooking = () => {
    axios
      .get(`${BASE_URL}/api/cancelBooking/${tempId}`)
      .then(() => {
        setBookingsRefresher(!bookingsRefresher);
        setCancelModal(false);
        alert("Booking cancelled successfully");
      })
      .catch((error) => {
        console.error("Error cancelling booking:", error);
      });
  };

  // const fakeUserDb = [
  //   { name: "127-2242-290", id: 2 },
  //   { name: "225-5224-280", id: 3 },
  //   { name: "Celine", id: 4 },
  // ];

  const [venueSelected, setVenueSelected] = useState("Coworking Space");
  const [venueId, setVenueId] = useState(1);
  const [statusSelected, setStatusSelected] = useState("All");
  const [timeSelected, setTimeSelected] = useState("Upcoming");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [attendeeList, setAttendeeList] = useState([
    { name: "127-2242-290", id: 2 },
    { name: "225-5224-280", id: 3 },
    { name: "Celine", id: 4 },
  ]);

  useEffect(() => {
    
    const filtered = events.filter((item) => item.venue === venueId);
      setFilteredEvents(filtered);
    
  }, [venueId, events]);

  //searchbar
  const handleSearchTextChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    if (searchText === "") {
      // if empty dipslay all events
      const filtered = events.filter((item) => {
        return (
          (item.venue === venueId &&
            item.description
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (item.venue === venueId &&
            item.date.toString().includes(searchText)) ||
          (item.venue === venueId &&
            item.referenceNo.toLowerCase().includes(searchText.toLowerCase()))
        );
      });
      setFilteredEvents(filtered);
    } else {
      const filtered = events.filter((item) => {
        return (
          (item.venue === venueId &&
            item.description
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (item.venue === venueId &&
            item.date.toString().includes(searchText)) ||
          (item.venue === venueId &&
            item.referenceNo.toLowerCase().includes(searchText.toLowerCase()))
        );
      });
      setFilteredEvents(filtered);
    }
  };

  // let filteredEvents = events
  // .filter((item) => {
  //   return item.venue === venueId;
  // })
  // .sort(
  //   (first, second) =>
  //     second.date > first.date ? 1 : second.date < first.date ? -1 : 0
  //   (a,b)=>a.date.localCompare(b.date)||a.startTime.localCompare(b.startTime)
  // );

  useEffect(() => {
   
  
    if (statusSelected === "Cancelled" && user?.role === "admin") {
      axios
        .get(`${BASE_URL}/api/getAllCancelledBookings/`)
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching canceled bookings:", error);
        });
    } else if (statusSelected === "All" && user?.role === "admin") {
      axios
        .get(`${BASE_URL}/api/getAllBookings/`)
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching all bookings:", error);
        });
    } else if (statusSelected === "No Show" && user?.role === "admin") {
      axios
        .get(`${BASE_URL}/api/getAllNoShowBookings/`)
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching no show bookings:", error);
        });
    }
    if (timeSelected === "Upcoming" && user?.role === "user") {
     
      axios
        .get(`${BASE_URL}/api/getUpcomingUserBookings/${user?.user_id}/`)
        .then((response) => {          
          setEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching no show bookings:", error);
        });
    } else if (timeSelected === "History" && user?.role === "user") {
      axios
        .get(`${BASE_URL}/api/getHistoryUserBookings/${user?.user_id}/`)
        .then((response) => {
          
          setEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching history bookings:", error);
        });
    }
    
  }, [statusSelected, timeSelected,bookingsRefresher]);
  const addAttendee = () => {
    let isExisting = false;
    let id = null;
    let userFound = null;
    // Add attendee to the booking using the 'addAttendee' API
    if (attendeeName === "") {
      alert("Please Enter Attendee name");
      return;
    }
    {
      //finds username in database
      userFound = fakeUserDb.find((x) => x.name === attendeeName);

      if (userFound !== undefined) {
        isExisting = true;
        id = userFound?.id;
      }
      // setAttendeeList([...attendeeList, newUser]);
      // setRefresh(!refresh)
    }
    axios
      .post(`${BASE_URL}api/addAttendee/${tempId}/`, {
        name: attendeeName,
        user_id: id,
      })
      .then(() => {
        axios.get(`${BASE_URL}/api/getAttendees/${tempId}/`).then((res) => {
          setAttendeeList(res.data);
        });
        alert("Attendee added to the booking.");
      })
      .catch((error) => {
        console.error("Error adding attendee to the booking:", error);
      });
  };

  const deleteAttendee = (id) => {
    axios
      .delete(`${BASE_URL}/api/deleteAttendee/${id}/`)
      .then(() => {
        axios.get(`${BASE_URL}/api/getAttendees/${tempId}/`).then((res) => {
          setAttendeeList(res.data);
        });
      })
      .catch((error) => {
        console.error("Error removing attendee from the booking:", error);
      });
  };

  const editBooking = () => {
    const requestBody = {
      title: booking.current.title,
      purpose: booking.current.purpose,
      // computers: booking.current.computers,
    };
    //setTempId(id);
    axios
      .put(`${BASE_URL}/api/editBooking/${tempId}/`, requestBody)
      .then(() => {
        setBookingsRefresher(!bookingsRefresher);
        setCancelModal(false);
        alert("Booking updated successfully");
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
      });
  };

  const booking = useRef({
    purpose: "Studying",
    title: "",
    description: "",
    startTime: "",
    venue: "",
    endTime: "",
    date: "",
    computers: 0,
    participants: 0,
    coins: 0,
    points: 0,
    user: 0,
  });
  //pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to the first page when changing rowsPerPage
  };
  const navigate = useNavigate();
  if (user === null) {
    userLogout();
  } else {
    return (
      <div>
        {user?.role === "user" ? (
          <DashBoardTemplate title="My Reservations">
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
                        timeSelected === "Upcoming"
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => setTimeSelected("Upcoming")}
                    >
                      Upcoming
                    </Button>
                    <Button
                      sx={
                        timeSelected === "History"
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => setTimeSelected("History")}
                    >
                      History
                    </Button>
                  </ButtonGroup>
                </div>
                <TableContainer>
                  <Table
                    style={{
                      width: 1000,
                      textAlign: "center",
                      fontFamily: "Poppins",
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Reference No.</StyledTableCell>
                        <StyledTableCell>Title</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Start</StyledTableCell>
                        <StyledTableCell>End</StyledTableCell>
                        <StyledTableCell>Venue</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* user */}
                      {filteredEvents
                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                        .map((event, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              WIL{event.referenceNo.toUpperCase()}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {event?.description}
                            </StyledTableCell>
                            <StyledTableCell>{event?.date}</StyledTableCell>
                            <StyledTableCell>
                              {event?.startTime}
                            </StyledTableCell>
                            <StyledTableCell>{event?.endTime}</StyledTableCell>
                            <StyledTableCell>{event?.venue}</StyledTableCell>
                            <StyledTableCell align="center">
                              <Button
                                sx={ButtonStyle1}
                                onClick={() => {
                                  handleView(event.id);
                                  // axios
                                  //   .get(
                                  //     `http://localhost:8000/api/getAttendees/${tempId}/`
                                  //   )
                                  //   .then((res) => {
                                  //     setRefresh(!refresh);
                                  //     setAttendeeList(res.data);
                                  //   });
                                }}
                                p={200}
                              >
                                View
                              </Button>
                            </StyledTableCell>

                            {timeSelected === "Upcoming" ? (
                              <StyledTableCell align="center">
                                <Button
                                  sx={ButtonStyle2}
                                  onClick={() => {
                                    // axios
                                    //   .get(
                                    //     `http://localhost:8000/api/getAttendees/${tempId}/`
                                    //   )
                                    //   .then((res) => {
                                    //     setAttendeeList(res.data);
                                    //   });
                                    handleEdit(event.id);
                                  }}
                                >
                                  Edit
                                </Button>
                              </StyledTableCell>
                            ) : (
                              // <StyledTableCell align="right">
                              //   <Button sx={{...ButtonStyle2, marginLeft: "5px"}}>Review</Button>
                              // </StyledTableCell>
                              <div></div>
                            )}
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
        ) : (
          <DashBoardTemplate title="Manage Reservations">
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
              <Box
                sx={{
                  p: "0px 0px 0px 0px",
                }}
                maxWidth="90%"
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
                <div style={{ display: "flex", marginBottom: "20px" }}>
                  <ButtonGroup>
                    <Button
                      sx={
                        statusSelected === "Cancelled"
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => setStatusSelected("Cancelled")}
                    >
                      CANCELLED
                    </Button>
                    <Button
                      sx={
                        statusSelected === "No Show"
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => setStatusSelected("No Show")}
                    >
                      NO SHOW
                    </Button>
                    <Button
                      sx={
                        statusSelected === "All"
                          ? selectedStyle
                          : unselectedStyle
                      }
                      onClick={() => setStatusSelected("All")}
                    >
                      ALL
                    </Button>
                  </ButtonGroup>
                </div>

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
                      fontFamily: "Poppins",
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">
                          Reference No.
                        </StyledTableCell>
                        <StyledTableCell>Title</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Start</StyledTableCell>
                        <StyledTableCell>End</StyledTableCell>
                        <StyledTableCell>Venue</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* admin*/}
                      {filteredEvents
                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                        .map((event, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              WIL{event.referenceNo.toUpperCase()}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {event.description}
                            </StyledTableCell>
                            <StyledTableCell>{event.date}</StyledTableCell>
                            <StyledTableCell>{event.startTime}</StyledTableCell>
                            <StyledTableCell>{event.endTime}</StyledTableCell>
                            <StyledTableCell>{event.venue}</StyledTableCell>
                            <StyledTableCell>
                              <Button
                                sx={ButtonStyle1}
                                onClick={() => {
                                  handleView(event.id);
                                  // axios
                                  //   .get(
                                  //     `http://localhost:8000/api/getAttendees/${tempId}/`
                                  //   )
                                  //   .then((res) => {
                                  //     setRefresh(!refresh);
                                  //     setAttendeeList(res.data);
                                  //   });
                                }}
                              >
                                View
                              </Button>
                            </StyledTableCell>
                            {statusSelected === "All" ? (
                              <StyledTableCell align="center">
                                <Button
                                  sx={ButtonStyle2}
                                  onClick={() => {
                                    setEditModal(true);
                                    setTempId(event.id);
                                    //alert(event.id);
                                  }}
                                >
                                  Edit
                                </Button>
                              </StyledTableCell>
                            ) : (
                              // <StyledTableCell align="center">
                              //    <Button
                              //     sx={{
                              //       ...ButtonStyle1,
                              //       backgroundColor: "#ff595e",
                              //     }}
                              //   >
                              //     Review
                              //   </Button>
                              //   </StyledTableCell>
                              <div></div>
                            )}
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
        )}

        <Modal
          disableAutoFocus={true}
          open={viewModal}
          onClose={() => setViewModal(false)}
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
                fontFamily="Poppins"
                color="white"
              >
                Booking Details
              </Typography>
            </Box>

            <Box p={4}>
              {viewDetails.status === "Cancelled" ? (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Title:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Reference No:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.referenceNo}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Computers:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.computers}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                      {viewDetails.startTime}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      End Time:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.endTime}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Status:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.status}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                      {viewDetails.venue}
                    </Typography>
                  </Box>
                  <br></br>
                  <Typography
                    fontWeight="bold"
                    marginTop="0px"
                    fontFamily="Oswald"
                    backgroundColor="black"
                    sx={{ float: "left", transform: "rotate(-5deg)" }}
                    p="5px 10px 5px 10px"
                    color="white"
                  >
                    Attendees
                  </Typography>
                  <List
                    className="userList"
                    dense={true}
                    style={{
                      maxHeight: "150px",
                      width: "100%",
                      overflow: "auto",
                    }}
                  >
                    {attendeeList.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem m={0} key={index}>
                          <ListItemText
                            fontSize="12px"
                            primary={item.name}
                            // secondary={secondary ? 'Secondary text' : null}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                  <Box
                    sx={{
                      margin: "10px 15px 15px 10px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  ></Box>
                </>
              ) : (
                <>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Title:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Reference No:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.referenceNo}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Computers:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.computers}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                      {viewDetails.startTime}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      End Time:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.endTime}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      Status:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      marginBottom="5px"
                      fontFamily="Roboto Slab"
                    >
                      {viewDetails.status}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                      {viewDetails.venue}
                    </Typography>
                  </Box>
                  <br></br>
                  <Typography
                    fontWeight="bold"
                    marginTop="0px"
                    fontFamily="Oswald"
                    backgroundColor="black"
                    sx={{ float: "left", transform: "rotate(-5deg)" }}
                    p="5px 10px 5px 10px"
                    color="white"
                  >
                    Attendees
                  </Typography>
                  <List
                    className="userList"
                    dense={true}
                    style={{
                      maxHeight: "150px",
                      width: "100%",
                      overflow: "auto",
                    }}
                  >
                    {attendeeList.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem m={0} key={index}>
                          <ListItemText
                            fontSize="12px"
                            primary={item.name}
                            // secondary={secondary ? 'Secondary text' : null}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                  {timeSelected !== "History" && user?.role == "user" &&(
                       <Typography
                       sx={{ paddingLeft: 2, color: "darkred" }}
                       fontFamily="Poppins"
                     >
                       Note: 30% of cost as cancellation fee
                     </Typography>
                    )}
                  <Box
                    sx={{
                      margin: "10px 15px 15px 10px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {timeSelected !== "History" && (
                      <Button
                        sx={ButtonStyle1}
                        variant="contained"
                        onClick={() => {
                          setCancelModal(true);
                          setViewModal(false);
                        }}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Modal>

        {/* Are you sure you want to cancel */}
        <Modal
          disableAutoFocus={true}
          open={cancelModal}
          onEn
          onClose={() => setCancelModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{ width: "100%", overflow: "auto" }}
        >
          <Box
            sx={{
              ...modalStyle,
              width: { lg: 500, xs: 350, sm: 500, md: 500, xl: 500 },
            }}
          >
            <Box sx={modalHeaderStyle}>
              <Typography
                sx={{ fontWeight: "bold" }}
                id="modal-modal-title"
                variant="h5"
                component="h2"
                fontFamily="Poppins"
                color="white"
              >
                Cancel Booking
              </Typography>
            </Box>
            <Box p={4}>
              {user?.role === "user" ? (
                <Box>
                  <Box
                    sx={{ display: "column", justifyContent: "space-between" }}
                  >
                    <Typography
                      fontWeight="bold"
                      marginBottom="10px"
                      fontFamily="Poppins"
                      fontSize="25px"
                    >
                      Are you sure you want to cancel?
                    </Typography>

                    <Typography marginBottom="15px" fontFamily="Poppins">
                      Cost of Cancellation: 10
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      sx={{
                        ...ButtonStyle1,
                        paddingRight: "30px",
                        paddingLeft: "30px",
                      }}
                      variant="contained"
                      onClick={() => cancelBooking(tempId)}
                    >
                      Pay{" "}
                    </Button>
                    {/* <Button variant="contained">Pay</Button> */}
                    <Button
                      sx={{
                        ...ButtonStyle1,
                        paddingRight: "30px",
                        paddingLeft: "30px",
                      }}
                      variant="contained"
                      onClick={() => {
                        setViewModal(true);
                        setViewModal(false);
                        setCancelModal(false);
                      }}
                    >
                      No
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    onClick={() => cancelBooking(tempId)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setViewModal(false);
                      setCancelModal(false);
                    }}
                  >
                    No
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Modal>

        {/*Edit Modal */}
        <Modal
          disableAutoFocus={true}
          open={editModal}
          onClose={() => setEditModal(false)}
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
                fontFamily="Poppins"
                color="white"
              >
                Edit Booking Details
              </Typography>
            </Box>
            <Box p={4}>
              <TextField
                name="title"
                value={booking.current.title}
                onChange={(e) => handleChange(e)}
                sx={{ width: "100%" }}
                id="outlined-basic"
                label="Title"
                variant="standard"
                inputProps={{ maxLength: 50 }}
              />
              <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                <InputLabel id="demo-simple-select-filled-label">
                  Purpose
                </InputLabel>
                <Select
                  value={booking.current.purpose}
                  onChange={props.handleChange}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
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

              {/* <TextField
              name="officeName"
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Office Name"
              variant="standard"
              inputProps={{ maxLength: 20 }}
            /> */}
              {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                name="computers"
                type="number"
                sx={{ width: "40%" }}
                value={booking.current.computers}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: maxComputers,
                  },
                }}
                id="outlined-basic"
                label="Computers"
                variant="standard"
                onChange={(e) => handleChange(e)}
                autoFocus={false}
              />
            </Box> */}
              <Button
                variant="contained"
                onClick={() => {
                  // if()
                  setViewModal(false);
                  setCancelModal(false);
                  setAttendeesModal(true);
                  editBooking(tempId);
                }}
                sx={{ ...ButtonStyle1, marginLeft: "260px", marginTop: "20px" }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        {/*Attendees Edit*/}
        {/* <Modal
        disableAutoFocus={true}
        open={attendeesModal}
        onClose={() => setAttendeesModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ width: "100%", overflow: "auto" }}
      >
        <Box sx={modalStyle}>
          <Box sx={modalHeaderStyle}>
            <Typography
              fontWeight="bold"
              variant="h6"
              fontFamily="Poppins"
              color="white"
              p="5px 10px 5px 10px"
              sx={{ display: "inline-block" }}
            >
              Attendees:
            </Typography>
          </Box>
          <Box p={4}>
            <Box sx={{ display: "flex", marginTop: "20px" }}> */}
        {/* <TextField
                sx={{ width: "100%", marginRight: "20px" }}
                id="outlined-basic"
                placeholder="Enter Name or Id"
                variant="standard"
                onChange={(e) => {
                  setAttendeeName(e.target.value);
                }}
              />
              {/* <Autocomplete
                freeSolo
                defaultValue=""
                autoSelect={false}
                id="combo-box-demo"
                options={fakeUserDb.map((item) => {
                  return {
                    label: item.name,
                    id: item.id,
                  };
                })}
                inputValue={attendeeName}
                onInputChange={(event, newInputValue) => {
                  setAttendeeName(newInputValue);
                }}
                sx={{ width: 300, marginRight: 5 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Enter Name or Id"
                    variant="standard"
                  />
                )}
              />
              <Button
                onClick={(e) => {
                  if (attendeeName === "") {
                    alert("Please Enter Attendee name");
                    return;
                  }
                  if (
                    attendeeList.some(found) ||
                    attendeeName === user.username
                  ) {
                  } else {
                    let isExisting = false;
                    let id = null;
                    let userFound = null;
                    //finds username in database
                    userFound = fakeUserDb.find((x) => x.name === attendeeName);

                    if (userFound !== undefined) {
                      isExisting = true;
                      id = userFound?.id;
                    }
                    const newUser = {
                      name: attendeeName,
                      existing: isExisting,
                      id: id,
                    };
                    setAttendeeList([...attendeeList, newUser]);
                    addAttendee(tempId);
                    // setRefresh(!refresh)
                  }
                }}
                sx={{
                  color: "white",
                  backgroundColor: "#555555",
                  ":hover": { color: "#white", backgroundColor: "#555555" },
                }}
              >
                Add
              </Button>
            </Box>
            <Box m="5px 15px 0px 0px">
              <List
                style={{ maxHeight: "200px", width: "100%", overflow: "auto" }}
                className="userList"
                dense={true}
              >
                <ListItem sx={{ p: "0px 0px 0px 5px" }}>
                  <ListItemText
                    primary={user.username}
                    secondary={
                      <Typography fontSize={14} color="green">
                        Owner
                      </Typography>
                    }
                  />
                </ListItem>
                {attendeeList.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{ p: "0px 0px 0px 20x" }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          deleteUser(index);
                          deleteAttendee(item.id);
                        }}
                      >
                        <ClearIcon></ClearIcon>
                      </IconButton>
                    }
                  > */}
        {/* <ListItemAvatar>
                  <Avatar>
                    <PersonIcon></PersonIcon>
                  </Avatar>
                </ListItemAvatar> */}
        {/* <ListItemText
                      primary={item.name}
                      secondary={
                        item.existing === true ? (
                          <Typography fontSize={14} color="green">
                            Existing User:Yes{" "}
                          </Typography>
                        ) : (
                          <Typography fontSize={14} color="#555555">
                            Existing User:No{" "}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ float: "right", margin: 2, marginRight: -1 }}>
                <Button
                  sx={ButtonStyle1}
                  onClick={() => {
                    setEditModal(true);
                    setAttendeesModal(false);
                  }}
                >
                  Back
                </Button>{" "}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal> */}
      </div>
    );
  }
}
