customElements.define('slide-component', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div class="container">Slide component
       <div class="row">
        <hr class="col m-2"  style="height:10px">
        <hr class="col m-2 bg-warning"  style="height:10px">
        <hr class="col m-2"  style="height:10px">
        <hr class="col m-2"  style="height:10px">
        </div>
        <div class="row">
        <div class="col-12 border border-1 p-5">
            <h3>Data Storage Configuration(Required):</h3>
            <div class="row">
            <div class="col">
            <p>Required your permission to upload for storage the collected data files and image files to your a Google Drive.</p>
            </div>
            <div class="col">
            <button class="btn btn-primary">Enable Google Drive API</button>
            </div>
            </div>
           <next-prev-btns></next-prev-btns>
        </div>

        <div class="col-12 border border-1 p-5">
        <h3>Email Configuration (Optional):</h3>
        <div class="row">
        <div class="col">
        <p>Required gmail configuration to send email alerts about web scraping results.</p>
        </div>
        <div class="col">
        <button class="btn btn-primary">Enable Google Gmail API</button>
        </div>
        </div>
       <next-prev-btns></next-prev-btns>
    </div>

    <div class="col-12 border border-1 p-5">
    <h3>Cloud Firestore Configuration(Optional):</h3>
    <div class="row">
    <div class="col">
    <p>Required Cloud Firestore API configuration to to store the data collected to cloud NOSQL database.</p>
    </div>
    <div class="col">
    <button class="btn btn-primary">Enable Google Cloud Firestore API</button>
    </div>
    </div>
   <next-prev-btns></next-prev-btns>
</div>

<div class="col-12 border border-1 p-5">
<h3>Export to Google Sheet API Configuration(Optional):</h3>
<div class="row">
<div class="col">
<p>Required Google Sheets API configuration to export the data collected to Google Sheets.</p>
</div>
<div class="col">
<button class="btn btn-primary">Enable Google Sheets API</button>
</div>
</div>
<next-prev-btns></next-prev-btns>
</div>

<div class="col-12 border border-1 p-5">
<h3>Scheduling Configuration(Optional):</h3>
<div class="row">
<div class="col">
<p>Required Github verification for enabing Scheduling</p>
</div>
<div class="col">
<button class="btn btn-primary">Enable Scheduling</button>
</div>
</div>
<next-prev-btns></next-prev-btns>
</div>

        <div class="col-12">Content</div>
        <div class="col-12">Content</div>
        </div>
        </div>`
    }
})



customElements.define('next-prev-btns', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback(){
        this.innerHTML=`<div >
        <button class="btn btn-secondary">Previous</button>
        <button class="btn btn-secondary">Next</button>
        </div>`
    }
})