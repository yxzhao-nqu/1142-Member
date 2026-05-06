import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { MemberService } from '../db/service';

export class MemberController {
  // 新增會員
  static async create(req: Request, res: Response) {
    try {
      const { name, password, phone, age, address } = req.body;

      // 驗證必需字段
      if (!name || !password || !phone) {
        return res.status(400).json({ error: 'Name, password, and phone are required' });
      }

      // 檢查會員名稱是否已存在
      const existingMember = await MemberService.getMemberByName(name);
      if (existingMember) {
        return res.status(409).json({ error: 'Member name already exists' });
      }

      // 密碼加密
      const hashedPassword = await bcryptjs.hash(password, 10);

      // 創建會員
      const member = await MemberService.createMember(name, hashedPassword, phone, age, address);

      res.status(201).json({
        message: 'Member created successfully',
        member: {
          id: member.id,
          name: member.name,
          phone: member.phone,
          age: member.age,
          address: member.address
        }
      });
    } catch (error) {
      console.error('Create member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 獲取所有會員
  static async getAll(req: Request, res: Response) {
    try {
      const members = await MemberService.getAllMembers();
      
      // 隱藏密碼字段
      const safeMembers = members.map(m => ({
        id: m.id,
        name: m.name,
        phone: m.phone,
        age: m.age,
        address: m.address,
        created_at: m.created_at,
        updated_at: m.updated_at
      }));

      res.json(safeMembers);
    } catch (error) {
      console.error('Get all members error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 獲取單個會員
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const member = await MemberService.getMemberById(Number(id));

      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      res.json({
        id: member.id,
        name: member.name,
        phone: member.phone,
        age: member.age,
        address: member.address,
        created_at: member.created_at,
        updated_at: member.updated_at
      });
    } catch (error) {
      console.error('Get member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 更新會員
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, phone, age, address } = req.body;

      // 驗證必需字段
      if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
      }

      // 檢查會員是否存在
      const member = await MemberService.getMemberById(Number(id));
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      // 如果名稱變更，檢查新名稱是否已存在
      if (name !== member.name) {
        const existingMember = await MemberService.getMemberByName(name);
        if (existingMember) {
          return res.status(409).json({ error: 'Member name already exists' });
        }
      }

      // 更新會員
      const updatedMember = await MemberService.updateMember(Number(id), name, phone, age, address);

      if (!updatedMember) {
        return res.status(500).json({ error: 'Failed to update member' });
      }

      res.json({
        message: 'Member updated successfully',
        member: {
          id: updatedMember.id,
          name: updatedMember.name,
          phone: updatedMember.phone,
          age: updatedMember.age,
          address: updatedMember.address
        }
      });
    } catch (error) {
      console.error('Update member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 刪除會員
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 檢查會員是否存在
      const member = await MemberService.getMemberById(Number(id));
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      // 刪除會員
      const success = await MemberService.deleteMember(Number(id));

      if (!success) {
        return res.status(500).json({ error: 'Failed to delete member' });
      }

      res.json({ message: 'Member deleted successfully' });
    } catch (error) {
      console.error('Delete member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
