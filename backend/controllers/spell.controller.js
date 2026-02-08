const { Post, PostBuilder } = require('../models/Posts');
const { User } = require('../models/User');

const castSpell = async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'Content is required to cast a spell' });
    }
    try {
        const newPost = new PostBuilder()
            .setInfo(null, req.wizard.id, content, new Date())
            .build();
        const postId = await newPost.save();

        const io = req.app.get('socket.io');
        if (io) {
            io.emit('newSpell', {
                username: req.wizard.wizardname || 'Unknown Wizard',
                content,
                timestamp: new Date()
            });
        }
        res.status(201).json({ message: 'Spell cast successfully', postId });
    } catch (error) {
        res.status(500).json({ message: 'Error casting spell', error: error.message });
    }
};

module.exports = { castSpell };