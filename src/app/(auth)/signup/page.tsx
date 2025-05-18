'use client';

import React, { useState } from 'react';
import Logo from '../_components/Logo';
import Navigation from '../_components/Navigation';
import { UserSignUpForm } from '../_components/UserSignUpForm';

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<'jobseeker' | 'company'>(
    'jobseeker',
  );
  return (
    <div className="mx-auto w-full max-w-md">
      <Logo />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <UserSignUpForm isCompany={activeTab === 'company'} />
    </div>
  );
}
