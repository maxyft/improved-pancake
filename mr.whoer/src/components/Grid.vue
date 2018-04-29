<template>
  <div class="wrapper">
    <div class="grid-container">
      <div class="grid-top">
        <div class="item">Id</div>
        <div class="item">Name</div>
        <div class="item">Snippet</div>
        <div class="item">Created</div>
        <div class="item">Updated</div>
        <div class="item">Action</div>
      </div>
      <div class="grid-item" v-for="translate in translates">
        <div class="item id">{{ translate.id }}</div>
        <div class="item name">{{ translate.name }}</div>
        <div class="item snippet">
          <textarea v-model="translate.snippet" @change="changeTranslate(translate.id, translate.snippet)"></textarea>
        </div>
        <div class="item created">{{ new Date(translate.created).toLocaleString() }}</div>
        <div class="item updated">{{ new Date(translate.updated).toLocaleString() }}</div>
        <div class="item action">
          <button @click="deleteTranslate(translate.id)">Delete</button>
        </div>
      </div>
      <div class="grid-item">
        <form class="translate-form">
          <div class="flex-item p">
            <p>New Translate</p>
           </div>
          <div class="flex-item inp">
            <input type="text" required placeholder="Name" v-model="newName">
          </div>
          <div class="flex-item area">
            <textarea type="text" required placeholder="Snippet" v-model="newSnippet"></textarea>
          </div>
          <div class="flex-item btn">
            <button @click="addTranslate()">Add Translate</button>
          </div>
        </form>
      </div>
    </div>
    <div class="lang-container">
      <select @change="changeLang($event)">
        <option v-for="lang in langList" :value="lang.code"> {{ lang.native }} </option>
      </select>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { SSE } from 'sse.js';

export default {
  name: 'Grid',
  created() {
    this.getAPILangList();
    this.subscribeToEvents();
  },
  data () {
    return {
      sse: null,
      langCurrent: null,
      langList: null,
      secret: 'test123:supersecret',
      translates: null,
      newName: null,
      newSnippet: null
    }
  },
  computed: {
    encodedSecret() {
      return btoa(this.secret);
    }
  },
  methods: {
    changeLang(event) {
      this.langCurrent = event.target.value;
      this.getAPITranslates();
    },
    getAPILangList() {
      axios.get('http://new.whoer.net/v2/languages')
      .then(res => {
        this.langList = res.data;
        this.langCurrent = res.data.find(lang => lang.code == 'en').code;
      })
      .then(() => {
        this.getAPITranslates();
      });
    },
    getAPITranslates() {
      axios.get(
        'http://new.whoer.net/v2/translations/',
        { headers: {
            'Authorization': `Basic ${this.encodedSecret}`,
            'Accept-Language': this.langCurrent
        }}
      )
      .then(res => {
        this.translates = res.data;
      });
    },
    subscribeToEvents() {
      this.sse = new SSE(
        'http://new.whoer.net/v2/stream',
        { headers: {
            'Authorization': `Basic ${this.encodedSecret}`
        }}
      );
      this.sse.ontranslations = (e) => {
        let data = JSON.parse(e.data),
            id = data.id;
        if(data.deleted) {
          this.translates = this.translates.filter(item => item.id != id);
        } else {
          axios.get(
            `http://new.whoer.net/v2/translation/${id}`,
            { headers: {
                'Authorization': `Basic ${this.encodedSecret}`,
                'Accept-Language': this.langCurrent
            }}
          )
          .then(res => {
            let id = res.data.id;
            if(!this.translates.find(item => item.id === id)) this.translates.push(res.data);
            else {
              let index = this.translates.findIndex(item => item.id === id);
              this.translates.splice(index, 1, res.data);
            }
          });
        }
      };
      this.sse.onopen = (e) => {
        console.log('connection opened.');
      };
      this.sse.onclose = (e) => {
        console.log('connection closed.');
      };
      this.sse.stream();
    },
    deleteTranslate(id) {
      axios.delete(
        `http://new.whoer.net/v2/translation/${id}`,
        { headers: { 'Authorization': `Basic ${this.encodedSecret}` } }
      );
    },
    changeTranslate(id, newVal) {
      let url = `http://new.whoer.net/v2/translation/${id}`;
      axios({
        method: 'put',
        url: url,
        headers: {
          'Authorization': `Basic ${this.encodedSecret}`,
          'Accept-Language': this.langCurrent
        },
        data: { snippet: newVal }
      });
    },
    addTranslate() {
      let data = {
        name: this.newName,
        snippet: this.newSnippet
      };
      axios({
        method: 'post',
        url: 'http://new.whoer.net/v2/translation',
        headers: {
          'Authorization': `Basic ${this.encodedSecret}`,
          'Accept-Language': this.langCurrent
        },
        data: data
      })
      .then(() => {
        this.newName = null;
        this.newSnippet = null;
      });
    }
  }
}
</script>

<style scoped>
.wrapper {
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
}
textarea {
  resize: none;
  width: 85%;
  height: 100%;
  padding: 0;
  margin: auto;
}
p { padding: 0; margin: 0; }
.grid-container {
  display: grid;
  grid-template-columns: 5% 15% auto 20% 20% 10%;
  grid-auto-rows: 85px;
  grid-row-gap: 5px;
  align-items: center;
}
.item.snippet { height: 80%;}
.grid-top, .grid-item {
  grid-column-start: 1;
  grid-column-end: 7;
  display: grid;
  grid-template-columns: 5% 15% auto 20% 20% 10%;
  grid-auto-rows: 85px;
  align-items: center;
}
.lang-container {
  position: absolute;
  top: -10px;
  left: 30px;
}
.translate-form {
  height: 100%;
  grid-column: 1 / 7;
  grid-auto-rows: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.flex-item {
  flex: auto;
  padding-left: 5px;
  padding-right: 5px;
}
.flex-item.p { flex-grow: 0; width: 15%;}
.flex-item.inp { flex-grow: 0; width: 15%;}
.flex-item.btn { flex-grow: 0; width: 10%;}
.flex-item.area { height: 75%;}
</style>
