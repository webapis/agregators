customElements.define(
  'navigation-bar',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = /*html*/ `
      <div>
      <div class="container mt-5">
      <div class="accordion" id="accordionExample">
      <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
         Markalar

        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <div class="d-flex flex-column">
   
        <a  href="#" class="p-1 nav-link">Defacto</a>
        <a  href="#" class="p-1 nav-link">Kigili</a>
        <a  href="#" class="p-1 nav-link">Koton</a>
        <a  href="#" class="p-1 nav-link">LC waikiki</a>
      

      </div>
        </div>
      </div>
    </div>
        
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Kadın <span class="badge rounded-pill bg-light text-dark fw-lighter">40530</span>
            </button>
          </h2>
          <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div class="accordion-body">
            <div class="d-flex flex-column">
            <a  href="#" class="p-1 nav-link">Yeni gelenler</a>
            <a  href="#" class="p-1 nav-link">İndirimli ürünler</a>
            <a  href="#" class="p-1 nav-link">Fırsatlar</a>
            <a  href="#" class="p-1 nav-link">Giyim</a>
            <a  href="#" class="p-1 nav-link">Ayakkabı</a>
            <a  href="#" class="p-1 nav-link">Aksesuar</a>
            <a  href="#" class="p-1 nav-link">Koleksionlar</a>
            <a  href="#" class="p-1 nav-link">Yaşama saygı</a>
            </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              Erkek
            </button>
          </h2>
          <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
            <div class="accordion-body">
            <div class="d-flex flex-column">
            <a  href="#" class="p-1 nav-link">Yeni gelenler</a>
            <a  href="#" class="p-1 nav-link">İndirimli ürünler</a>
            <a  href="#" class="p-1 nav-link">Fırsatlar</a>
            <a  href="#" class="p-1 nav-link">Giyim</a>
            <a  href="#" class="p-1 nav-link">Ayakkabı</a>
            <a  href="#" class="p-1 nav-link">Aksesuar</a>
            <a  href="#" class="p-1 nav-link">Koleksionlar</a>
            <a  href="#" class="p-1 nav-link">Yaşama saygı</a>
         
            </div>
            </div>
          </div>
        </div>

        <div class="accordion-item">
         <h2 class="accordion-header" id="headingFour">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
            Çocuk ve genç
          </button>
         </h2>
          <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
          <div class="accordion-body">
          <div class="d-flex flex-column">
          <a  href="#" class="p-1 nav-link">Yeni gelenler</a>
          <a  href="#" class="p-1 nav-link">İndirimli ürünler</a>
          <a  href="#" class="p-1 nav-link">Fırsatlar</a>
          <a  href="#" class="p-1 nav-link">Giyim</a>
          <a  href="#" class="p-1 nav-link">Ayakkabı</a>
          <a  href="#" class="p-1 nav-link">Aksesuar</a>
          <a  href="#" class="p-1 nav-link">Koleksionlar</a>
          <a  href="#" class="p-1 nav-link">Yaşama saygı</a>
          </div>
          </div>
          </div>

        </div>

        <div class="accordion-item">
        <h2 class="accordion-header" id="headingFive">
         <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
          Bebek
         </button>
        </h2>
         <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
         <div class="accordion-body">
         <div class="d-flex flex-column">
         <a  href="#" class="p-1 nav-link">Yeni gelenler</a>
         <a  href="#" class="p-1 nav-link">İndirimli ürünler</a>
         <a  href="#" class="p-1 nav-link">Fırsatlar</a>
         <a  href="#" class="p-1 nav-link">Giyim</a>
         <a  href="#" class="p-1 nav-link">Ayakkabı</a>
         <a  href="#" class="p-1 nav-link">Aksesuar</a>
         <a  href="#" class="p-1 nav-link">Koleksionlar</a>
         <a  href="#" class="p-1 nav-link">Yaşama saygı</a>
         </div>
         </div>
         </div>

       </div>
      
      </div>
    
    </div>
    `;
    }
  }
);
