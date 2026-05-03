const Complaint = require('../models/Complaint');
const { detectCategory, assignPriority, checkDuplicate } = require('../utils/aiEngine');
const { sendStatusUpdate } = require('../utils/mailer');
const User = require('../models/User');

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, address, lat, lng } = req.body;
    const location = { address, lat: parseFloat(lat), lng: parseFloat(lng) };

    const aiAnalysis = detectCategory(`${title} ${description}`);
    const priority = assignPriority(`${title} ${description}`);
    const duplicateOf = await checkDuplicate(Complaint, description, location);

    const complaint = await Complaint.create({
      title, description,
      category: aiAnalysis.detectedCategory,
      priority,
      location,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      citizen: req.user._id,
      isDuplicate: !!duplicateOf,
      duplicateOf: duplicateOf || undefined,
      aiAnalysis,
      statusHistory: [{ status: 'pending', note: 'Complaint submitted' }]
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === 'citizen' ? { citizen: req.user._id } : {};
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('citizen', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ complaints, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('citizen', 'name email phone');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (req.user.role === 'citizen' && complaint.citizen._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('citizen', 'email name');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    complaint.statusHistory.push({ status, note });
    await complaint.save();

    await sendStatusUpdate(complaint.citizen.email, complaint.title, status);
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
