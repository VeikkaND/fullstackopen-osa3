const express = require("express")
const app = express()

app.use(express.json())

const PORT = 3001
app.listen(PORT)

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/info", (req, res) => {
    const phonebookSize = persons.length
    res.send(`<p>Phonebook has info for ${phonebookSize} people</p>
    <p>${new Date()}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
    
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id != id)

    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const person = req.body
    const id = Math.floor(Math.random() * 1000)
    
    if(person.name === "" || person.number === "" ||
     !person.name || !person.number) {
        return res.status(400).json({
            error: "name or number missing"
        })
    } else if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({
            error: "name already exists in the phonebook"
        })
    }
    person["id"] = id
    persons = persons.concat(person)
    res.json(person)
})

