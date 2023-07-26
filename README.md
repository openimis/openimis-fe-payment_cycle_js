# openIMIS Frontend Social Protection module
This repository holds the files of the openIMIS Frontend Payment Cycle module.
It is dedicated to be bootstrap development of [openimis-fe_js](https://github.com/openimis/openimis-fe_js) modules, providing an empty (yet deployable) module.

Please refer to [openimis-fe_js](https://github.com/openimis/openimis-fe_js) to see how to build and deploy (in developement or server mode).

The module is built with [rollup](https://rollupjs.org/).
In development mode, you can use `npm link` and `npm start` to continuously scan for changes and automatically update your development server.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/openimis/openimis-fe-social_protection_js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/openimis/openimis-fe-social_protection_js/alerts/)

## Main Menu Contributions
Under Payments menu **Payment Cycls** (paymentCycle.paymentCycles.page.title) if user has the right `200001`

## Other Contributions
* `core.Router`: registering `paymentCycles`, `paymentCycle`, routes in openIMIS client-side router

## Available Contribution Points

## Dispatched Redux Actions
* `PAYMENT_CYCLE_PAYMENT_CYCLES_{REQ|RESP|ERR}` fetching PaymentCycles (as triggered by the searcher)
* `PAYMENT_CYCLE_PAYMENT_CYCLE_{REQ|RESP|ERR}` fetching chosen PaymentCycle
* `PAYMENT_CYCLE_MUTATION_{REQ|ERR}`, sending a mutation

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)

## Configurations Options
None
