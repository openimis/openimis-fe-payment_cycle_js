import React from "react";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import { FormattedMessage } from "@openimis/fe-core";
import { LocalOffer } from "@material-ui/icons";
import {RIGHT_PAYMENT_CYCLE_SEARCH} from "./constants";
import PaymentCyclesPage from "./pages/PaymentCyclesPage";

const ROUTE_PAYMENT_CYCLES = "paymentCycles";
const ROUTE_PAYMENT_CYCLE = "paymentCycles/paymentCycle";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: 'paymentCycle', reducer }],
  "refs": [
    {key: "paymentCycle.route.paymentCycles", ref: ROUTE_PAYMENT_CYCLES},
    {key: "paymentCycle.route.paymentCycle", ref: ROUTE_PAYMENT_CYCLE}
  ],
  "core.Router": [
    {path: ROUTE_PAYMENT_CYCLES, component: PaymentCyclesPage},
    //{path: ROUTE_PAYMENT_CYCLE, component: PaymentCyclePage}
  ],
  "invoice.MainMenu": [
    {
      text: <FormattedMessage module="paymentCycle" id="paymentCycles.page.title" />,
      icon: <LocalOffer />,
      route: "/" + ROUTE_PAYMENT_CYCLES,
      //filter: rights => rights.includes(RIGHT_PAYMENT_CYCLE_SEARCH)
    }
  ]
}

export const PaymentCycleModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}