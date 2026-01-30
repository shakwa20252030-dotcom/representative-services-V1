import { Router } from 'express';
import { dbQueries } from '../db';
import { CreateRequestSchema, UpdateRequestSchema } from '../../shared/schema';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    let { data, error, count } = await dbQueries.requests.list(
      req.user.id,
      limit,
      offset
    );

    if (req.user.role !== 'citizen') {
      const filters: Record<string, any> = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.priority) filters.priority = req.query.priority;
      if (req.query.category_id) filters.category_id = req.query.category_id;

      const allRequests = await dbQueries.requests.listAll(limit, offset, filters);
      data = allRequests.data;
      count = allRequests.count;
    }

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      data: {
        items: data,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch requests' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: request, error } = await dbQueries.requests.findById(req.params.id);

    if (error || !request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (
      req.user.role === 'citizen' &&
      request.user_id !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: history } = await dbQueries.history.list(request.id);

    res.json({
      success: true,
      data: {
        ...request,
        history,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch request' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user || req.user.role !== 'citizen') {
      return res.status(403).json({ error: 'Only citizens can create requests' });
    }

    const validatedData = CreateRequestSchema.parse(req.body);

    const { data: request, error } = await dbQueries.requests.create({
      user_id: req.user.id,
      ...validatedData,
      status: 'pending',
    });

    if (error || !request) {
      return res.status(400).json({ error: 'Failed to create request' });
    }

    await dbQueries.history.create({
      request_id: request.id,
      status: 'pending',
      changed_by: req.user.id,
      notes: 'طلب تم إنشاؤه',
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create request' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: request, error: fetchError } = await dbQueries.requests.findById(
      req.params.id
    );

    if (fetchError || !request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (req.user.role === 'citizen' && request.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'citizen' && req.body.status) {
      return res.status(403).json({ error: 'Citizens cannot change request status' });
    }

    const validatedData = UpdateRequestSchema.parse(req.body);
    const oldStatus = request.status;

    const { data: updatedRequest, error } = await dbQueries.requests.update(
      req.params.id,
      {
        ...validatedData,
        updated_at: new Date().toISOString(),
      }
    );

    if (error || !updatedRequest) {
      return res.status(400).json({ error: 'Failed to update request' });
    }

    if (validatedData.status && validatedData.status !== oldStatus) {
      await dbQueries.history.create({
        request_id: request.id,
        status: validatedData.status,
        changed_by: req.user.id,
        notes: validatedData.resolution_notes || `تم تغيير الحالة إلى ${validatedData.status}`,
      });
    }

    res.json({
      success: true,
      data: updatedRequest,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update request' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: request, error: fetchError } = await dbQueries.requests.findById(
      req.params.id
    );

    if (fetchError || !request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (req.user.role === 'citizen' && request.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role === 'citizen' && request.status !== 'pending') {
      return res.status(403).json({ error: 'Can only delete pending requests' });
    }

    const { error } = await dbQueries.requests.delete(req.params.id);

    if (error) {
      return res.status(400).json({ error: 'Failed to delete request' });
    }

    res.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete request' });
  }
});

router.get('/:id/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: request, error: fetchError } = await dbQueries.requests.findById(
      req.params.id
    );

    if (fetchError || !request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (
      req.user.role === 'citizen' &&
      request.user_id !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: history, error } = await dbQueries.history.list(req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch history' });
  }
});

export default router;
