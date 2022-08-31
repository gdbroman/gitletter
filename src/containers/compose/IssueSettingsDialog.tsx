import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";

import { eatClick } from "../../../util/eatClick";
import { useToggle } from "../../../util/hooks/useToggle";
import { stringToMarkdownFileName } from "../../../util/strings";
import { DialogResponsive } from "../../components/DialogResponsive";
import { issueService } from "../../services/issueService";

type Props = {
  issueId: string;
  initialFileName: string;
  open: boolean;
  onClose: () => void;
};

export const IssueSettingsDialog: FC<Props> = ({
  issueId,
  initialFileName,
  open,
  onClose,
}) => {
  const [fileName, setFileName] = useState(initialFileName);
  const [savedFileName, setSavedFileName] = useState(initialFileName);

  const saving = useToggle(false);

  const isFileNameChanged = useMemo(
    () => fileName !== savedFileName,
    [fileName, savedFileName]
  );
  const isFileNameValid = useMemo(
    () => fileName.length > 0 && fileName.length < 100,
    [fileName]
  );
  const disabled = useMemo(
    () => !isFileNameChanged || !isFileNameValid,
    [isFileNameChanged, isFileNameValid]
  );

  const saveIssueSettings = useCallback(async () => {
    const lintedFileName = stringToMarkdownFileName(fileName);
    setFileName(lintedFileName);
    try {
      saving.toggleOn();
      await issueService.updateIssue({
        issueId,
        fileName: lintedFileName,
      });
    } catch (error) {
      console.error(error);
    } finally {
      saving.toggleOff();
      onClose();
    }
    setSavedFileName(lintedFileName);
  }, [fileName, issueId, onClose, saving]);
  const handleFileNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFileName(e.target.value);
    },
    []
  );
  const handleFileNameBlur = useCallback(
    async (e: any) => {
      eatClick(e);
      if (isFileNameChanged) {
        const lintedFileName = stringToMarkdownFileName(fileName);
        setFileName(lintedFileName);
      }
    },
    [fileName, isFileNameChanged]
  );

  return (
    <DialogResponsive open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <TextField
          fullWidth
          label="File name"
          type="text"
          value={fileName}
          style={{ marginTop: 8 }}
          onBlur={handleFileNameBlur}
          onChange={handleFileNameChange}
          helperText="This is what the file will be named in your repository if you have GitHub deployment enabled."
        />
      </DialogContent>

      <DialogActions>
        <Button autoFocus disabled={saving.isOn} onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={saving.isOn}
          variant={disabled ? "outlined" : "contained"}
          disabled={disabled}
          onClick={saveIssueSettings}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </DialogResponsive>
  );
};