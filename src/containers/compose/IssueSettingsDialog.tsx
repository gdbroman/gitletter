import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { eatClick } from "../../../util/eatClick";
import { useAppHref } from "../../../util/hooks/useAppHref";
import { useToggle } from "../../../util/hooks/useToggle";
import { stringToMarkdownFileName } from "../../../util/strings";
import { DialogResponsive } from "../../components/DialogResponsive";
import { LoadingButton } from "../../components/LoadingButton";
import { issueService } from "../../services/issueService";

type Props = {
  issueId: string;
  initialFileName: string;
  open: boolean;
  onClose: () => void;
};

export const IssueSettingsDialog = ({
  issueId,
  initialFileName,
  open,
  onClose,
}: Props) => {
  const appHref = useAppHref();

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
          helperText={
            <Typography variant="caption" color="gray">
              This is what the file will be named in your repository if you have{" "}
              <Link href={`${appHref}/settings/github`}>GitHub connected</Link>.
            </Typography>
          }
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
