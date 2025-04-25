'use client';

import React, { useState } from 'react';
import Logo from '../_components/Logo';
import Navigation from '../_components/Navigation';
import { UserSignUpForm } from '../_components/UserSignUpForm';
import { HRSignUpForm } from '../_components/HrSignUpForm';

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<'jobseeker' | 'company'>(
    'jobseeker',
  );
  return (
    <div className="mx-auto w-full max-w-md">
      <Logo />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'jobseeker' ? <UserSignUpForm /> : <HRSignUpForm />}
    </div>
  );
}
