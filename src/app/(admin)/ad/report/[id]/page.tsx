'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { reportService } from '@/services/api/report/report-api';
import { Report, ReportStatus } from '@/types/Report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<ReportStatus>('PENDING');
    const [adminNote, setAdminNote] = useState('');
    const [updating, setUpdating] = useState(false);
    const [hideReason, setHideReason] = useState('');
    const [hiding, setHiding] = useState(false);

    const fetchReport = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const res = await reportService.findOne(id);
            setReport(res);
            setNewStatus((res.status as ReportStatus) ?? 'PENDING');
        } catch (err) {
            console.error('Failed to fetch report detail:', err);
            setError('Failed to load report detail');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    if (loading) {
        return (
            <div className="p-6">
                <Skeleton className="mb-4 h-8 w-64" />
                <Skeleton className="mb-2 h-6 w-96" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="pt-6 text-center text-red-600">
                        {error || 'Report not found'}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
                    <p className="text-gray-600">
                        Reported by {report.user?.name || 'Unknown'} • {report.createdAt ? new Date(report.createdAt).toLocaleString() : '-'}
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap text-gray-800">{report.description}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Job</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div className="text-sm text-gray-500">Title</div>
                            <div className="font-medium">{report.job?.title || '-'}</div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="text-sm text-gray-500">Company</div>
                            <div className="font-medium">{report.job?.company?.name || '-'}</div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="text-sm text-gray-500">Location</div>
                            <div className="font-medium">{report.job?.location || '-'}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reporter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="font-medium">{report.user?.name || '-'}</div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="text-sm text-gray-500">Email</div>
                            <div className="font-medium">{report.user?.email || '-'}</div>
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="text-sm text-gray-500">Status</div>
                            <div className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                {report.status}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">New Status</label>
                            <Select value={newStatus} onValueChange={(v: ReportStatus) => setNewStatus(v)}>
                                <SelectTrigger className="w-64">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="DISMISSED">Dismissed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Admin Note (optional)</label>
                            <Textarea
                                rows={4}
                                placeholder="Add context for this status update..."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                            />
                        </div>
                        <div>
                            <Button
                                disabled={updating}
                                onClick={async () => {
                                    if (!report?.id) return;
                                    try {
                                        setUpdating(true);
                                        const updated = await reportService.updateStatus(report.id, {
                                            status: newStatus,
                                            adminNote: adminNote.trim() || undefined,
                                        });
                                        setReport(updated);
                                        toast.success('Status updated');
                                    } catch (err) {
                                        console.error('Failed to update status:', err);
                                        toast.error('Failed to update status');
                                    } finally {
                                        setUpdating(false);
                                    }
                                }}
                            >
                                {updating ? 'Updating...' : 'Update Status'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Hide Job</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Reason</label>
                            <Textarea
                                rows={4}
                                placeholder="Why are you hiding this job?"
                                value={hideReason}
                                onChange={(e) => setHideReason(e.target.value)}
                            />
                        </div>
                        <div>
                            <Button
                                disabled={hiding || !report.job?.id || !hideReason.trim()}
                                onClick={async () => {
                                    if (!report.job?.id) return;
                                    try {
                                        setHiding(true);
                                        const res = await reportService.hideJob({
                                            jobId: report.job.id,
                                            reason: hideReason.trim(),
                                        });
                                        toast.success(res.message || 'Job hidden');
                                        setHideReason('');
                                    } catch (err) {
                                        console.error('Failed to hide job:', err);
                                        toast.error('Failed to hide job');
                                    } finally {
                                        setHiding(false);
                                    }
                                }}
                            >
                                {hiding ? 'Hiding...' : 'Hide Job'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

