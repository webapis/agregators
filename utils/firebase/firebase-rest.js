function fb() {
    this.url = ''
    this.idToken = '',
    this.projectUri=''
    debugger;
    return {
        setIdToken: function (idToken) {
            this.idToken = idToken
            debugger;
            return this
        },
        setProjectUri:function(projectUri){
            this.projectUri = projectUri
            debugger;
            return this
        },
        ref: function (url) {
            this.url = url
            return this
        },
        set: function (data, cb) {
            debugger;
            debugger;
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'put', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                debugger;
                cb && cb()
            }).catch(error => {
                debugger;
                cb && cb(error)
                return this
            })
  
        },
        update: function (data, cb) {
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'patch', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                debugger;
                cb && cb()
            }).catch(error => {
                debugger;
                cb && cb(error)
                return this
            })
        },
        push: function(data,cb){
            fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'post', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
                debugger;
                cb && cb()
            }).catch(error => {
                debugger;
                cb && cb(error)
                return this
            })
        },
        get: function(type,){
  
        }
    }
  }