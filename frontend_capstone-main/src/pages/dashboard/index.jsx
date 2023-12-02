import DashBoardTemplate from "../containers/dashboard_template";
import { BASE_URL } from "../../links";

import {
  Box,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  CardContent,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import axios from "axios";
import * as React from "react";

import { StyledTableCell, StyledTableRow } from "./styles";

//temp deets
// const containerDetails = [
//   {
//     title: "ONGOING",
//     contents: [
//       { name: 'Co-Working Space', length: 0 },
//       { name: 'Conference A', length: 0 },
//       { name: 'Conference B', length: 0 },
//       { name: 'Joined Conference', length: 0 },
//     ],
//   },
//   {
//     title: "EXPECTED",
//     contents: [
//       { name: 'Co-Working Space', length: 0 },
//       { name: 'Conference A', length: 0 },
//       { name: 'Conference B', length: 0 },
//       { name: 'Joined Conference', length: 0 },
//     ],
//   },
//   {
//     title: "WAITING",
//     contents: [
//       { name: 'Co-Working Space', length: 0 },
//       { name: 'Conference A', length: 0 },
//       { name: 'Conference B', length: 0 },
//       { name: 'Joined Conference', length: 0 },
//     ],
//   },
//   {
//     title: "OVERSTAYING",
//     contents: [
//       { name: 'Co-Working Space', length: 0 },
//       { name: 'Conference A', length: 0 },
//       { name: 'Conference B', length: 0 },
//       { name: 'Joined Conference', length: 0 },
//     ],
//   },
// ];
// const colors = ["#FFFF8F","#82eedd","#87CEEB","#98FB98","#FFD700","#FFA500",];
const colors = ["#fecc00", "white"];
// for Reviews
const reviews = [
  { label: "Name", value: "John Doe" },
  { label: "Date", value: "2023-10-12" },
  { label: "Rating", value: "4.5" },
  {
    label: "Comment",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse volutpat.",
  },
];

export default function Tracker(props) {
  //const [ratingFilter, setRatingFilter] = useState([0, 5]);
  const [data, setData] = useState([]);

const title = ["ONGOING", "EXPECTED", "WAITING", "OVERSTAYING"];

const [containerDetails, setContainerDetails] = useState(
  title.map((title) => ({
    title,
    contents: [
      // { name: "Conference A", count: 0 },
      // { name: "Conference B", count: 0 },
      // { name: "Co-Working Space", count: 0 },
    ],
  }))
);

useEffect(() => {
  const fetchData = async () => {
    const endpoints = [
      `${BASE_URL}/api/getOngoing/`,
      `${BASE_URL}/api/getExpected/`,
      `${BASE_URL}/api/getWaiting/`,
      `${BASE_URL}/api/getOverstaying/`,
    ];

    const updatedContainerDetails = [...containerDetails];

    try {
      for (let i = 0; i < endpoints.length; i++) {
        const response = await axios.get(endpoints[i]);
        if (response.status === 200) {
          const data = response.data;

          if (Array.isArray(data)) {

            updatedContainerDetails[i].contents = data.map((facility) => ({
              name: facility.facility_name,
              count: facility.count,
            }));
          } else {
            console.error(`Invalid data format for ${endpoints[i]}`);
          }
        } else {
          console.error(`Failed to fetch data from ${endpoints[i]}`);
        }
      }

      setContainerDetails(updatedContainerDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);
  
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/getSignedIn/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  return (
    <DashBoardTemplate title="Tracker">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      ></div>
      <div>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Typography
                sx={{
                  paddingLeft: -200,
                  color: "lightblack",
                  fontSize: 30,
                  fontWeight: "bold",
                  paddingRight: 100,
                  paddingTop: 5,
                  marginTop: 5,
                }}
                fontFamily="Poppins"
              >
                Activity Tracker
              </Typography>
            </div>
            {containerDetails.map((card, index) => (
              <Grid key={index} item xs={4} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    width: 243,
                    height: 'auto',
                    display: "relative",
                    background: `linear-gradient(to bottom, ${colors.join(
                      ", "
                    )})`,
                    marginBottom: 7,
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        fontFamily: "Poppins",
                      }}
                      color="text.primary"
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      textAlign="left"
                      fontFamily="Poppins"
                      fontSize={17}
                    >
                      {card.contents.map((content, i) => (
                        <div
                          key={i}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div style={{ flex: 1 }}>{content.name}</div>
                          <div style={{ width: "25px", marginLeft: "8px" }}>
                            [{content.count}]
                          </div>
                          <br />
                          <br />
                          {/* {i < card.contents.length - 1 && <br />} */}
                        </div>
                      ))}
                    </Typography>
                  </CardContent>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      {/* Logged in USERS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Typography
          sx={{
            paddingLeft: 15,
            color: "lightblack",
            fontSize: 30,
            fontWeight: "bold",
          }}
          fontFamily="Poppins"
        >
          Currently Logged in users
        </Typography>
      </div>
      <Container
        sx={{
          marginBottom: 5,
          backgroundColor: "f5fffa",
          borderRadius: 3,
          width: 1163,
        }}
      >
        <TableContainer
          sx={{
            minWidth: 50,
            display: "flex",
            justifyContent: "center",
            borderStyle: "groove",
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">Booking ID</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Venue</StyledTableCell>
                <StyledTableCell align="center">Time Signed in</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align="center">
                    {row.booking}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.venueName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.signInTime}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      </div>

      {/* CUSTOMER SATISFACTION & REVIEWS
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#f5fffa",
          alignItems: "center",
        }}
      >
        <Container
          sx={{
            justifyContent: "right",
            backgroundColor: "#f0fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: 300,
              backgroundColor: "#f5fffa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">CUSTOMER SATISFACTION</Typography>
            <div style={{ marginTop: "55px" }}></div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DateRangePicker", "DateRangePicker"]}>
                <DemoItem label="CHOOSE DATES" component="DateRangePicker">
                  <DateRangePicker
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    startText="From"
                    endText="To"
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Paper>
        </Container>

        // {/* TEMP COMMENTS */}
      {/* <Container
          sx={{ display: "flex", justifyContent: "flex-end", height: "100%" }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: 300,
              backgroundColor: "#f5fffa",
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
            }}
          > */}
      {/* <TableContainer>
              <Table>
                <TableRow>
                  {reviews.map((item, index) => (
                    <TableCell
                      key={index}
                      sx={{ textAlign: "left", margin: 5 }}
                    >
                      <Typography variant="h7">{item.label}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {reviews.map((item, index) => (
                    <TableCell key={index} sx={{ textAlign: "left" }}>
                      <span>{item.value}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Container> */}
    </DashBoardTemplate>
  );
}
