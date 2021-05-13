// const Swal = require('sweetalert2')
const Counter = {
  data() {
    return {
      // api: 'http://localhost:8000', local
      api: 'https://jls-invetory.herokuapp.com',
      counter: 0,
      products: [],
      pagination: [],
      prev: {},
      next: {},
      search: '',
      product: {
        locations: []
      },
      inventory: {
        locations: [],
        tags: [],
        vendors: [],
        // back_up_vendors: [],
      },
      form : {
        id: 0,
        location_id : 0,
        quantity: 0
      }
    }
  },

  mounted() {
    this.getProducts();
  },

  computed: {
    shouldEdit() {
      // return false;
      let location = this.product.locations

      if(location == undefined) {
        return false
      }

      location = location.find(l => l.id == this.form.location_id)



      if(location == undefined) {
        return false
      }
      console.log(Math.sign(location.pivot.quantity) * Number(location.pivot.quantity) + Number(this.form.quantity))
      return (Math.sign(location.pivot.quantity) * Number(location.pivot.quantity) + Number(this.form.quantity)) <= 0
    }
  },



  methods: {
    getProducts(url = `${this.api}/products?search=${this.search}`) {
      if(url.includes('page')) {
        url += `&search=${this.search}`
      }
      fetch(url).then((resp) => resp.json()).then((data) => {
        console.log(data)
        this.products = data.data.data
        this.pagination = data.data.links.slice(1, data.data.links.length - 1)
        this.prev = data.data.prev_page_url
        this.next = data.data.next_page_url
        console.log(this.pagination[0].url)
      }).catch( (err) => {
        console.log(err)
      })
    },

    editProduct(id) {
      fetch(`${this.api}/editProduct/${id}`).then((resp) => resp.json()).then((data) => {
        console.log(data)
        this.product = data.data
        this.form = {
          id: 0,
          location_id : 0,
          quantity: 0
        }
        this.form.id = id;
        $('#edit').modal('show');

      }).catch( (err) => {
        console.log(err)
      })
    },

    viewProduct(id) {
      fetch(`${this.api}/product/${id}`).then((resp) => resp.json()).then((data) => {
        console.log(data.data)
        this.inventory = data.data
        $('#view').modal('show');
      }).catch( (err) => {
        console.log(err)
      })
    },

    getTotalAmount (data) {
      if(data != undefined) {
        return data.map(el => el.pivot.quantity).reduce((total, curr) => {
          total += curr
          return total
        }, 0)
      }
      return 0;
    },

    updateProduct () {
      fetch(`${this.api}/updateProducts/${this.form.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(this.form)
        }).then((resp) => resp.json()).then((data) => {
        console.log(data)
        this.product = {
          locations: []
        }
        this.form = {
          id: 0,
          location_id : 0,
          quantity: 0
        }
        this.closeModal('edit')
      }).catch( (err) => {
        console.log(err)
      })
    },

    closeModal (id) {
      $('#'+id).modal('hide');
      // const el = document.getElementById(id)
      // const body = document.body
      // const back_drop = document.getElementsByClassName('modal-backdrop')[0]
      // if (el.classList.contains("show")) {
      //   el.classList.remove("show");
      //   el.style.display = 'none';
      //   body.classList.remove('modal-open')
      //   body.removeAttribute('style')
      //   body.removeAttribute('data-bs-padding-right')
      //   // back_drop.parentElement.removeChild(back_drop)
      //   back_drop.style.display = 'none'
      // }
    }
  }
}

Vue.createApp(Counter).mount('#counter')
