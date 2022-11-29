import { Avatar, Typography, IconButton, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";
import { useMutation } from "@apollo/client";

function QueuedSongList({ queue }) {
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    greaterThanMd && (
      <div style={{ margin: "10px 0" }}>
        <Typography color="textSecondary" variant="button">
          QUEUE ({queue.length})
        </Typography>
        {queue.map((song) => (
          <QueuedSong key={song.id} song={song} />
        ))}
      </div>
    )
  );
}

const classes = {
  avatar: {
    width: 44,
    height: 44,
  },
  text: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  container: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "50px auto 50px",
    gridGap: 12,
    alignItems: "center",
    marginTop: 10,
  },
  songInfoContainer: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
};

function QueuedSong({ song }) {
  const { thumbnail, artist, title } = song;
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: { input: { ...song }, __typename: "Song" },
    });
  }
  return (
    <div style={classes.container}>
      <Avatar src={thumbnail} alt="Song thumbnail" style={classes.avatar} />
      <div style={classes.songInfoContainer}>
        <Typography variant="subtitle2" style={classes.text}>
          {title}
        </Typography>
        <Typography color="textSecondary" variant="body2" style={classes.text}>
          {artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <DeleteIcon color="error" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;
