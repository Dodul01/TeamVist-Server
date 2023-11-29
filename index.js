const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json());


const uri = "mongodb+srv://allendodul6:DA8T1L9HjlzFaLHG@cluster0.bfzpc41.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db("teamVista")
        const usersCollection = database.collection("users")
        const tasksCollection = database.collection("tasks")
        const paymentCollection = database.collection("paymentInfo")
        const firedCollection = database.collection("firedEmployees")

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        app.get('/users', async (req, res) => {
            let query = {};

            if (req.query?.email) {
                query = { email: req.query.email }
            }

            const cursor = usersCollection.find(query);
            const result = await cursor.toArray();

            res.send(result);
        })


        app.put('/users', async (req, res) => {
            const userInfo = req.body.data;
            const verifyData = req.body.isVerifyed;
            const id = userInfo._id;

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updateUser = {
                $set: {
                    isVerifyed: verifyData
                }
            };

            const result = await usersCollection.updateOne(filter, updateUser, options);
            res.send(result);
        })

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);

            res.send(result);
        })

        app.get('/getTask', async (req, res) => {
            const email = req.query?.email;

            let query = {};

            if (req.query?.email) {
                query = { userEmail: req.query?.email }
            }

            const cursor = tasksCollection.find(query);
            const result = await cursor.toArray();

            res.send(result)
        })

        app.post('/paymentInfo', async (req, res) => {
            const payment = req.body;
            const result = await paymentCollection.insertOne(payment);

            res.send(result)
        })

        app.get('/paymentInfo', async (req, res) => {
            const email = req.query.email;
            let query = {};

            if (req.query.email) {
                query = { email: email }
            }

            const cursor = paymentCollection.find(query)
            const result = await cursor.toArray();

            res.send(result)
        })

        app.put('/makeHR', async (req, res) => {
            const userInfo = req.body.user;
            const makeHR = req.body.userRole;
            const id = userInfo._id;

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            console.log(req.body);

            const updateUser = {
                $set: {
                    userRole: makeHR
                }
            }

            const result = await usersCollection.updateOne(filter, updateUser, options)
            console.log(result);
            res.send(result)
        })


        app.post('/firedList', async (req, res) => {

        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Welcome to the TeamVista Server.')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})