import React from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import axios from 'axios';

function App() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState(0);
  const [tasks, setTasks] = React.useState([]);
  const [editDialog, setEditDialog] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);

  const statusMap = ['TODO', 'DOING', 'DONE'];

  const fetchTasks = async () => {
    try {
      const status = statusMap[statusFilter];
      let url = 'http://localhost:3000/tasks';
      if (status !== 'ALL') {
        url += `?status=${status}`;
      }
      const res = await axios.get(url);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách task. Vui lòng thử lại!');
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const createTask = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('Tiêu đề task không được để trống!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/tasks', {
        title: trimmedTitle,
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      alert('Task đã được tạo thành công!');
      fetchTasks(); // Tải lại → stats tự cập nhật
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Lỗi khi tạo task';
      alert(msg);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(
        `http://localhost:3000/tasks/${selectedTask.id}/status`,
        { status: newStatus }
      );
      setEditDialog(false);
      setSelectedTask(null);
      fetchTasks();
      alert(`Đã chuyển trạng thái thành ${newStatus}`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Lỗi khi cập nhật trạng thái';
      alert(msg);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa task này?')) return;

    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      fetchTasks();
      alert('Task đã được xóa');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xóa task');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'TODO':
        return <RadioButtonUncheckedIcon sx={{ color: '#9e9e9e' }} />;
      case 'DOING':
        return <AccessTimeIcon sx={{ color: '#2196f3' }} />;
      case 'DONE':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO':
        return 'default';
      case 'DOING':
        return 'primary';
      case 'DONE':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}
          >
            📋 Quản lý Task Cá Nhân
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tổ chức công việc hiệu quả hơn mỗi ngày
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AddIcon /> Tạo Task Mới
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Tiêu đề task"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Mô tả chi tiết"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={createTask}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #5568d3 0%, #65408d 100%)',
                },
              }}
            >
              Tạo Task
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={statusFilter}
            onChange={(e, newValue) => setStatusFilter(newValue)}
            variant="fullWidth"
            sx={{ '& .MuiTab-root': { fontWeight: 'bold' } }}
          >
            <Tab label="TODO" />
            <Tab label="DOING" />
            <Tab label="DONE" />
          </Tabs>
        </Paper>

        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  borderTop: 4,
                  borderColor:
                    task.status === 'DOING'
                      ? '#2196f3'
                      : task.status === 'DONE'
                      ? '#4caf50'
                      : '#9e9e9e',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Chip
                      icon={getStatusIcon(task.status)}
                      label={task.status}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedTask(task);
                        setEditDialog(true);
                      }}
                      sx={{ color: '#667eea' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {task.description || '(Không có mô tả)'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(task.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteTask(task.id)}
                  >
                    Xóa Task
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {tasks.length === 0 && (
          <Paper
            elevation={2}
            sx={{ p: 8, textAlign: 'center', borderRadius: 2, mt: 4 }}
          >
            <Typography variant="h1" sx={{ mb: 2 }}>
              📝
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Chưa có task nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {statusFilter === 0
                ? 'Hãy tạo task đầu tiên của bạn!'
                : `Không có task nào ở trạng thái ${statusMap[statusFilter]}`}
            </Typography>
          </Paper>
        )}

        <Dialog
          open={editDialog}
          onClose={() => setEditDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            Cập nhật trạng thái
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant={
                  selectedTask?.status === 'TODO' ? 'contained' : 'outlined'
                }
                onClick={() => updateStatus('TODO')}
              >
                TODO
              </Button>
              <Button
                fullWidth
                variant={
                  selectedTask?.status === 'DOING' ? 'contained' : 'outlined'
                }
                color="primary"
                onClick={() => updateStatus('DOING')}
              >
                DOING
              </Button>
              <Button
                fullWidth
                variant={
                  selectedTask?.status === 'DONE' ? 'contained' : 'outlined'
                }
                color="success"
                onClick={() => updateStatus('DONE')}
              >
                DONE
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Hủy</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default App;
