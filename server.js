const express = require('express');
const apiRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const app = express();
const http = require('http').createServer(app)
const cors = require('cors')
app.use(express.static('public'));


const io = require('socket.io')(http)
const cookieParser = require('cookie-parser');

const DB_URL = "mongodb+srv://fpanda:fpanda@cluster0.gzuk5c6.mongodb.net/LabExam1Db?retryWrites=true&w=majority"
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.Promise = global.Promise;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");    
}).catch(err => {
    console.log('Could not connect to the database.', err);
    process.exit();
});

app.use("/api/", apiRoutes)

app.use(cors())

io.on('connection', (socket) => {
    console.log(socket.id);
    Room.find().then(result => {
        socket.emit('output-rooms', result)
    })
    socket.on('create-room', name => {
        const room = new Room({ name });
        room.save().then(result => {
            io.emit('room-created', result)
        })
    })
    socket.on('join', ({ name, room_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            room_id,
            user_id
        })
        socket.join(room_id);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user', user)
        }
    })
    socket.on('sendMessage', (message, room_id, callback) => {
        const user = getUser(socket.id);
        const msgToStore = {
            name: user.name,
            user_id: user.user_id,
            room_id,
            text: message
        }
        console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(result => {
            io.to(room_id).emit('message', result);
            callback()
        })

    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })
});

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the full stack lab test 1</h1>");
});


app.listen(8081, () => {
    console.log("Server PORT is 8081");
});