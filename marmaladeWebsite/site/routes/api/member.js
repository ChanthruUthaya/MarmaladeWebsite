const express = require('express');
const router = express.Router();
const members = require('./Members');
const uuid = require('uuid'); //unique id

router.get('/', (req, res)=> res.json(members)); //route for members

//:id is param form http request
router.get('/:id', (req, res)=>{
    //res.send(req.params.id); send id
    const found = members.some(member => member.id === parseInt(req.params.id));
    if(found){
        res.json(members.filter(member => member.id === parseInt(req.params.id))); //send member correspoding to id; === for matching type.
    }
    else{
        res.status(400).json({msg: "member not found: " + req.params.id});
    }

})

//Create member
router.post('/', (req, res) => {
    //res.send(req.body) //sends Body back as response JSON object in header of req 
    const newMember = {
        id: uuid.v4(), //generates random UUID
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }
    if(!newMember.name || !newMember.email){
       return res.status(400).json({msg: 'please include name or email'});
    }

    members.push(newMember); //add to array
    res.json(members);
});

//update member
router.put('/:id', (req, res)=>{
    res.send(req.params.id); //send id
    console.log(typeof req.params.id)
    const found = members.some(member => member.id === parseInt(req.params.id));
    if(found){
        const updMember = req.body;
        members.forEach(member => {
            if(member.id === parseInt(req.params.id)){
                member.name = updMember.name ? updMember.name : member.name; //if name sent to update
                member.email = updMember.email ? updMember.email : member.email; //if email sent to update

                res.json({nsg: 'Member updated', member});
            }
        });
    }
    else{
        res.status(400).json({msg: "member not found: " + req.params.id});
    }

})


//delete member
router.delete('/:id', (req, res)=>{
    //res.send(req.params.id); send id
    const found = members.some(member => member.id === parseInt(req.params.id));
    if(found){
        res.json({
            msg: 'Member Deleted',
            members: members.filter(member => member.id === parseInt(req.params.id))
        }); //send member correspoding to id; === for matching type.
    }
    else{
        res.status(400).json({msg: "member not found: " + req.params.id});
    }

})


module.exports = router;