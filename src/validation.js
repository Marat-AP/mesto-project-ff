const profileRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
const cardNameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
}

function checkInputValidity(formElement, inputElement, config) {
  let errorMessage = "";
  if (inputElement.name === "name" || inputElement.name === "title") {
    if (!profileRegex.test(inputElement.value)) {
      errorMessage =
        "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
      inputElement.dataset.error = errorMessage;
    } else {
      inputElement.dataset.error = "";
    }
  }
  if (!inputElement.validity.valid) {
    errorMessage = inputElement.validationMessage;
  }
  if (inputElement.dataset.error) {
    errorMessage = inputElement.dataset.error;
  }
  if (errorMessage) {
    showInputError(formElement, inputElement, errorMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some(
    (inputElement) => !inputElement.validity.valid || inputElement.dataset.error
  );
}

function toggleButtonState(inputList, buttonElement, config) {
  if (!buttonElement) return;
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function setEventListeners(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });

  toggleButtonState(inputList, buttonElement, config);
}

export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
}

export function clearValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
    inputElement.value = "";
    inputElement.dataset.error = "";
  });

  if (buttonElement) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  }
}
