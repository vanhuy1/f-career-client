// app/home/page.tsx (hoặc tương đương trong Next.js App Router)
'use client';

import React, { useEffect, useState } from 'react';
import { BiCompass, BiUser, BiEnvelope, BiAt } from 'react-icons/bi';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import toast from 'react-hot-toast'
import { Button } from "./_components/ui-button"
import { Input } from "./_components/ui-input"
import { JoinMeetModal } from "./_components/join-meet-modal"
import { LanguageSwitch } from "./_components/language-switch"
import  useMeetContext  from "./contexts/MeetContext"
import { Loader2 } from 'lucide-react';
import * as Yup from 'yup';

type TFormValues = {
  userName: string;
  userEmail: string;
  meetName: string;
};

const formValidations = Yup.object().shape({
	userName: Yup.string()
	  .min(3, 'formValidations.userName.tooShort')
	  .max(50, 'formValidations.userName.tooLong')
	  .required('formValidations.userName.required'),
	userEmail: Yup.string()
		.email('formValidations.userEmail.invalid')
		.required('formValidations.userEmail.required'),
	meetName: Yup.string()
		.min(3, 'formValidations.meetName.tooShort')
		.max(50, 'formValidations.meetName.tooLong')
		.required('formValidations.meetName.required'),
});

const HomePage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { userStream, startNewMeet, clearUserStream } = useMeetContext();

  const [defaultMeetId, setDefaultMeetId] = useState('');
  const [isJoinMeetModalVisible, setIsJoinMeetModalVisible] = useState(false);

  const handleCreateMeet = (values: TFormValues) => {
    form.setSubmitting(true);
    const hadSuccess = startNewMeet(values.userName, values.userEmail, values.meetName);

    form.setSubmitting(false);
    if (!hadSuccess) return toast.error(t('toastMessage.errorWhileStartingMeet'));

    router.push('/video-call/meet');
  };

  const form = useFormik({
    initialValues: {
      userName: '',
      userEmail: '',
      meetName: ''
    },
    validationSchema: formValidations,
    onSubmit: (values) => {
      handleCreateMeet(values);
    }
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const meetId = searchParams.get('meetId');
    const stopStream = searchParams.get('stopStream');

    if (meetId) {
      setDefaultMeetId(meetId);
      setIsJoinMeetModalVisible(true);
    }

    if (stopStream) {
      userStream?.getTracks()?.forEach(track => track.stop());
      clearUserStream();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <Head>
        <title>Meet Compass</title>
      </Head>

      {/* Sidebar */}
      <aside className="hidden md:flex w-1/4 items-center justify-center bg-primary text-white">
        <BiCompass className="text-6xl" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <BiCompass className="text-4xl text-primary" />
          <h1 className="text-2xl font-bold">{t('page.home.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('page.home.subtitle')}</p>
        </div>

        <form onSubmit={form.handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <Input
              name="userName"
              placeholder={t('inputPlaceholder.userName')}
              value={form.values.userName}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
            />
            {form.errors.userName && form.touched.userName && (
              <p className="text-sm text-red-500 mt-1">{t(form.errors.userName)}</p>
            )}
          </div>

          <div>
            <Input
              name="userEmail"
              type="email"
              placeholder={t('inputPlaceholder.email')}
              value={form.values.userEmail}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
            />
            {form.errors.userEmail && form.touched.userEmail && (
              <p className="text-sm text-red-500 mt-1">{t(form.errors.userEmail)}</p>
            )}
          </div>

          <div>
            <Input
              name="meetName"
              placeholder={t('inputPlaceholder.meetName')}
              value={form.values.meetName}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
            />
            {form.errors.meetName && form.touched.meetName && (
              <p className="text-sm text-red-500 mt-1">{t(form.errors.meetName)}</p>
            )}
          </div>

          <Button type="submit"  testId="startMeetButton" disabled={!form.isValid || form.isSubmitting} className="w-full">
            {form.isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              t('page.home.button')
            )}
          </Button>
        </form>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="flex-1 h-px bg-border" />
          {t('page.home.or')}
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="text-sm">
          {t('page.home.joinMeet')}{' '}
          <button
            type="button"
            className="text-primary underline ml-1"
            onClick={() => setIsJoinMeetModalVisible(true)}
          >
            {t('page.home.joinMeetLink')}
          </button>
        </div>
      </main>

      <div className="absolute top-4 right-4">
          <LanguageSwitch 
          selectedLanguage="en" 
          changeSelectedLanguage={
            () =>{

            }
          }
        />
      </div>

      <JoinMeetModal
        visible={isJoinMeetModalVisible}
        defaultMeetId={defaultMeetId}
        onClose={() => setIsJoinMeetModalVisible(false)}
      />
    </div>
  );
};

export default HomePage;
