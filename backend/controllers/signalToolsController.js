const Signal = require('../models/signal');

// ✅ حفظ خطوط الاتجاه
exports.saveLines = async (req, res) => {
  try {
    const { id } = req.params;
    const { lines } = req.body;

    const updated = await Signal.findByIdAndUpdate(
      id,
      { $set: { lines } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'signal not found' });

    res.json({ success: true, lines: updated.lines });
  } catch (err) {
    console.error('❌ Error saving lines:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
