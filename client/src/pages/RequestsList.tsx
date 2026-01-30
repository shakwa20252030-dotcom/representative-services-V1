import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { requestService } from '../services/api';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Badge } from '@/components/badge';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const RequestsList: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadRequests();
  }, [page, filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.list(20, (page - 1) * 20);
      setRequests(response.data.items);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'قيد الانتظار',
      in_progress: 'قيد المعالجة',
      resolved: 'تم الحل',
      rejected: 'مرفوض',
      closed: 'مغلق',
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 text-red-700';
      case 'high':
        return 'bg-orange-500/10 text-orange-700';
      case 'normal':
        return 'bg-blue-500/10 text-blue-700';
      default:
        return 'bg-slate-500/10 text-slate-700';
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">يجب تسجيل الدخول أولاً</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">طلباتي</h1>
        <div className="flex gap-4">
          <Input
            placeholder="ابحث عن طلب..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="flex-1"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">لا توجد طلبات حالياً</p>
            <Button>إنشاء طلب جديد</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {request.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      رقم الطلب: <span className="font-mono text-slate-900">{request.request_code}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className="font-medium text-slate-900">
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 mb-4 line-clamp-2">
                  {request.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge variant="outline">
                    {new Date(request.created_at).toLocaleDateString('ar-EG')}
                  </Badge>
                  {request.attachment_count > 0 && (
                    <Badge variant="outline">
                      {request.attachment_count} مرفق
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center gap-2">
        <Button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          variant="outline"
        >
          السابق
        </Button>
        <span className="px-4 py-2 text-slate-600">الصفحة {page}</span>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={requests.length < 20}
          variant="outline"
        >
          التالي
        </Button>
      </div>
    </div>
  );
};

export default RequestsList;
