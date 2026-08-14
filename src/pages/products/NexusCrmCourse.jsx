import React from 'react';
import DigitalProductLayout from './DigitalProductLayout.jsx';
import { logTelemetry } from '../../lib/telemetry.js';

export default function NexusCrmCourse() {
  const handlePrimaryAction = () => {
    logTelemetry('checkout_intent', { product: 'nexus_crm_course' });
    // Proceed to checkout logic...
  };

  return (
    <DigitalProductLayout
      title="Nexus CRM Certification Course"
      description="Master B2B pipeline architecture, automated lead routing, and revenue tracking. Become a certified AXiM Operator."
      price="$149.00"
      type="Interactive Certification"
      coverGradient="from-axim-purple to-indigo-900"
      curriculum={[
        "Module 1: Pipeline Fundamentals",
        "Module 2: Routing Automation",
        "Module 3: Analytics & Reporting",
        "Module 4: Certification Exam"
      ]}
      onPrimaryAction={handlePrimaryAction}
    />
  );
}
