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
  removeBtn: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.light + "1a",
      borderColor: theme.palette.error.dark,
    },
  },
}));

interface TaskIdFilterToolbarProps {
  tasks: TaskInfoExtended[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onBatchDelete?: (taskIds: string[]) => Promise<void>;
  batchActionPending: boolean;
}

export default function TaskIdFilterToolbar(
  props: TaskIdFilterToolbarProps
) {
  const { tasks, selectedIds, onSelectIds, onBatchDelete, batchActionPending } =
    props;
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
    ? tasks.filter((t) => t.id.toLowerCase().includes(filterLower))
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

  const handleRemoveFiltered = () => {
    if (!onBatchDelete) return;
    const matchingIds = matchingTasks.map((t) => t.id);
    if (matchingIds.length === 0) {
      showFeedback("No matching tasks to remove");
      return;
    }
    const confirmed = window.confirm(
      `Delete ${matchingIds.length} task(s) matching "${filter}"?`
    );
    if (!confirmed) return;
    onBatchDelete(matchingIds).then(() => {
      showFeedback(`Removed ${matchingIds.length} task(s)`);
    });
  };

  return (
    <div className={classes.toolbar}>
      <TextField
        className={classes.filterInput}
        size="small"
        variant="outlined"
        placeholder="Filter by task ID..."
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
      {!window.READ_ONLY && onBatchDelete && (
        <Button
          size="small"
          variant="outlined"
          className={classes.removeBtn}
          onClick={handleRemoveFiltered}
          disabled={batchActionPending || matchCount === 0}
        >
          Remove filtered
        </Button>
      )}
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
