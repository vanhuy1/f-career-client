// app/home/page.tsx (hoặc tương đương trong Next.js App Router)
'use client';

import React, { useEffect, useState } from 'react';
import { BiCompass } from 'react-icons/bi';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { Button } from './_components/ui-button';
import { Input } from './_components/ui-input';
import { JoinMeetModal } from './_components/join-meet-modal';
import useMeetContext from './contexts/MeetContext';
import { Loader2 } from 'lucide-react';
import * as Yup from 'yup';
import { videoCallText } from './utils/text';

type TFormValues = {
  userName: string;
  userEmail: string;
  meetName: string;
};

const formValidations = Yup.object().shape({
  userName: Yup.string()
    .min(3, videoCallText.formValidations.userName.tooShort)
    .max(50, videoCallText.formValidations.userName.tooLong)
    .required(videoCallText.formValidations.userName.required),
  userEmail: Yup.string()
    .email(videoCallText.formValidations.userEmail.invalid)
    .required(videoCallText.formValidations.userEmail.required),
  meetName: Yup.string()
    .min(3, videoCallText.formValidations.meetName.tooShort)
    .max(50, videoCallText.formValidations.meetName.tooLong)
    .required(videoCallText.formValidations.meetName.required),
});

const HomePage = () => {
  const router = useRouter();
  const { userStream, startNewMeet, clearUserStream } = useMeetContext();

  const [defaultMeetId, setDefaultMeetId] = useState('');
  const [isJoinMeetModalVisible, setIsJoinMeetModalVisible] = useState(false);

  const handleCreateMeet = (values: TFormValues) => {
    form.setSubmitting(true);
    const hadSuccess = startNewMeet(
      values.userName,
      values.userEmail,
      values.meetName,
    );

    form.setSubmitting(false);
    if (!hadSuccess)
      return toast.error(videoCallText.toastMessage.errorWhileStartingMeet);

    router.push('/video-call/meet');
  };

  const form = useFormik({
    initialValues: {
      userName: '',
      userEmail: '',
      meetName: '',
    },
    validationSchema: formValidations,
    onSubmit: (values) => {
      handleCreateMeet(values);
    },
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
      userStream?.getTracks()?.forEach((track) => track.stop());
      clearUserStream();
    }
  }, [userStream, clearUserStream]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col md:flex-row">
      <Head>
        <title>Meet Compass</title>
      </Head>

      {/* Sidebar */}
      <aside className="bg-primary hidden w-1/4 items-center justify-center text-white md:flex">
        <BiCompass className="text-6xl" />
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center space-y-6 px-6 py-10">
        <div className="flex flex-col items-center space-y-2 text-center">
          <BiCompass className="text-primary text-4xl" />
          <h1 className="text-2xl font-bold">
            {videoCallText.page.home.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {videoCallText.page.home.subtitle}
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit}
          className="w-full max-w-md space-y-4"
        >
          <div>
            <Input
              name="userName"
              placeholder={videoCallText.inputPlaceholder.userName}
              value={form.values.userName}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
            />
            {form.errors.userName && form.touched.userName && (
              <p className="mt-1 text-sm text-red-500">
                {form.errors.userName}
              </p>
            )}
          </div>

          <div>
            <Input
              name="userEmail"
              type="email"
              placeholder={videoCallText.inputPlaceholder.email}
              value={form.values.userEmail}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
            />
            {form.errors.userEmail && form.touched.userEmail && (
              <p className="mt-1 text-sm text-red-500">
                {form.errors.userEmail}
              </p>
            )}
          </div>

          <div>
            <Input
              name="meetName"
              placeholder={videoCallText.inputPlaceholder.meetName}
              value={form.values.meetName}
              onBlur={form.handleBlur}
              onChange={form.handleChange}
            />
            {form.errors.meetName && form.touched.meetName && (
              <p className="mt-1 text-sm text-red-500">
                {form.errors.meetName}
              </p>
            )}
          </div>

          <Button
            type="submit"
            testId="startMeetButton"
            disabled={!form.isValid || form.isSubmitting}
            className="w-full"
          >
            {form.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              videoCallText.page.home.button
            )}
          </Button>
        </form>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <div className="bg-border h-px flex-1" />
          {videoCallText.page.home.or}
          <div className="bg-border h-px flex-1" />
        </div>

        <div className="text-sm">
          {videoCallText.page.home.joinMeet}
          <button
            type="button"
            className="text-primary ml-1 underline"
            onClick={() => setIsJoinMeetModalVisible(true)}
          >
            {videoCallText.page.home.joinMeetLink}
          </button>
        </div>
      </main>

      <JoinMeetModal
        visible={isJoinMeetModalVisible}
        defaultMeetId={defaultMeetId}
        onClose={() => setIsJoinMeetModalVisible(false)}
      />
    </div>
  );
};

export default HomePage;
