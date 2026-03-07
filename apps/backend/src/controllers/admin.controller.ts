import { Request, Response } from 'express';
import { prisma } from '../app';
import { AuthRequest } from '../middlewares/auth.middleware';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        profiles: true,
        subscriptions: { where: { isActive: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, phone, role }
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, phone, role, isVerified } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { email, phone, role, isVerified }
    });
    res.status(200).json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// Team Management
export const getTeam = async (req: AuthRequest, res: Response) => {
  try {
    const team = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUB_ADMIN'] } },
      select: { id: true, email: true, role: true, vertical: true, createdAt: true }
    });
    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team' });
  }
};

export const createTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role, vertical } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const member = await prisma.user.create({
      data: { email, password: hashedPassword, role, vertical }
    });
    res.status(201).json({ message: 'Team member created', member });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create member' });
  }
};

export const updateTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, vertical } = req.body;
    const member = await prisma.user.update({
      where: { id },
      data: { role, vertical }
    });
    res.status(200).json({ member });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Remove failed' });
  }
};

// Tasks
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: req.user?.role === 'SUB_ADMIN' ? { assignedToId: req.user.id } : {},
      include: { assignedTo: { select: { email: true } }, createdBy: { select: { email: true } } }
    });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedToId, vertical, priority, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        createdById: req.user!.id,
        vertical,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: { status }
    });
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const getVerificationRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.profile.findMany({
      where: { status: 'PENDING' },
      include: {
        documents: true,
        photos: true,
        user: { select: { email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ requests });
  } catch (error) {
    console.error('Get verification requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, riskScore } = req.body;

    const profile = await prisma.profile.update({
      where: { id },
      data: {
        status,
        riskScore: riskScore || undefined
      }
    });

    res.status(200).json({ message: `Profile ${status} successfully`, profile });
  } catch (error) {
    console.error('Verify profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({ where: { isVerified: true } });
    const pendingProfiles = await prisma.profile.count({ where: { status: 'PENDING' } });
    const activeSubscriptions = await prisma.subscription.count({ where: { isActive: true } });

    res.status(200).json({
      stats: {
        totalUsers,
        verifiedUsers,
        pendingProfiles,
        activeSubscriptions
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
