const swipe = (game) => {
  const table = document.querySelector('tbody');
  const score = document.querySelector('.game-score');

  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  const SWIPE_DIFF = 20;

  function checkDirection() {
    const xDiff = Math.abs(touchStartX - touchEndX);
    const yDiff = Math.abs(touchStartY - touchEndY);

    if (xDiff > yDiff) {
      if (touchStartX - touchEndX > SWIPE_DIFF) {
        game.moveLeft();
      }
      if (touchEndX - touchStartX > SWIPE_DIFF) {
        game.moveRight();
      }
    } else {
      if (touchStartY - touchEndY > SWIPE_DIFF) {
        game.moveUp();
      }
      if (touchEndY - touchStartY > SWIPE_DIFF) {
        game.moveDown();
      }
    }

    const data = game.getScore();

    score.textContent = data;
  }

  table.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });

  table.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    checkDirection();
  });

  return () => {
    table.removeEventListener('touchstart', touchStartHandler);
    table.removeEventListener('touchend', touchEndHandler);
  };
};

export default swipe;
