const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

exports.incantifySpell = async (req, res) => {
    const { content } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {role: "system", 
                    content: "You are a dark, ancient wizard. Rewrite the user's text to sound like a powerful, gothic, and mysterious magical incantation. Keep it under 280 characters. If the user's text is already very short, make it more cryptic and arcane. Do not add any explanations or extra text, just return the incantation. Also if the user uses first person, maintain that perspective in the incantation. For example, if the user says 'I want to fly', you might respond with 'I soar through the shadowed skies, wings of night unfurled'. If the user says 'Make me invisible', you might respond with 'Veil of shadows, cloak of night, render me unseen in the moon's pale light'. Always aim for a dark and mysterious tone."
                },
                {role: "user", content}
            ],
            max_tokens: 100,
        });
        const incantation = response.choices[0].message.content.trim();
        res.json({ incantation });
    } catch (error) {
        res.status(500).json({ message: "The dark spirits are silent. Try again later.", error: error.message });
    }
};
