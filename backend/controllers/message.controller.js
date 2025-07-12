exports.getAllMessages = (req, res) => res.json([]);
exports.getMessageById = (req, res) => res.json({});
exports.createMessage = (req, res) => res.status(201).json({});
exports.updateMessage = (req, res) => res.json({});
exports.deleteMessage = (req, res) => res.status(204).end();