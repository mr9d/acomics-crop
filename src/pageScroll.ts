export const pausePageScroll = () => {
  document.body.style.top = '-' + window.scrollY + 'px';
  document.body.style.position = 'fixed';
  if (document.body.clientHeight > document.scrollingElement.clientHeight) {
    document.body.style.overflowY = 'scroll';
  }
};

export const resumePageScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
  document.body.style.overflowY = '';
};
