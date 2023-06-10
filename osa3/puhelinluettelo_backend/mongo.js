const mongoose = require("mongoose")

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://veikkanevala:${password}@cluster0.hbkipt3.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if(name && number) {
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => mongoose.connection.close())
} else if(!name && !number) {
    Person.find({}).then(result => {
        result.forEach(person => console.log(person))
        mongoose.connection.close()
    })
    
} else {
    console.log("something went wrong")
    mongoose.connection.close()
}