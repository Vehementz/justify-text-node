exports.getTexts = (req, res) => {
    const texts = [
        {
            title: "First"
        },
        {
            title: "second"
        }
    ];

    const title = req.query.title;

    if (title) {
        const text = texts.find(p => p.title.toLowerCase() === title.toLowerCase());
        if (text) {
            return res.json({ text });
        } else {
            return res.status(404).json({ error: "Text not found" });
        }
    }

    res.json({ texts });
};


exports.getPostByTitle = (req, res) => {
    
    const title = req.params.title;

    const texts = [
        {
            title: "First"
        },
        {
            title: "second"
        }
    ];
    const text = texts.find(p => p.title.toLowerCase() === title.toLowerCase());

    if (text) {
        return res.json({ texts });
    }
    
    else {
        return res.status(404).json({ error: "text not found" });
    }
};


module.exports = {
    justifyText
};