// ======================================================================
// Todo Routes - Phase 3: With Controllers & JWT Authentication
// ======================================================================

const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateToken } = require("../middleware/authenticateToken");
const { createTodoLimiter } = require("../middleware/rateLimiter");

const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompleted,
  getStats
} = require("../controllers/todoController");

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
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
}

// ======================================================================
// ROUTES - All routes require JWT authentication
// ======================================================================

// Apply authentication to all routes
router.use(authenticateToken);

// GET stats (must be before /:id route)
router.get("/stats", asyncHandler(getStats));

// GET all todos with filters
router.get("/", asyncHandler(getTodos));

// GET single todo
router.get("/:id", asyncHandler(getTodoById));

// POST create new todo (with rate limiting)
router.post("/", 
  createTodoLimiter,
  createTodoValidation,
  handleValidationErrors,
  asyncHandler(createTodo)
);

// PUT update or toggle done
router.put("/:id", 
  updateTodoValidation,
  handleValidationErrors,
  asyncHandler(updateTodo)
);

// DELETE one todo
router.delete("/:id", asyncHandler(deleteTodo));

// DELETE ALL completed todos
router.delete("/", asyncHandler(clearCompleted));

module.exports = router;
