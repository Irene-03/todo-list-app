// ======================================================================
// Todo Controller - Business Logic
// Phase 3: MongoDB-based CRUD operations
// ======================================================================

const Todo = require('../models/todo');

// @desc    Get all todos for authenticated user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const { status, search, important, priority, group } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    if (status === 'completed') query.done = true;
    if (status === 'uncompleted') query.done = false;
    if (important === 'true') query.important = true;
    if (priority) query.priority = priority;
    if (group) query.groups = group;
    if (search) query.text = { $regex: search, $options: 'i' };

    const todos = await Todo.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: todos,
      count: todos.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          status: 404
        },
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: todo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    const { text, description, priority, dueDate, groups, important } = req.body;

    const todo = await Todo.create({
      text,
      description,
      priority: priority || 'normal',
      dueDate,
      groups: groups || [],
      important: important || false,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: todo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          status: 404
        },
        timestamp: new Date().toISOString()
      });
    }

    // Handle toggle action
    if (req.body.action === 'toggle') {
      todo.done = !todo.done;
      await todo.save();
      
      return res.json({
        success: true,
        data: todo,
        timestamp: new Date().toISOString()
      });
    }

    // Update fields
    const allowedFields = ['text', 'description', 'priority', 'dueDate', 'groups', 'important', 'done'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        todo[field] = req.body[field];
      }
    });

    await todo.save();

    res.json({
      success: true,
      data: todo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          status: 404
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// @desc    Clear completed todos
// @route   DELETE /api/todos/completed
// @access  Private
const clearCompleted = async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({
      userId: req.user._id,
      done: true
    });

    res.json({
      success: true,
      data: {
        message: 'Completed todos cleared',
        deletedCount: result.deletedCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get todos statistics
// @route   GET /api/todos/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const [total, completed, important, today] = await Promise.all([
      Todo.countDocuments({ userId: req.user._id }),
      Todo.countDocuments({ userId: req.user._id, done: true }),
      Todo.countDocuments({ userId: req.user._id, important: true }),
      Todo.countDocuments({
        userId: req.user._id,
        dueDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        uncompleted: total - completed,
        important,
        today,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompleted,
  getStats
};
