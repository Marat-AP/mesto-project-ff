export function createCard(cardData, onRemove, onLike, onImageClick, userId) {
  const template = document.querySelector('#card-template').content;
  const cardElement = template.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeCounter = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  // Отметить лайк, если текущий пользователь уже лайкал
  if (Array.isArray(cardData.likes) && cardData.likes.some(u => u._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Удаление доступно только для своих карточек
  if (!cardData.owner || cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => onRemove(cardData._id, cardElement));
  }

  likeButton.addEventListener('click', () => onLike(cardData._id, likeButton, likeCounter));
  cardImage.addEventListener('click', () => onImageClick(cardData));

  return cardElement;
}