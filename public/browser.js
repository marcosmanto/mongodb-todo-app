document.addEventListener('click', (event) => {
  if(event.target.classList.contains('edit-me')) {
    const itemElement = event.target.parentElement.parentElement.querySelector('.item-text')
    const userInput = prompt('Enter your desired new text', itemElement.innerHTML )
    if (!userInput) return
    axios.post('/update-item', {
      text: userInput,
      id: event.target.getAttribute('data-id')
    }).then(() => {
      itemElement.innerHTML = userInput
    }).catch(() => {
      console.log('Please try again later.')
    })
  }
})