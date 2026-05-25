import React, { useEffect, useState, useCallback } from 'react';
import { Table, message } from 'antd';
import { fetchUsers, User, UserListResult } from '../api/users';

const Users: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const result: UserListResult = await fetchUsers({ page, pageSize });
      setData(result.data);
      setPagination(result.pagination);
    } catch {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTableChange = (pag: any) => {
    loadData(pag.current || 1, pag.pageSize || 20);
  };

  const columns = [
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 140 },
    { title: '总得分', dataIndex: 'total_score', key: 'total_score', width: 90 },
    {
      title: '答对/答错',
      key: 'correct_wrong',
      width: 120,
      render: (_: unknown, record: User) =>
        `${record.total_correct} / ${record.total_wrong}`,
    },
    {
      title: '最后登录',
      dataIndex: 'last_login_at',
      key: 'last_login_at',
      width: 180,
      render: (val: string) => (val ? new Date(val).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (val: string) => new Date(val).toLocaleString('zh-CN'),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      onChange={handleTableChange}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`,
      }}
    />
  );
};

export default Users;
