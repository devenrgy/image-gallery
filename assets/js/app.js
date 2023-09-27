import { getBlurHashAverageColor } from './getBlurHash.js'

document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery__list')
  const form = document.querySelector('.header__form')
  const searchInput = document.querySelector('.search__input')

  async function getDataImages(q = '') {
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?client_id=7BQOCw7WI6FzEc7Y5eIKSvg8U7D9CFZcvLfcSJCot4M&count=30&query=${q}`)
      return await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  function render(data) {
    try {
      data.then(d => {
        d.forEach(({ urls, links, blur_hash }, i) => {
          const img = document.createElement('img')
          const a = document.createElement('a')
          const li = gallery.querySelector(`.gallery__item--${i + 1}`)
          const rgbAverageColor = getBlurHashAverageColor(`${blur_hash}`)
          li.style.backgroundColor = `rgb(${rgbAverageColor.join(',')})`

          a.classList.add('gallery__link')
          img.classList.add('gallery__img')

          a.href = links.download
          a.target = '_blank'
          img.src = urls.regular

          a.append(img)
          li.innerHTML = ''
          li.append(a)
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  form.addEventListener('submit', (evt) => {
    evt.preventDefault()
    const { searchKeyword } = Object.fromEntries(new FormData(evt.target))
    if (searchKeyword.trim().length > 0) {
      render(getDataImages(searchKeyword))
    }
  })

  searchInput.addEventListener('change', () => {
    const searchKeyword = searchInput.value
    if (searchKeyword.trim().length > 0) {
      render(getDataImages(searchKeyword))
    }
  })

  render(getDataImages())
})