'use client';

import { ReactFlowProvider } from 'reactflow';

export default function ReactFlowWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
