import { baseApiUrl } from '@openimis/fe-core';

export default function downloadDuplicatedPayments(paymenCycleId) {
  const url = new URL(
    `${window.location.origin}${baseApiUrl}/payment_cycle/duplicated_payments/`,
  );
  url.searchParams.append('payment_cycle_id', paymenCycleId);

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'duplicated_payments.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Export failed, reason: ', error);
    });
}
