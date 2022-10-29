const express = require("express"); 
const router = express.Router();
const path = require('path')
const fs = require('fs');
const noteID = require("../public/assets/noteID.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'))
})

router.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        if(err) 
        {
            console.log(err);
            res.status(500).json({
                msg: "Error.",
                err: err
            })
        } 
        else 
        {
            const dataArr = JSON.parse(data); 
            res.json(dataArr)
        }
    })
})

router.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        if(err) 
        {
            console.log(err);
            res.status(500).json({
                msg: "Error.",
                err: err
            })
        } 
        else 
        {
            const dataArr = JSON.parse(data); 
            const {title, text} = req.body;
            const addArr = 
            {
                title,
                text,
                id: noteID()
            }
            dataArr.push(addArr);
            fs.writeFile('./db/db.json', JSON.stringify(dataArr, null, 4), (err, data) => {
                if(err) 
                {
                    console.log(err);
                    res.status(500).json({
                        msg:"Failed to save.",
                        err:err
                    })
                } 
                else 
                {
                    res.json({
                        msg:"Saved!"
                    })
                }
            })
        }
    })
})

router.get('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        if(err) 
        {
            console.log(err) 
            res.status(500).json({
                msg:"The id isn't defined.",
                err: err
            })
        } 
        else 
        {
            const dataArr = JSON.parse(data);
            for(let i = 0; i < dataArr.length; i++) 
            {
                const thisNote = dataArr[i];
                if(thisNote.id == req.params.id) 
                {
                    return res.json(thisNote);
                }
            }
            res.status(404).json({
                msg:"Can't find the ID."
            })
        }
    })
})

router.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        const dataArr = JSON.parse(data);
        const note = dataArr.find( c => c.id === (req.params.id))
        if(!note) {
            return res.status(404).send("An error occured.");
        }
        const index = dataArr.indexOf(note) 
        dataArr.splice(index,1);

        fs.writeFile('./db/db.json', JSON.stringify(dataArr, null, 4), (err, data) => {
            if(err) 
            {
                console.log(err);
                res.status(500).json({
                    msg:"Failed to delete.",
                    err:err
                })
            } 
            else 
            {
                res.json({
                    msg:"Deleted!"
                })
            }
        })
    })
})

module.exports = router;