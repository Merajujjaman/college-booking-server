const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//midleware:
app.use(express.json());
app.use(cors());
// app.use(cors({ origin: 'https://college-booking-meraj.web.app' }))


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.zrkl84y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        const collegeCollection = client.db('collegeBooking').collection('collegeInfo');
        const usersCollection = client.db('collegeBooking').collection('users')
        const reviewCollection = client.db('collegeBooking').collection('reviews')
        const addmissionCollection = client.db('collegeBooking').collection('addmission')

        app.get('/colleges', async (req, res) => {
            const result = await collegeCollection.find().toArray()
            res.send(result)
        })

        app.post('/colleges', async (req, res) => {
            const collegeData = req.body;
            const result = await collegeCollection.insertOne(collegeData);
            res.send(result);
            // console.log(collegeData);
        })

        app.get('/college/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await collegeCollection.findOne(query)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const userData = req.body;
            const query = { email: userData.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: 'already have an account' })
            }
            const result = await usersCollection.insertOne(userData);
            res.send(result);
        });
        app.post('/addmission', async (req, res) => {
            const admissionData = req.body;
            const query = { studentEmail: admissionData.studentEmail }
            const admited = await addmissionCollection.findOne(query)
            if (admited) {
                return res.send({ message: 'admited' })
            }
            const result = await addmissionCollection.insertOne(admissionData);
            res.send(result);
            console.log(admissionData);
        });

        app.get('/addmission/:email', async (req, res) => {
            const email = req.params.email;
            const query = { studentEmail: email }
            const result = await addmissionCollection.findOne(query)
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })
        app.post('/reviews', async (req, res) => {
            const reviewData = req.body;
            const result = await reviewCollection.insertOne(reviewData);
            res.send(result);
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


app.get("/", (req, res) => {
    res.send('college booking server is running')
})
app.listen(port, () => {
    console.log(`my server is running on port: ${port}`);
})