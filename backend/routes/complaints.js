const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../utils/upload');
const {
  createComplaint, getComplaints, getComplaintById, updateStatus, deleteComplaint
} = require('../controllers/complaintController');

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, adminOnly, updateStatus);
router.delete('/:id', protect, adminOnly, deleteComplaint);

module.exports = router;
