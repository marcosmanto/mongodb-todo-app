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