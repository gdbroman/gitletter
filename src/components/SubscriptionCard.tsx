import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { FC, ReactNode } from "react";

type SubscriptionCardProps = {
  title: string;
  price: string;
  features: string[];
  button: ReactNode;
  fullWidth?: boolean;
};

export const SubscriptionCard: FC<SubscriptionCardProps> = ({
  title,
  price,
  features,
  button,
  fullWidth,
}) => (
  <Card style={{ width: fullWidth ? "100%" : "auto", maxWidth: "480px" }}>
    <Box px={4} py={3} textAlign="center">
      <Typography variant="h5" fontWeight="medium">
        {title}
      </Typography>
      <Typography variant="h3" fontWeight="medium" my={3}>
        {price}
      </Typography>
      <Divider />
      {features.map((feature, index) => (
        <Typography
          variant={index === 1 ? "body2" : "body1"}
          key={index}
          my={2}
          fontStyle={index === 1 ? "italic" : "normal"}
        >
          {feature}
        </Typography>
      ))}
      <Box mt={4}>{button}</Box>
    </Box>
  </Card>
);
