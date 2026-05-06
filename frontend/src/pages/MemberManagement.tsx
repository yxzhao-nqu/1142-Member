import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, memberService } from '../services/api';
import '../styles/MemberManagement.css';

interface Member {
  id: number;
  name: string;
  phone: string;
  age?: number;
  address?: string;
}

export const MemberManagement = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    phone: '',
    age: '',
    address: '',
  });

  // 獲取會員列表
  const fetchMembers = async () => {
    try {
      const response = await memberService.getAll();
      setMembers(response.data);
      setError('');
    } catch {
      setError('無法獲取會員列表');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 登出
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch {
      alert('登出失敗');
    }
  };

  // 新增/修改會員
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // 修改會員
        await memberService.update(editingId, {
          name: formData.name,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : undefined,
          address: formData.address,
        });
      } else {
        // 新增會員
        await memberService.create({
          name: formData.name,
          password: formData.password,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : undefined,
          address: formData.address,
        });
      }

      // 重置表單
      setFormData({
        name: '',
        password: '',
        phone: '',
        age: '',
        address: '',
      });
      setEditingId(null);
      setShowForm(false);

      // 重新獲取列表
      fetchMembers();
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失敗');
    }
  };

  // 編輯會員
  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      password: '',
      phone: member.phone,
      age: member.age?.toString() || '',
      address: member.address || '',
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  // 刪除會員
  const handleDelete = async (id: number) => {
    if (!window.confirm('確定要刪除此會員嗎？')) return;

    try {
      await memberService.delete(id);
      fetchMembers();
    } catch {
      setError('刪除失敗');
    }
  };

  // 取消操作
  const handleCancel = () => {
    setFormData({
      name: '',
      password: '',
      phone: '',
      age: '',
      address: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="management-container">
      <header className="management-header">
        <h1>會員管理平台</h1>
        <button onClick={handleLogout} className="logout-btn">
          登出
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="management-content">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="add-member-btn"
          >
            + 新增會員
          </button>
        )}

        {showForm && (
          <div className="form-container">
            <h2>{editingId ? '修改會員' : '新增會員'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">帳號 *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="請輸入帳號"
                  required
                  disabled={editingId !== null}
                />
              </div>

              {!editingId && (
                <div className="form-group">
                  <label htmlFor="password">密碼 *</label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="請輸入密碼"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="phone">電話 *</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="請輸入電話"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">年齡</label>
                <input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="請輸入年齡"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">地址</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="請輸入地址"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? '更新' : '新增'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="members-list">
          <h2>會員列表</h2>
          {loading ? (
            <p>加載中...</p>
          ) : members.length === 0 ? (
            <p>暫無會員資料</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>帳號</th>
                  <th>電話</th>
                  <th>年齡</th>
                  <th>地址</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.name}</td>
                    <td>{member.phone}</td>
                    <td>{member.age || '-'}</td>
                    <td>{member.address || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(member)}
                        className="edit-btn"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="delete-btn"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
