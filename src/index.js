import "./pages/index.css";
import { createCard } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getUserInfo,
  updateUserInfo,
  updateAvatar,
  getInitialCards,
  addCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from "./api.js";

const cardList = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const popupEditProfile = document.querySelector(".popup_type_edit");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const formEditProfile = document.querySelector(
  '.popup__form[name="edit-profile"]'
);
const addButton = document.querySelector(".profile__add-button");
const popupAddCard = document.querySelector(".popup_type_new-card");
const formAddCard = document.querySelector('.popup__form[name="new-place"]');
const popups = document.querySelectorAll(".popup");
const popupConfirm = document.querySelector(".popup_type_confirm");
const formConfirm = popupConfirm.querySelector(".popup__form");
const popupAvatar = document.querySelector(".popup_type_avatar");
const formAvatar = popupAvatar.querySelector(".popup__form");
const avatarInput = popupAvatar.querySelector(".popup__input_type_avatar-url");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

let userId = null;
let cardIdToDelete = null;
let cardElementToDelete = null;

function renderLoading(isLoading, buttonElement, initialText = "Сохранить") {
  if (!buttonElement) return;
  buttonElement.textContent = isLoading ? "Сохранение..." : initialText;
}

function cardImageClick(cardData) {
  const popupImage = document.querySelector(".popup_type_image");
  const popupImageElement = popupImage.querySelector(".popup__image");
  const popupCaption = popupImage.querySelector(".popup__caption");
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(popupImage);
}

function requestCardRemoval(cardId, cardElement) {
  cardIdToDelete = cardId;
  cardElementToDelete = cardElement;
  openModal(popupConfirm);
}

formConfirm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (!cardIdToDelete) return;
  deleteCard(cardIdToDelete)
    .then(() => {
      if (cardElementToDelete) cardElementToDelete.remove();
      closeModal(popupConfirm);
      cardIdToDelete = null;
      cardElementToDelete = null;
    })
    .catch((err) => console.error(err));
});

function toggleLike(cardId, likeButton, likeCounter) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const likeAction = isLiked ? unlikeCard : likeCard;
  likeAction(cardId)
    .then((updatedCard) => {
      likeCounter.textContent = updatedCard.likes.length;
      if (updatedCard.likes.some((u) => u._id === userId)) {
        likeButton.classList.add("card__like-button_is-active");
      } else {
        likeButton.classList.remove("card__like-button_is-active");
      }
    })
    .catch((err) => console.error(err));
}

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(formEditProfile, validationConfig);
  openModal(popupEditProfile);
});

addButton.addEventListener("click", () => {
  clearValidation(formAddCard, validationConfig);
  openModal(popupAddCard);
});

profileAvatar.addEventListener("click", () => {
  clearValidation(formAvatar, validationConfig);
  formAvatar.reset();
  openModal(popupAvatar);
});

formAvatar.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = formAvatar.querySelector(
    validationConfig.submitButtonSelector
  );
  renderLoading(true, submitButton);
  updateAvatar(avatarInput.value)
    .then((user) => {
      profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
      closeModal(popupAvatar);
    })
    .catch((err) => console.error(err))
    .finally(() => renderLoading(false, submitButton));
});

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup || evt.target.classList.contains("popup__close")) {
      closeModal(popup);
    }
  });
});

formEditProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = formEditProfile.querySelector(
    validationConfig.submitButtonSelector
  );
  renderLoading(true, submitButton);
  updateUserInfo(nameInput.value, jobInput.value)
    .then((user) => {
      profileName.textContent = user.name;
      profileJob.textContent = user.about;
      closeModal(popupEditProfile);
    })
    .catch((err) => console.error(err))
    .finally(() => renderLoading(false, submitButton));
});

formAddCard.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = formAddCard.querySelector(
    validationConfig.submitButtonSelector
  );
  renderLoading(true, submitButton);
  const cardNameInput = formAddCard.querySelector(
    ".popup__input_type_card-name"
  );
  const cardPhotoLinkInput = formAddCard.querySelector(
    ".popup__input_type_url"
  );
  addCard(cardNameInput.value, cardPhotoLinkInput.value)
    .then((cardData) => {
      const cardElement = createCard(
        cardData,
        requestCardRemoval,
        toggleLike,
        cardImageClick,
        userId
      );
      cardList.prepend(cardElement);
      closeModal(popupAddCard);
      clearValidation(formAddCard, validationConfig);
      formAddCard.reset();
    })
    .catch((err) => console.error(err))
    .finally(() => renderLoading(false, submitButton));
});

Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    profileName.textContent = user.name;
    profileJob.textContent = user.about;
    profileAvatar.style.backgroundImage = `url('${user.avatar}')`;
    userId = user._id; // присваиваем id пользователя

    cards.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        requestCardRemoval,
        toggleLike,
        cardImageClick,
        userId
      );
      cardList.append(cardElement);
    });
  })
  .catch((err) => console.error("Ошибка загрузки данных:", err));
