# openIMIS Frontend Payment Cycle module
This repository holds the files of the openIMIS Frontend Payment Cycle module.
It is dedicated to be bootstrap development of [openimis-fe_js](https://github.com/openimis/openimis-fe_js) modules, providing an empty (yet deployable) module.

Please refer to [openimis-fe_js](https://github.com/openimis/openimis-fe_js) to see how to build and deploy (in developement or server mode).

The module is built with [rollup](https://rollupjs.org/).
In development mode, you can use `npm link` and `npm start` to continuously scan for changes and automatically update your development server.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/openimis/openimis-fe-social_protection_js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/openimis/openimis-fe-social_protection_js/alerts/)

## Main Menu Contributions
* **Legal and Finance** (invoice.mainMenu translation key)

**Payment Cycles** (route: `/paymentCycles`) displayed if user has the right `200001`

## Other Contributions
* `core.Router`: registering `paymentCycles`, `paymentCycle`, routes in openIMIS client-side router

## Available Contribution Points
* `paymentCycle.TabPanel.label` ability to extend Bill tab panel with a tab label
* `paymentCycle.TabPanel.panel` ability to extend Bill tab panel with a panel displayed on click on an appropriate tab label

## Dispatched Redux Actions
* `PAYMENT_CYCLE_PAYMENT_CYCLES_{REQ|RESP|ERR}` fetching PaymentCycles (as triggered by the searcher)
* `PAYMENT_CYCLE_PAYMENT_CYCLE_{REQ|RESP|ERR|CLEAR}` fetching chosen PaymentCycle
* `PAYMENT_CYCLE_MUTATION_{REQ|ERR}`, sending a mutation
* `PAYMENT_CYCLE_GENERATE_PAYMENT_CYCLE`, mutation which generates payment cycle when user triggers the launcher using dedicated button
* `PAYMENT_CYCLE_PAYMENT_CYCLE_BILLS {REQ|RESP|ERR|CLEAR}`, fetching Bills for particular Payment Cycle (triggered when user enters the detailed page of payment cycle)

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)

## Configurations Options
None