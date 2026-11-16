import { useState } from 'react';
import { Callout } from './Shared';
import LeadModal from './LeadModal';

// Closing CTA on service pages — opens the lead-capture modal so every
// service gets its own enquiry workflow feeding the central Leads sheet.
export default function ServiceCallout({ service, title, lead, type = 'quote_request', ctaLabel = 'Request a quote' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Callout
        title={title}
        lead={lead}
        cta={{ onClick: () => setOpen(true), label: ctaLabel }}
      />
      <LeadModal
        open={open}
        onClose={() => setOpen(false)}
        service={service}
        type={type}
        title={`${ctaLabel} — ${service}`}
      />
    </>
  );
}
