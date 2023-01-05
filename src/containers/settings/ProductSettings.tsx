import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useMemo, useState } from "react";

import type { Product } from "../../../prisma/modules/stripe";
import { freeSubscriberLimit } from "../../../util/constants";
import { useAppHref } from "../../../util/hooks/useAppHref";
import { useToggle } from "../../../util/hooks/useToggle";
import {
  numberToStringWithSpaces,
  stripePriceToString,
} from "../../../util/strings";
import { LoadingButton } from "../../components/LoadingButton";
import { productService } from "../../services/productService";

type Props = {
  initialProductId: string;
  products: Product[];
};

export const ProductSettings: FC<Props> = ({ initialProductId, products }) => {
  const router = useRouter();
  const appHref = useAppHref();

  const [productId, setProductId] = useState(initialProductId);
  const [error, setError] = useState("");
  const submitting = useToggle(false);

  const isValid = useMemo(() => {
    return !!productId;
  }, [productId]);
  const isChanged = useMemo(
    () => productId !== initialProductId,
    [initialProductId, productId]
  );

  const handleOnChangeProduct = (event: SelectChangeEvent<string>) => {
    setProductId(event.target.value);
  };
  const handleCancel = () => {
    setProductId(initialProductId);
  };
  const handleSubmit = async () => {
    submitting.toggleOn();
    setError("");
    try {
      const priceId = products.find(({ id }) => id === productId)!.priceId;
      const sessionId = await productService.createSession(priceId);
      if (!sessionId) {
        throw new Error();
      }
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
        throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined.");
      }
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
      );
      await stripe?.redirectToCheckout({ sessionId });
    } catch {
      setError("Something went wrong.");
    } finally {
      submitting.toggleOff();
      router.replace(`${appHref}/settings`);
    }
  };

  return (
    <Card variant="outlined">
      <Alert severity="info" icon={<AttachMoneyIcon />}>
        Billing
      </Alert>
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        padding={2}
        paddingTop={4}
      >
        <FormControl fullWidth>
          <InputLabel id="productId-select-label">Select plan</InputLabel>
          <Select
            labelId="productId-select-label"
            id="demo-simple-select"
            value={productId}
            label="Select plan"
            onChange={handleOnChangeProduct}
          >
            {products.map(({ id, name, price }) => (
              <MenuItem key={id} value={id}>
                <Typography variant="body1">
                  {name} ({stripePriceToString(price)} US$/month)
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ul style={{ margin: 0 }}>
          <li>
            <Typography variant="body2" color="gray">
              The FREE plan allows{" "}
              {numberToStringWithSpaces(freeSubscriberLimit)} subscribers.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="gray">
              The PAID plan allows unlimited subscribers.
            </Typography>
          </li>
        </ul>
        {error && (
          <Typography variant="caption" color="red">
            {error}
          </Typography>
        )}
        <Box display="flex" gap={1} justifyContent="end">
          {isChanged && (
            <Button
              variant="text"
              size="medium"
              disabled={submitting.isOn}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <LoadingButton
            variant={isChanged && isValid ? "contained" : "outlined"}
            size="medium"
            disabled={!isChanged || !isValid}
            loading={submitting.isOn}
            onClick={handleSubmit}
          >
            Update
          </LoadingButton>
        </Box>
      </Box>
    </Card>
  );
};
