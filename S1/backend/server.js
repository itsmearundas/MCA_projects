const express = require('express'); 
const mysql = require('mysql'); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const app = express(); app.use(cors()); 
app.use(bodyParser.json()); 
const db = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'login',
 }); 
 db.connect(err => { 
    if (err) { 
        console.log('Error connecting to MySQL:', err); 
    } 
    else { 
        console.log('Connected to MySQL!'); 
    } 
});
app.get('/api/items', (req, res) => { 
    db.query('SELECT * FROM items', (err, results) => { 
        if (err) { 
            res.status(500).send(err); 
        } 
        else { 
            res.json(results); 
        } 
    }); 
}); 
app.post('/api/items', (req, res) => { 
    const { name } = req.body; 
    db.query('INSERT INTO items (name) VALUES (?)', [name], (err, result) => { 
        if (err) { 
            res.status(500).send(err); 
            
        } 
        else { 
            res.json({ id: result.insertId, name }); 
        } 
    }); 
}); 
const PORT = 5000; 
app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`); 
});