const itemsList = document.getElementById('item-list')
const tasksHTML = items.map( item => {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`
}).join('')

console.log(tasksHTML)

itemsList.insertAdjacentHTML('beforeend', tasksHTML)


const form = document.querySelector('form[action *= "create-item"]')
const createInput = document.getElementById('create-field')


form.addEventListener('submit', (event) => {
  event.preventDefault()
  axios.post('/create-item', {
    item: createInput.value
  }).then((res) => {

    // check if there was a server validation error
    if(res.data.errInfo) {
      console.log('Error. Review data sent.')
      return
    }

    // create HTML for new item
    // and adds to the end of list
    itemsList.insertAdjacentHTML('beforeend',
`<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${createInput.value}</span>
  <div>
    <button data-id="${res.data.insertedId}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${res.data.insertedId}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`
    )
    createInput.value = ''
    createInput.focus()
  }).catch(() => console.log('Please try again later.'))
})


document.addEventListener('click', (event) => {

  // Update action
  if(event.target.classList.contains('edit-me')) {
    const itemTextElement = event.target.parentElement.parentElement.querySelector('.item-text')
    const userInput = prompt('Enter your desired new text', itemTextElement.innerHTML )
    if (!userInput) return
    axios.post('/update-item', {
      text: userInput,
      id: event.target.getAttribute('data-id')
    }).then(() => {
      itemTextElement.innerHTML = userInput
    }).catch(() => {
      console.log('Please try again later.')
    })
  }

  // Delete action
  if(event.target.classList.contains('delete-me')) {

    if(confirm('Do you really want to delete this item permanently?')) {

      const itemElement = event.target.parentElement.parentElement

      axios.post('/delete-item', {
        id: event.target.getAttribute('data-id')
      }).then(() => {
        itemElement.remove()
      }).catch(() => {
        console.log('Please try again later.')
      })

    }
  }

})