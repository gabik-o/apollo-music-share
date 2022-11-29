import React from "react";
import AddSong from "./components/AddSong";
import Header from "./components/Header";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import { Grid, Hidden } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import songReducer from "./reducer";

export const SongContext = React.createContext({
  song: {
    id: "3344a004-8935-48d0-b946-61cd03259f1e",
    title: "Glock In My Lap",
    artist: "21 Savage",
    thumbnail: "https://i1.sndcdn.com/artworks-n63QVLRUJrkL-0-t500x500.jpg",
    url: "https://soundcloud.com/21savage/glock-in-my-lap",
    duration: 193.62,
  },
  isPlaying: false,
});

function App() {
  const initialSongState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(songReducer, initialSongState);
  const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <Hidden only="xs">
        <Header />
      </Hidden>
      <Grid container spacing={3}>
        <Grid
          style={{
            paddingTop: greaterThanSm ? 100 : 40,
          }}
          item
          xs={12}
          md={7}
        >
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            greaterThanMd
              ? {
                  position: "fixed",
                  width: "100%",
                  right: 0,
                  top: 70,
                  marginRight: 10,
                }
              : {
                  position: "fixed",
                  width: "100%",
                  bottom: 0,
                  right: 0,
                }
          }
          item
          xs={12}
          md={5}
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;
