import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  InputNumber,
  Button,
  Card,
  message,
  Space,
  Typography,
} from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createQuestion, updateQuestion, Question } from '../api/questions';
import { fetchCategories, Category } from '../api/categories';
import { fetchLevelsByCategory, Level } from '../api/levels';

const { Title } = Typography;
const { TextArea } = Input;

const optionLabels = ['A', 'B', 'C', 'D'];

const difficultyOptions = [
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' },
];

interface QuestionFormValues {
  categoryId: string;
  levelId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctIndex: number;
  explanation: string;
  tags: string[];
  difficulty: string;
  sortOrder: number;
}

const QuestionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;
  const [form] = Form.useForm<QuestionFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => message.error('加载学科列表失败'));
  }, []);

  // If edit mode, populate form from route state
  useEffect(() => {
    if (!isEdit) return;
    const question: Question | undefined = (location.state as any)?.question;
    if (!question) {
      message.warning('未获取到题目数据，请返回列表页重新选择');
      return;
    }
    form.setFieldsValue({
      categoryId: question.category_id,
      levelId: question.level_id,
      question: question.question,
      optionA: question.options[0] || '',
      optionB: question.options[1] || '',
      optionC: question.options[2] || '',
      optionD: question.options[3] || '',
      correctIndex: question.correct_index,
      explanation: question.explanation,
      tags: question.tags || [],
      difficulty: question.difficulty || 'easy',
      sortOrder: question.sort_order || 0,
    });
    // Load levels for the category
    if (question.category_id) {
      fetchLevelsByCategory(question.category_id)
        .then((res) => setLevels(res.data))
        .catch(() => setLevels([]));
    }
  }, [isEdit, location.state, form]);

  const handleCategoryChange = async (categoryId: string) => {
    form.setFieldValue('levelId', undefined);
    if (!categoryId) {
      setLevels([]);
      return;
    }
    try {
      const result = await fetchLevelsByCategory(categoryId);
      setLevels(result.data);
    } catch {
      setLevels([]);
    }
  };

  const onFinish = async (values: QuestionFormValues) => {
    setSubmitting(true);
    try {
      const body = {
        levelId: values.levelId,
        question: values.question,
        options: [values.optionA, values.optionB, values.optionC, values.optionD],
        correctIndex: values.correctIndex,
        explanation: values.explanation,
        tags: values.tags || [],
        difficulty: values.difficulty,
        sortOrder: values.sortOrder || 0,
      };

      if (isEdit) {
        await updateQuestion(id!, body);
        message.success('题目更新成功');
      } else {
        await createQuestion(body);
        message.success('题目创建成功');
      }
      navigate('/');
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || '操作失败';
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategory = Form.useWatch('categoryId', form);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Button onClick={() => navigate('/')} style={{ marginRight: 16 }}>
          返回列表
        </Button>
        <Title level={4} style={{ display: 'inline-block', margin: 0 }}>
          {isEdit ? '编辑题目' : '新建题目'}
        </Title>
      </div>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            correctIndex: 0,
            difficulty: 'easy',
            sortOrder: 0,
            tags: [],
          }}
        >
          <Form.Item
            name="categoryId"
            label="所属学科"
            rules={[{ required: true, message: '请选择学科' }]}
          >
            <Select
              placeholder="选择学科"
              showSearch
              optionFilterProp="label"
              onChange={handleCategoryChange}
              options={categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="levelId"
            label="所属关卡"
            rules={[{ required: true, message: '请选择关卡' }]}
          >
            <Select
              placeholder="请先选择学科"
              disabled={!selectedCategory}
              showSearch
              optionFilterProp="label"
              options={levels.map((l) => ({
                label: `第${l.level_number}关 - ${l.name}`,
                value: l.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="question"
            label="题干"
            rules={[{ required: true, message: '请输入题目内容' }]}
          >
            <TextArea rows={3} placeholder="请输入题目内容" />
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 0 }} align="start">
            {[0, 1, 2, 3].map((idx) => (
              <Form.Item
                key={idx}
                name={`option${optionLabels[idx]}` as any}
                label={`选项 ${optionLabels[idx]}`}
                rules={[{ required: true, message: `请输入选项${optionLabels[idx]}` }]}
                style={{ flex: 1 }}
              >
                <Input placeholder={`选项${optionLabels[idx]}`} />
              </Form.Item>
            ))}
          </Space>

          <Form.Item
            name="correctIndex"
            label="正确答案"
            rules={[{ required: true, message: '请选择正确答案' }]}
          >
            <Radio.Group>
              {optionLabels.map((label, idx) => (
                <Radio key={idx} value={idx}>
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="explanation"
            label="解析"
            rules={[{ required: true, message: '请输入解析' }]}
          >
            <TextArea rows={3} placeholder="请输入题目解析" />
          </Form.Item>

          <Space size="large" style={{ display: 'flex' }} align="start">
            <Form.Item name="difficulty" label="难度">
              <Select
                style={{ width: 120 }}
                options={difficultyOptions}
              />
            </Form.Item>
            <Form.Item name="sortOrder" label="排序值">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="tags" label="标签">
              <Select
                mode="tags"
                style={{ width: 280 }}
                placeholder="输入标签后回车"
                tokenSeparators={[',']}
              />
            </Form.Item>
          </Space>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {isEdit ? '保存修改' : '创建题目'}
              </Button>
              <Button onClick={() => navigate('/')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default QuestionForm;
