'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { forwardRef } from 'react';

const ContactCaptcha = forwardRef<HCaptcha, React.ComponentProps<typeof HCaptcha>>(
  function ContactCaptcha(props, ref) {
    return <HCaptcha ref={ref} {...props} />;
  },
);

export default ContactCaptcha;
