import {
  Button,
  Dialog,
  InputAdornment,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import LinkIcon from "@mui/icons-material/Link";
import React from "react";
import SoundcloudPlayer from "react-player/lib/players/SoundCloud";
import YoutubePlayer from "react-player/lib/players/YouTube";
import ReactPlayer from "react-player";
import { useMutation } from "@apollo/client";
import { ADD_SONG } from "../graphql/mutations";

function AddSong() {
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [dialog, setDialog] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [playable, setPlayable] = React.useState(false);
  const DEFAULT_SONG = { duration: 0, title: "", artist: "", thumbnail: "" };
  const [song, setSong] = React.useState(DEFAULT_SONG);

  React.useEffect(() => {
    const isPlayable =
      SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  function handleChangeSong(event) {
    const { name, value } = event.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  }

  function handleCloseDialog() {
    setDialog(false);
  }

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSoundcloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  async function handleAddSong() {
    try {
      const { url, thumbnail, duration, title, artist } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          duration: duration > 0 ? duration : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
        },
      });
      handleCloseDialog();
      setSong(DEFAULT_SONG);
      setUrl("");
    } catch (error) {
      console.error("Error adding song", error);
    }
  }

  function handleError(field) {
    return error && error.graphQLErrors[0].extensions.path.includes(field);
  }

  function getYoutubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundcloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
        console.log(songData);
      });
    });
  }
  const classes = {
    container: { display: "flex", alignItems: "center" },
    urlInput: {
      width: "85%",
      marginLeft: "15px",
      marginRight: "8px",
    },
    addSongButton: {
      marginTop: "-5px",
      ".css-n4augn-MuiButtonBase-root-MuiButton-root.Mui-disabled": {
        color: "#ffffff",
      },
    },
    thumbnail: {
      width: "90%",
    },
  };

  const { thumbnail, title, artist } = song;
  console.dir(error);
  return (
    <div style={classes.container}>
      <Dialog
        sx={{
          ".css-d6tvcf-MuiPaper-root-MuiDialog-paper": {
            bgcolor: "#121212 !important",
            textAlign: "center !important",
          },
        }}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <img src={thumbnail} alt="Song thumbnail" style={classes.thumbnail} />
          <TextField
            margin="dense"
            value={title}
            onChange={handleChangeSong}
            name="title"
            label="Title"
            fullWidth
            error={handleError("title")}
            helperText={handleError("title") && "Fill out field"}
          />
          <TextField
            margin="dense"
            value={artist}
            onChange={handleChangeSong}
            name="artist"
            label="Artist"
            fullWidth
            error={handleError("artist")}
            helperText={handleError("artist") && "Fill out field"}
          />
          <TextField
            value={thumbnail}
            onChange={handleChangeSong}
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
            error={handleError("thumbnail")}
            helperText={handleError("thumbnail") && "Fill out field"}
          />
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddSong} variant="outlined" color="primary">
              Add Song
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <TextField
        placeholder="Add Youtube or Soundcloud URL"
        variant="standard"
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        color="secondary"
        focused
        style={classes.urlInput}
        margin="none"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon color="secondary" />
            </InputAdornment>
          ),
        }}
      />
      <Button
        style={classes.addSongButton}
        sx={{
          "&:disabled": {
            bgcolor: "#575353",
          },
        }}
        disabled={!playable}
        onClick={() => setDialog(true)}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlinedIcon />}
      >
        Add
      </Button>
      <ReactPlayer url={url} hidden onReady={handleEditSong} />
    </div>
  );
}

export default AddSong;
