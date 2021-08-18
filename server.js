const express = require('express')
const reload = require('reload')
const mongodb = require('mongodb')

const app = express()
let db

app.use(express.static('public'))

const connectionString = 'mongodb://127.0.0.1/TodoApp'
mongodb.MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {

  if( err && err.stack.toLowerCase().includes('timeout')) {
    console.log('Connection timeout. Check if mongodb server is running.')
    process.exit(0)
  }

  db = client.db()

  if (db) console.log('Connected to database.')

  app.listen(3000)
  reload(app)
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
  db.collection('items').find().toArray((err, items) => {

    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>

        <div class="jumbotron p-3 shadow-sm">
          <form action="/create-item" method="POST">
            <div class="d-flex flex-wrap align-items-center justify-content-center">
            <input id="create-field" name="item" autofocus="" autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;flex-basis: 300px;flex-shrink: 0;">
              <button class="btn btn-primary mt-2">Add New Item</button>
            </div>
          </form>
        </div>

        <ul id="item-list" class="list-group pb-5"></ul>

      </div>
      <script>
          const items = ${JSON.stringify(items)}
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
      <!-- Hot reload -->
      <script src="/reload/reload.js"></script>
    </body>
    </html>`)

  })

})

/*
app.post('/create-item', function(req, res) {
  db.collection('items').insertOne({text: req.body.item}, () => {
    res.redirect('/')
  })
}) */

// new create-item answering post type requests
app.post('/create-item', async function(req, res) {
  let newItem
  try {
    newItem = await db.collection('items').insertOne({text: req.body.item})
  } catch (e) {
    //res.send(`Error: ${e}`)
    res.send(e)
    return
  }

  if (!newItem) {
    res.send('Error creating item. Review posted body data.')
    return
  }

  res.json(newItem)

  // res.send(`{
  //   "id": "${newItem.insertedId.toString()}"
  // }`.trim())

})

/* app.post('/create-item', (req, res) => {
  db.collection('items').insertOne({
    text: req.body.item
  }, (err, info) => {
    res.json(info.insertedId)
  })
}) */

app.post('/update-item', (req, res) => {
  db.collection('items').findOneAndUpdate({
    _id: new mongodb.ObjectId(req.body.id)
  }, {
    $set: {
      text: req.body.text
    }
  }, () => {
    res.send('success')
  })
})

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({
    _id: new mongodb.ObjectId(req.body.id)
  }, () => {
    res.send('success')
  })
})
