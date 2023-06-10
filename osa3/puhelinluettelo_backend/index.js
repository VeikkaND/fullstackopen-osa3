require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")
const app = express()

app.use(express.json())
app.use(express.static("build"))

morgan.token("body", (req) => {return JSON.stringify(req.body)})
app.use(morgan("tiny", {skip: req => {return req.method === "POST"}}))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body",
 {skip: req => {return req.method !== "POST"}}))

app.use(cors())

app.get("/api/persons", (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get("/info", (req, res) => {
    Person.find({}).then(result => {
        const phonebookSize = result.length
        res.send(`<p>Phonebook has info for ${phonebookSize} people</p>
        <p>${new Date()}</p>`)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(result => {
        if(result) {
            res.json(result)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findByIdAndRemove(id)
        .then(res.status(204).end())
})

app.post("/api/persons", (req, res, next) => {
    const person = new Person(req.body)
    
    if(person.name === "" || person.number === "" ||
     !person.name || !person.number) {
        return res.status(400).json({
            error: "name or number missing"
        })
    }
    person.save()
        .then(result => res.json(result))
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const updatedPerson = new Person(req.body)

    Person.findByIdAndUpdate(id, {$set: {
        number:updatedPerson.number
    }})
        .then(result => {
            res.json(result)
        })
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if(error.name === "CastError") {
        return res.status(400).send({error: "malformatted id"})
    } else if(error.name === "ValidationError") {
        return res.status(400).send({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log("port:", PORT))