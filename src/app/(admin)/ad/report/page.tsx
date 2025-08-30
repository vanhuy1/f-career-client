'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flag, Filter, RefreshCw } from 'lucide-react';
import { reportService } from '@/services/api/report/report-api';
import { Report, ReportListParams, ReportStatus } from '@/types/Report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AdminReportsPage() {
    const [status, setStatus] = useState<ReportStatus | 'ALL'>('ALL');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [reports, setReports] = useState<Report[]>([]);
    const [count, setCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const params: ReportListParams = useMemo(() => {
        return {
            status: status === 'ALL' ? undefined : status,
            page,
            limit,
        };
    }, [status, page, limit]);

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await reportService.list(params);
            setReports(res.reports);
            setCount(res.total ?? 0);
            if (typeof res.page === 'number') setPage(res.page);
            if (typeof res.limit === 'number') setLimit(res.limit);
            if (typeof res.totalPages === 'number') setTotalPages(res.totalPages);
        } catch (err) {
            console.error('Failed to fetch reports:', err);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // totalPages is provided by backend; fallback if missing
    const computedTotalPages = totalPages || Math.max(1, Math.ceil(count / limit));

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Flag className="h-7 w-7" /> Reports
                    </h1>
                    <p className="text-gray-600">Review and manage job reports</p>
                </div>
                <Button variant="outline" onClick={fetchReports}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" /> Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Status</label>
                            <Select
                                value={status}
                                onValueChange={(value: ReportStatus | 'ALL') => {
                                    setStatus(value);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="DISMISSED">Dismissed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600">{error}</div>
                    ) : reports?.length === 0 ? (
                        <div className="text-center text-gray-500">No reports found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Job</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Reporter</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports?.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>
                                                <div className="font-medium">{r.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                {r.job?.title || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {r.job?.company?.name || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {r.user?.name || r.reportedBy?.name || '-'}
                                            </TableCell>
                                            <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</TableCell>
                                            <TableCell>
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/ad/report/${r.id}`}>View</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Page {page} of {computedTotalPages} • {count.toLocaleString()} total
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                            >
                                First
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.min(computedTotalPages, p + 1))}
                                disabled={page === computedTotalPages}
                            >
                                Next
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPage(computedTotalPages)}
                                disabled={page === computedTotalPages}
                            >
                                Last
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

