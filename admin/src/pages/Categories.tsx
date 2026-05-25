import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from '../api/categories';

const Categories: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Category | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCategories();
      setData(result.data);
    } catch {
      message.error('加载学科列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Category) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      icon: record.icon,
      sortOrder: record.sort_order,
      description: record.description,
    });
    setModalOpen(true);
  };

  const handleDelete = (record: Category) => {
    Modal.confirm({
      title: `确认删除学科「${record.name}」？`,
      content: record.description || '删除后不可恢复',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCategory(record.id);
          message.success('删除成功');
          loadData();
        } catch (error: any) {
          message.error(error?.response?.data?.error || '删除失败');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      if (editingRecord) {
        await updateCategory(editingRecord.id, values);
        message.success('更新成功');
      } else {
        await createCategory(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      loadData();
    } catch (error: any) {
      if (error?.response?.data?.error) {
        message.error(error.response.data.error);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => icon || '-',
    },
    {
      title: '排序值',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 80,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: unknown, record: Category) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增学科
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
      <Modal
        title={editingRecord ? '编辑学科' : '新增学科'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: '', icon: '', sortOrder: 0, description: '' }}
        >
          <Form.Item
            name="name"
            label="学科名称"
            rules={[{ required: true, message: '请输入学科名称' }]}
          >
            <Input placeholder="例如：科学" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="例如：🔬" />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序值">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="学科描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
