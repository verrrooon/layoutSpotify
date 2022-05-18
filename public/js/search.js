const $rowList = document.querySelector('.content');
const $searchInput = document.querySelector('.header__search');

$searchInput.addEventListener('input', (event) => {
  const searchValue = event.target.value;

  if (searchValue.length < 2) {
    [...$rowList.querySelectorAll('.hide')].forEach(($box) => $box.classList.remove('hide'));
    return;
  }

  [...$rowList.querySelectorAll('.box')].forEach(($box) => {
    const todoText = $box.querySelector('.title').textContent.toLowerCase();

    if (todoText.includes(searchValue)) {
      $box.classList.remove('hide');
    } else {
      $box.classList.add('hide');
    }
  });
});
