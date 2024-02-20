//External imports
import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { Server } from 'socket.io'
import { mongoose } from 'mongoose'

//Internal imports
import productManager from './DAO/FSManagers/productsManager.controller.js'
import chatManager from './DAO/DBManagers/chatRoom.controller.js'

import __dirname from './utils.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.routes.js'
import realTimeRouter from './routes/realTimeProducts.router.js'
import onlineProductsRouter from './routes/onlineProducts.router.js'
import onlineCartsRouter from './routes/onlineCarts.router.js'
import onlineMessagesRouter from './routes/onlineMessages.router.js'

const app = express()
const PORT = 8080

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Handlebars config
app.engine('hbs', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '/public')))

//Mongo DB
mongoose.connect("mongodb+srv://taiel:hola123@cluster0.jawvxzu.mongodb.net/eCommerce?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos", error)
    })

//Routes
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/realTimeProducts', realTimeRouter)
//Routes using mongo atlas
app.use('/onlineProds', onlineProductsRouter)
app.use('/onlineCarts', onlineCartsRouter)
app.use('/chat', onlineMessagesRouter)

//Server
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})

//Websockets config
const socketServer = new Server(httpServer)
const users = {}
//Websockets
socketServer.on('connect', async socket => {
    console.log('New client connected');
    //Devuelve los productos o un error
    try {
        const products =  productManager.getProducts();
        socketServer.emit('products', products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }

    //le pasa el parametro al socket asociado a `add`
    //y devuelve el resultado
    socket.on('add', (newProduct) => {
        try {
            const newProductObject = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                status: newProduct.status,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnail: newProduct.thumbnail,
            }
            let result = productManager.addProduct(newProductObject)
            let products = productManager.getProducts()

            socketServer.emit('products', products)
            socketServer.emit('response', {status: 'success', message: result})
            
        } catch (error) {
            socketServer.emit('response', {status: 'error', message: error.message} )
        }
    })

    //le pasa el parametro al socket asociado a `remove`
    //y devuelve el resultado
    socket.on('remove', async(pid) => {
        try {
            const response = await productManager.removeProduct(pid)
            const products = productManager.getProducts()

            socketServer.emit('products', products)
            socketServer.emit('response', {status: 'success', message: response})
        } catch (error) {
            socketServer.emit('response', {status: 'error', message: error.message} )
        }
    })

    socket.on("newUser", (username) => {
        users[socket.id] = username;
        socketServer.emit("userConnected", username);
    
        // Aquí obtienes todos los mensajes de la base de datos y los emites al nuevo usuario
        chatManager.returnChat().then(messages => {
            messages.forEach(message => {
                socket.emit("message", { username: message.user, message: message.message });
            });
        }).catch(error => {
            console.error("Error:", error);
        });
    });
    
    //El usuario emite un mensaje
    socket.on("chatMessage", (message) => {
        const username = users[socket.id]
        if(message.length < 1){
            socketServer.emit("error")
        }else{
            socketServer.emit("response", chatManager.updateDb(users[socket.id],message))
            socketServer.emit("message", { username, message })
        }
    })

    socket.on("disconnect", () => {
        const username = users[socket.id]
        delete users[socket.id]
        socketServer.emit("userDisconnected", username)
    })
})


//Socket.io

// socketServer.on("connection", (socket) => {
//     console.log("un usuario se ha conectado")
//     socket.on("newUser", (username) => {
//         users[socket.id] = username
//         socketServer.emit("userConnected", username)
//     })


//     //El usuario emite un mensaje
//     socket.on("chatMessage", (message) => {
//         const username = users[socket.id]
//         socketServer.emit("message", { username, message })
//     })

//     socket.on("disconnect", () => {
//         const username = users[socket.id]
//         delete users[socket.id]
//         socketServer.emit("userDisconnected", username)
//     })

// })
