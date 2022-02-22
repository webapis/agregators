customElements.define('task-config', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `        

          <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Run order</span>
         <input type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
            </div>


            <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Run sequence</span>
            <select name="choice" class="form-control">
            <option value="sequential">sequential</option>
            <option value="parallel" selected>parallel</option>
            </select>
            </div>

`
    }
})