import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Select,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  fetchLevelsByCategory,
  createLevel,
  updateLevel,
  deleteLevel,
  Level,
} from '../api/levels';
import { fetchCategories, Category } from '../api/categories';

const Levels: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [data, setData] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Level | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const loadCategories = useCallback(async () => {
    try {
      const result = await fetchCategories();
      setCategories(result.data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadLevels = useCallback(async (categoryId: string) => {
    setLoading(true);
    try {
      const result = await fetchLevelsByCategory(categoryId);
      setData(result.data);
    } catch {
      message.error('加载关卡列表失败');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    if (value) {
      loadLevels(value);
    } else {
      setData([]);
    }
  };

  const handleAdd = () => {
    if (!selectedCategoryId) {
      message.warning('请先选择学科');
      return;
    }
    setEditingRecord(null);
    form.resetFields();
    form.setFieldValue('categoryId', selectedCategoryId);
    setModalOpen(true);
  };

  const handleEdit = (record: Level) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      levelNumber: record.level_number,
      passThreshold: record.pass_threshold,
      description: record.description,
    });
    setModalOpen(true);
  };

  const handleDelete = (record: Level) => {
    Modal.confirm({
      title: `确认删除关卡「${record.name}」？`,
      content: '删除后不可恢复',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteLevel(record.id);
          message.success('删除成功');
          if (selectedCategoryId) loadLevels(selectedCategoryId);
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
        await updateLevel(editingRecord.id, {
          name: values.name,
          levelNumber: values.levelNumber,
          passThreshold: values.passThreshold,
          description: values.description,
        });
        message.success('更新成功');
      } else {
        await createLevel({
          categoryId: selectedCategoryId!,
          name: values.name,
          levelNumber: values.levelNumber,
          passThreshold: values.passThreshold,
          description: values.description,
        });
        message.success('创建成功');
      }
      setModalOpen(false);
      if (selectedCategoryId) loadLevels(selectedCategoryId);
    } catch (error: any) {
      if (error?.response?.data?.error) {
        message.error(error.response.data.error);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    { title: '关卡号', dataIndex: 'level_number', key: 'level_number', width: 80 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '通过门槛',
      dataIndex: 'pass_threshold',
      key: 'pass_threshold',
      width: 100,
      render: (val: number) => `答对 ${val} 题`,
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
      render: (_: unknown, record: Level) => (
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
        <Space>
          <Select
            allowClear
            placeholder="选择学科"
            style={{ width: 200 }}
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            options={categories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={!selectedCategoryId}
          >
            新增关卡
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
      <Modal
        title={editingRecord ? '编辑关卡' : '新增关卡'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            levelNumber: undefined,
            passThreshold: 4,
            description: '',
          }}
        >
          <Form.Item
            name="name"
            label="关卡名称"
            rules={[{ required: true, message: '请输入关卡名称' }]}
          >
            <Input placeholder="例如：科学入门" />
          </Form.Item>
          <Form.Item name="levelNumber" label="关卡编号">
            <InputNumber min={1} style={{ width: '100%' }} placeholder="自动分配" />
          </Form.Item>
          <Form.Item name="passThreshold" label="通过门槛（答对题数）">
            <InputNumber min={1} max={6} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="关卡描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Levels;
