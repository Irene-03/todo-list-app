// ======================================================================
// Todo Routes - With Express Validator & Async Handler
// ======================================================================

const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {
  createTodo,
  getTodos,
  getById,
  toggleDone,
  updateTodo,
  removeTodo,
  clearCompleted,
  getStats
} = require("../models/todoStore");

// ======================================================================
// VALIDATION RULES
// ======================================================================

const createTodoValidation = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Task text is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Task text must be between 1 and 500 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high'])
    .withMessage('Priority must be low, normal, or high'),
  body('important')
    .optional()
    .isBoolean()
    .withMessage('Important must be a boolean'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
];

const updateTodoValidation = [
  body('text')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task text cannot be empty')
    .isLength({ min: 1, max: 500 })
    .withMessage('Task text must be between 1 and 500 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high'])
    .withMessage('Priority must be low, normal, or high'),
  body('important')
    .optional()
    .isBoolean()
    .withMessage('Important must be a boolean'),
  body('done')
    .optional()
    .isBoolean()
    .withMessage('Done must be a boolean'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
];

// ======================================================================
// VALIDATION ERROR HANDLER
// ======================================================================

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        status: 400,
        details: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      }
    });
  }
  next();
}

// ======================================================================
// ROUTES
// ======================================================================

// GET all todos with filters
router.get("/", asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const list = getTodos({ status, search });
  res.json(list);
}));

// POST create new todo
router.post("/", 
  createTodoValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { text, description, priority, dueDate, groups, important } = req.body;
    const todo = createTodo({ text, description, priority, dueDate, groups, important });
    res.status(201).json(todo);
  })
);

// PUT update or toggle done
router.put("/:id", 
  updateTodoValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const todo = getById(id);
    
    if (!todo) {
      return res.status(404).json({ 
        success: false,
        error: {
          message: 'Todo not found',
          status: 404
        }
      });
    }

    if (req.body.action === "toggle") {
      const updated = toggleDone(id);
      return res.json(updated);
    }

    // update fields
    const updated = updateTodo(id, req.body);
    res.json(updated);
  })
);

// DELETE one
router.delete("/:id", asyncHandler(async (req, res) => {
  const ok = removeTodo(req.params.id);
  
  if (!ok) {
    return res.status(404).json({ 
      success: false,
      error: {
        message: 'Todo not found',
        status: 404
      }
    });
  }
  
  res.json({ success: true });
}));

// DELETE ALL completed
router.delete("/", asyncHandler(async (req, res) => {
  const deleted = clearCompleted();
  res.json({ deleted });
}));

// GET stats
router.get("/stats", asyncHandler(async (req, res) => {
  res.json(getStats());
}));

module.exports = router;
