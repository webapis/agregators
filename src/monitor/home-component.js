customElements.define('home-component', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.innerHTML =

       `<div class="container">
       <div class="row">
        <div class="col-3 mt-5">
        <h2>WDS's Web Data Scraping Process Explaned</h2>
        <h5>Start of the process... </h5>
        <ul>
        <li>Tell the names of websites and data you  want to be collected;</li>
        <li>Let the developer to prepare and customize web scraping process for you;</li>
        <li>Select the Project that is prepared for you and initialize scaping process by click of a button;</li>
        <li>Enjoy monitoring the scraping process;</li>
        <li>download collected data;</li>
        </ul>
        <h5>End of the process... </h5>
        </div>

        <div style="position:relative; transform: scale(0.5)" class="border border-secondary rounded-pill col-8">
        <div style="position:absolute; left:0;right:0;top:0;bottom:0; z-index:1000; heigth="100%; width:100%;opacity: 0.33;"></div>
        <project-list style="z-index:100 transform: scale(0.10)"></project-list>
        </div>

        <div class=" d-flex justify-content-center">
        <button class="btn btn-primary">Go to projects</button>
        <div>
        </div>
        </div>


        </div>
        </div>`
    }
})