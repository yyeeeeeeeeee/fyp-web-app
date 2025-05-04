const { PythonShell } = require('python-shell');

const express = require("express");
const router = express.Router();

router.get('/recommendations', (req, res) => {
    const options = {
        scriptPath: './python_scripts',
        args: [req.query.genre, req.query.mood]
    };

    PythonShell.run('recommend.py', options, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ recommendations: result });
    });
});

module.exports = router;