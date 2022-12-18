import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useState } from "react";
import CSVReader from "react-csv-reader";

import { useToggle } from "../../../../util/hooks/useToggle";
import { DialogResponsive } from "../../../components/DialogResponsive";
import { useThemeContext } from "../../../contexts/theme";
import { newsletterService } from "../../../services/newsletterService";

type Props = {
  newsletterId: string;
  open: boolean;
  onClose: () => void;
};

export const ImportSubscribersDialog = ({
  newsletterId,
  open,
  onClose,
}: Props) => {
  const router = useRouter();
  const { theme } = useThemeContext();
  const isImporting = useToggle(false);
  const isUploading = useToggle(false);
  const [result, setResult] = useState<string>();
  const [importedEmails, setImportedEmails] = useState<string[]>([]);

  const Form = () => {
    if (isImporting.isOn)
      return (
        <Typography variant="h6" textAlign="center">
          Importing subscribers...
        </Typography>
      );

    if (isUploading.isOn) {
      return (
        <Typography variant="h6" textAlign="center">
          Uploading {importedEmails?.length} subscribers...
        </Typography>
      );
    }

    if (result) {
      return (
        <Typography variant="h6" textAlign="center">
          {result}
        </Typography>
      );
    }

    return <CSVReader onFileLoaded={onFileLoaded} />;
  };

  const handleClose = () => {
    if (isImporting.isOn || isUploading.isOn) return;
    router.replace(router.asPath);
    onClose();
  };

  const onFileLoaded = async (dataRows: any[]) => {
    isImporting.toggleOn();
    const csvEmails = dataRows
      .map((row: string[]) => row.find((cell: string) => cell.includes("@")))
      .filter(Boolean) as string[];
    setImportedEmails(csvEmails);
    setResult("Failed to import subscribers.");
    isImporting.toggleOff();
    isUploading.toggleOn();
    let uploadedEmails = 0;
    try {
      await Promise.all(
        csvEmails.map(async (email) => {
          uploadedEmails++;
          await newsletterService.subscribe(newsletterId, email);
        })
      );
    } finally {
      setResult(
        `Successfully imported ${uploadedEmails} out of ${csvEmails.length} subscribers.`
      );
    }
    isUploading.toggleOff();
  };

  return (
    <DialogResponsive breakPoint="md" onClose={onClose} open={open}>
      <Box display="flex" flexDirection="column" gap={4} padding={4} pt={3}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          style={{ userSelect: "none" }}
        >
          Import subscribers
        </Typography>
        <Box
          maxWidth={theme.breakpoints.down("xs")}
          style={{
            position: "relative",
            backgroundColor: theme.palette.secondary.light,
            borderRadius: 4,
            padding: 24,
          }}
        >
          <Form />
        </Box>
        <Button
          variant="contained"
          endIcon={<CheckIcon />}
          disabled={isImporting.isOn}
          onClick={handleClose}
        >
          Done
        </Button>
      </Box>
    </DialogResponsive>
  );
};
