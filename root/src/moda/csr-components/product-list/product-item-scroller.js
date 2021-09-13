customElements.define(
  'product-item-scroller',
  class extends HTMLElement {
    constructor() {
      super();
      this._srcset = false;
    }

    connectedCallback() {
      document.addEventListener('scroll', () => {
        if (this.offsetTop >= window.innerHeight) {
          if (
            Math.round(document.body.scrollTop * 100 / this.offsetTop) >= 30
          ) {
            if (!this._srcset) {
              const img = this.querySelector('img');
              this._srcset = true;
              const screenWidth = window.screen.width;
              const defaultScr = this.getAttribute('srcset');
              const srcCurrent = defaultScr.substring(
                0,
                defaultScr.indexOf('525w')
              );

              if (screenWidth <= 525) {
                img.src = srcCurrent;
              } else if (screenWidth > 525 && screenWidth < 773) {
                img.src = srcCurrent.replace('/252/', '/304/');
              } else if (screenWidth >= 773 && screenWidth < 2000) {
                img.src = srcCurrent.replace('/252/', '/320/');
              } else if (screenWidth > 2000) {
                img.src = srcCurrent.replace('/252/', '/376/');
              }
            } else {
              console.log('I am set');
            }
          }
        }
      });
      this.innerHTML = `<div>product-container</div>`;

      if (this.offsetTop <= window.innerHeight) {
        if (!this._srcset) {
          const img = this.querySelector('img');
          this._srcset = true;
          const screenWidth = window.screen.width;
          const defaultScr = this.getAttribute('srcset');
          const srcCurrent = defaultScr.substring(
            0,
            defaultScr.indexOf('525w')
          );

          if (screenWidth <= 525) {
            img.src = srcCurrent;
          } else if (screenWidth > 525 && screenWidth < 773) {
            img.src = srcCurrent.replace('/252/', '/304/');
          } else if (screenWidth >= 773 && screenWidth < 2000) {
            img.src = srcCurrent.replace('/252/', '/320/');
          } else if (screenWidth > 2000) {
            img.src = srcCurrent.replace('/252/', '/376/');
          }

          console.log('window.innerHeight', window.innerHeight);
        } else {
          console.log('I am set');
        }
      }
    }

    set imgSrc(value) {
      this._srcset = value;
    }

    get imgSrc() {
      return this._srcset;
    }
  }
);
