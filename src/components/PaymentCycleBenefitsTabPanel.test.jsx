/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { makeStore, renderWithProviders, screen } from '@openimis/fe-core/testing';
import { PAYMENT_CYCLE_BENEFITS_TAB_VALUE } from '../constants';
import { PaymentCycleBenefitsTabPanel } from './PaymentCycleBenefitsTabPanel';

// A modules manager with fe-core's refs (and the payroll searcher) only:
// PolicyHolderModule is not installed, so policyHolder.TabPanel is not registered.
const { refs } = vi.hoisted(() => ({ refs: {} }));

vi.mock('@openimis/fe-core', async () => {
  const ReactActual = (await import('react')).default;
  refs['core.TabPanel'] = ({ value, index, children }) => (
    value === index ? ReactActual.createElement('div', { 'data-testid': 'core-tab-panel' }, children) : null
  );
  refs['payroll.benefitConsumptionPayrollSearcher'] = ({ paymentCycleUuid }) => (
    ReactActual.createElement('div', { 'data-testid': 'benefits-searcher' }, paymentCycleUuid)
  );
  return {
    useTranslations: () => ({ formatMessage: (id) => id }),
    PublishedComponent: ({ pubRef, ...props }) => {
      const Component = refs[pubRef];
      return Component ? ReactActual.createElement(Component, props) : null;
    },
  };
});

const store = () => makeStore({ preloadedState: { core: { user: { i_user: { rights: [] } } } } });

describe('PaymentCycleBenefitsTabPanel', () => {
  it('renders its content through core.TabPanel without PolicyHolderModule', () => {
    renderWithProviders(
      <PaymentCycleBenefitsTabPanel value={PAYMENT_CYCLE_BENEFITS_TAB_VALUE} paymentCycleUuid="pc-1" />,
      { store: store() },
    );

    expect(screen.getByTestId('benefits-searcher')).toHaveTextContent('pc-1');
  });
});
