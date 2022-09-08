import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useMemo, useState } from "react";

import { Product } from "../../../prisma/modules/stripe";
import { freeSubscriberLimit } from "../../../util/constants";
import { useAppHref } from "../../../util/hooks/useAppHref";
import { useToggle } from "../../../util/hooks/useToggle";
import {
  numberToStringWithSpaces,
  stripePriceToString,
} from "../../../util/strings";
import { useThemeContext } from "../../contexts/theme";
import { productService } from "../../services/productService";

type Props = {
  initialProductId: string;
  products: Product[];
};

export const ProductSettings: FC<Props> = ({ initialProductId, products }) => {
  const router = useRouter();
  const appHref = useAppHref();
  const { theme } = useThemeContext();

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

  const handleOnChangeProduct = (event: ChangeEvent<HTMLInputElement>) => {
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
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
      );
      await stripe.redirectToCheckout({ sessionId });
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
              The free and paid plan both give full access to all features.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="gray">
              The free plan only allows up to{" "}
              {numberToStringWithSpaces(freeSubscriberLimit)} subscribers.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="gray">
              The paid plan allows unlimited subscribers.
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
              color="secondary"
              disabled={submitting.isOn}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <LoadingButton
            variant={isChanged && isValid ? "contained" : "outlined"}
            size="medium"
            color="secondary"
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
