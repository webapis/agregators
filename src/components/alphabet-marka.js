const kigiliImgSrc =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAABVCAMAAABzYYb0AAAAZlBMVEX///8AAADAwMDGxsaVlZVlZWWbm5vY2NilpaW6urq3t7fj4+Otra2enp4oKChsbGxcXFxxcXESEhLu7u6Dg4P29vYICAg6OjpHR0fMzMxAQECMjIx5eXnS0tItLS1PT08aGhohISFr1fU4AAAEUElEQVRoge2a65qqIBSG8XwgRxMpTbO6/5vcKgtFxbKZvXL2s/1+GQS8I7D4WA0hu3bt2oWqIvIXFWzI5RrLSjbkip5wOTvXP8Nl/9L15YXLsjbk2kU47aSUMFHiMULEE/tWZ0zTdj7YokwjTVN10bKzcWpkpE3zuKs8TJp4YVkdp3KuTU3QfV/sTKd7jsYt27JTvY5rvJn4DfZXQVquViMu5p71+9HsuIaI4XTPU65WX9/hcmCYkGi5/PtSnLBQuTIYxSU6LnYzFoXK5cMgFVBe8jw/906BnpaxUOfRgjH0sZsuISVXM/QpHpcH4+Rc903+1YPcMv/gOsMGcOErOFwUBn70AcZ2GiWm+CCXnpFBPbdyWWQhcnE5yrWvVNe9fJlnNSzK9XhH5JIRwhwqVS6ovo2byxXpo3FloxFmXMzQ9xmK8hqLS1q+TK1UuKLpHI+/Y3goXI4JWGPXqXA5mupOED1sFK4asCYRYuDi4vwpND0kXU2MwgWqJ5Zm4BLL66Tr4dBVnTG5pqtn4PKGwae6iraYXJdJoB+4iu5Jez7BAuMYXNK9xEtc1ksugsEVy8BtL3Bdl3sUr/KCwpX0YXVkTpX9OEzWVOJPqpC4iLR86tpX4tele9Qlbc4DAAaXtDGpEisUrmyYrbHgPGdYXISBG62HyVK4IBrMX5h4keI4x/FfMLRy2Kh+4qy8F0WlKA4RuaQ3MEodF1SexmCQqXsQTK7eVMhNOboPXaBS8WfSTKD61VYyWhQarv7acQEy1qed4Pqk4bI5A/GfcElXCptyfH+U09yiHStn+JTL1nOuQccfcXGYrVrD1bv5iYbT6RlX9iMuabREyfS+HRpzpcoJgcjVL6NSw0Vobkyl3o8CpbMpV9VzPdZwXZM4jp1SKSkeX61aHNtpKhN1AxJrnqIYuAuls7Jt23wCJe3OpF39cQ3X+2JR/BiDla8bfUrU8stc88Z+hVifGliVmnyvb+s9maNzyAMTcrPMmcKgy58fesEPXJHrreAyjfc0sdKsft3kyUb5a1wzA7aYFHui8O9zzadg4RD4LJcu9OBweba7RmAddHkAsSkT116rcp58+bbEfajNA1BOWNhMZ2C2vzAweWhWL7tAkVjeX+0Fl5MLzWhmhj5z6EXa7/x1H3hczeBRxr2omX1GiohmPJGH8X0bLpHPaV1ZxknulWVz4AckL4+jvMnnJdZXKrjowYqak+fhe8QuIM+0ylQhcIkDp1nvFScxq6hzvcZFSR1GjmI/bsMFNs9tlhMnXuQR7h84sZoHiF/Z6y5QJAKYxmoe1sdKDEEawp1VpKJC+9PNJwR5AH2qc7Np7OdrchRBegLBGK7WAxDsYcpoAmVbOvzeedxLj3HOmXWUJat+SUdTpViV+vxQPm04i62mV1WpNX7982CnzbG0/2iVrP93FESxakxVm6/bfEbskECIN9KjzldvKGoFQWD+gnW1a9eu/0d/AISoP2DcAIs9AAAAAElFTkSuQmCC';
const defactoImgSrc =
  'https://dfcdn.defacto.com.tr/Assets/dist/images/logo.png';
customElements.define(
  'alphabet-marka',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render({ selected: 'defacto-count' });
      window.pageStore.subscribe(
        window.actionTypes.SELECTED_MARKA_COUNT,
        state => {
          const { selected } = state;

          this.render({ selected });
        }
      );
    }

    render({ selected }) {
      const title = this.getAttribute('title');
      const defactoCount = this.getAttribute('defacto-count');
      const kigiliCount = this.getAttribute('kigili-count');
      this.innerHTML = /*html*/ `
        <div class="border-bottom d-flex align-items-start ps-3">
        <a href="#" class="nav-link col-2">
       ${title}
        </a>
        <div class="col-10 d-flex">
          <marka-icon selected=${selected} count=${defactoCount} src=${defactoImgSrc} imgWidth="50" imgHeight="" id="defacto-count" imgStyle=""></marka-icon>
          <marka-icon selected=${selected} count=${kigiliCount} src=${kigiliImgSrc} imgWidth="" imgHeight="25" id="kigili-count" imgStyle="margin-top: -0.30rem !important;"></marka-icon>
        </div>`;
      this.querySelectorAll('a').forEach(element => {
        element.addEventListener('click', e => {
          const { id } = e.currentTarget;

          window.pageStore.dispatch({
            type: window.actionTypes.SELECTED_MARKA_COUNT,
            payload: id
          });
        });
      });
    }
  }
);

customElements.define(
  'marka-icon',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const selected = this.getAttribute('selected');
      const count = this.getAttribute('count');
      const src = this.getAttribute('src');
      const imgWidth = this.getAttribute('imgWidth');
      const imgHeight = this.getAttribute('imgHeight');
      const id = this.getAttribute('id');
      const imgStyle = this.getAttribute('imgStyle');

      this.innerHTML = `
      </a>
      <div class="col-10 d-flex">
      <a id=${id} class="nav-link   ${selected === id &&
        'border-secondary border-bottom border-2 bg-light'}" aria-current="page" href="#" style="${selected !==
        id && 'opacity:.50;'}">
      <div class="d-flex flex-column justify-content-between" style="height:40px; width:45px;">
      <img src=${src} width=${imgWidth} height=${imgHeight} style=${imgStyle}/>
      <span class="badge rounded-pill bg-light text-dark">${count}</span>
      </div>
      </a>
      `;
    }
  }
);
