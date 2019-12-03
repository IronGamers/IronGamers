function like(event) {
  const button = event.target

  axios.post(`/tweets/${button.id}/like`)
    .then(response => {
      const likesContainer = button.querySelector(".likes-count")

      likesContainer.innerText = Number(likesContainer.innerText) + response.data.likes
    })
    .catch(console.error)
}