import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Form,
  Select,
  Modal,
  message,
  Typography,
  Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  fetchQuestions,
  deleteQuestion,
  Question,
  QuestionListParams,
  Pagination,
} from '../api/questions';
import { fetchCategories, Category } from '../api/categories';
import { fetchLevelsByCategory, Level } from '../api/levels';

const { Text } = Typography;

const difficultyConfig: Record<string, { color: string; label: string }> = {
  easy: { color: 'success', label: '简单' },
  medium: { color: 'warning', label: '中等' },
  hard: { color: 'error', label: '困难' },
};

const QuestionsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filterForm] = Form.useForm();

  const loadData = useCallback(async (params: QuestionListParams = {}) => {
    setLoading(true);
    try {
      const result = await fetchQuestions({
        page: params.page || pagination.page,
        pageSize: params.pageSize || pagination.pageSize,
        categoryId: params.categoryId,
        levelId: params.levelId,
      });
      setData(result.data);
      setPagination(result.pagination);
    } catch {
      message.error('加载题目列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  const loadCategories = useCallback(async () => {
    try {
      const result = await fetchCategories();
      setCategories(result.data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  const handleCategoryChange = async (categoryId: string | undefined) => {
    filterForm.setFieldValue('levelId', undefined);
    if (categoryId) {
      try {
        const result = await fetchLevelsByCategory(categoryId);
        setLevels(result.data);
      } catch {
        setLevels([]);
      }
    } else {
      setLevels([]);
    }
  };

  const handleSearch = () => {
    const values = filterForm.getFieldsValue();
    loadData({
      page: 1,
      pageSize: pagination.pageSize,
      categoryId: values.categoryId,
      levelId: values.levelId,
    });
  };

  const handleReset = () => {
    filterForm.resetFields();
    setLevels([]);
    loadData({ page: 1, pageSize: pagination.pageSize });
  };

  const handleDelete = (record: Question) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除题目「${record.question.slice(0, 30)}${record.question.length > 30 ? '...' : ''}」吗？`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteQuestion(record.id);
          message.success('删除成功');
          loadData();
        } catch (error: any) {
          message.error(error?.response?.data?.error || '删除失败');
        }
      },
    });
  };

  const handleTableChange = (pag: any) => {
    const values = filterForm.getFieldsValue();
    loadData({
      page: pag.current || 1,
      pageSize: pag.pageSize || pagination.pageSize,
      categoryId: values.categoryId,
      levelId: values.levelId,
    });
  };

  const columns = [
    {
      title: '学科',
      dataIndex: 'category_name',
      key: 'category_name',
      width: 100,
    },
    {
      title: '关卡',
      dataIndex: 'level_name',
      key: 'level_name',
      width: 100,
    },
    {
      title: '题干',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 300 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '选项',
      key: 'options',
      width: 200,
      render: (_: unknown, record: Question) => {
        const labels = ['A', 'B', 'C', 'D'];
        return record.options.map((opt, idx) => (
          <div key={idx} style={{ fontSize: 12 }}>
            {labels[idx]}. {opt}
          </div>
        ));
      },
    },
    {
      title: '正确答案',
      dataIndex: 'correct_index',
      key: 'correct_index',
      width: 90,
      render: (val: number) => {
        const labels = ['A', 'B', 'C', 'D'];
        return <Tag color="blue">{labels[val] || val}</Tag>;
      },
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (val: string) => {
        const config = difficultyConfig[val] || { color: 'default', label: val };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 160,
      render: (tags: string[]) =>
        tags?.map((tag) => (
          <Tag key={tag} style={{ marginBottom: 4 }}>
            {tag}
          </Tag>
        )),
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 60,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Question) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              navigate(`/questions/${record.id}/edit`, { state: { question: record } })
            }
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
        <Form
          form={filterForm}
          layout="inline"
          initialValues={{ categoryId: undefined, levelId: undefined }}
        >
          <Form.Item name="categoryId" label="学科">
            <Select
              allowClear
              placeholder="选择学科"
              style={{ width: 160 }}
              onChange={handleCategoryChange}
              options={categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="levelId" label="关卡">
            <Select
              allowClear
              placeholder="选择关卡"
              style={{ width: 160 }}
              disabled={!filterForm.getFieldValue('categoryId')}
              options={levels.map((l) => ({
                label: `${l.level_number} - ${l.name}`,
                value: l.id,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/questions/new')}
        >
          新增题目
        </Button>
      </div>
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
        scroll={{ x: 1100 }}
      />
    </div>
  );
};

export default QuestionsList;
