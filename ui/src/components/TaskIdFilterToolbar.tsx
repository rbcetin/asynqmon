import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { TaskInfoExtended } from "../reducers/tasksReducer";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexWrap: "wrap",
  },
  filterInput: {
    minWidth: 220,
    "& .MuiInputBase-root": {
      fontSize: "0.85rem",
    },
  },
  stats: {
    fontSize: "0.8rem",
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1),
    whiteSpace: "nowrap",
  },
  feedback: {
    fontSize: "0.8rem",
    color: theme.palette.success.main,
    marginLeft: theme.spacing(1),
  },
}));

interface TaskIdFilterToolbarProps {
  tasks: TaskInfoExtended[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
}

export default function TaskIdFilterToolbar(props: TaskIdFilterToolbarProps) {
  const { tasks, selectedIds, onSelectIds } = props;
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current !== null) {
        window.clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  function showFeedback(msg: string) {
    setFeedback(msg);
    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = window.setTimeout(() => {
      setFeedback("");
      feedbackTimer.current = null;
    }, 4000);
  }

  const filterLower = filter.toLowerCase().trim();
  const matchingTasks = filterLower
    ? tasks.filter(
        (t) =>
          t.id.toLowerCase().includes(filterLower) ||
          (t.payload && t.payload.toLowerCase().includes(filterLower))
      )
    : tasks;
  const matchCount = matchingTasks.length;

  const handlePickFiltered = () => {
    const matchingIds = matchingTasks.map((t) => t.id);
    const merged = Array.from(new Set([...selectedIds, ...matchingIds]));
    onSelectIds(merged);
    showFeedback(`Picked ${matchingIds.length} task(s)`);
  };

  const handleUnpickAll = () => {
    onSelectIds([]);
    showFeedback("Cleared selection");
  };

  return (
    <div className={classes.toolbar}>
      <TextField
        className={classes.filterInput}
        size="small"
        variant="outlined"
        placeholder="Filter by task ID or payload..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={handlePickFiltered}
        disabled={matchCount === 0}
      >
        Pick filtered
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={handleUnpickAll}
        disabled={selectedIds.length === 0}
      >
        Unpick all
      </Button>
      <Typography className={classes.stats} component="span">
        {matchCount}/{tasks.length} match &middot; {selectedIds.length} selected
      </Typography>
      {feedback && (
        <Typography className={classes.feedback} component="span">
          {feedback}
        </Typography>
      )}
    </div>
  );
}
