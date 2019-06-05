<template>
  <div class="home">

    <h2>Input the website you want to screenshot</h2>

    <input type="text" v-model="url">

    <button class="btn btn-info" @click="goToUrl">GO</button>

    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" id="scales" name="scales" v-model="isEN">
      <label for="scales" class="form-check-label">语言: 英文</label>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Home extends Vue {
    private url: string = '' ;
    private isEN: boolean = true ;


    private goToUrl() {

        if (!/^https?:\/\//i.test(this.url)) {
            this.url = 'http://' + this.url;
        }

        let tempUrl = '/backend/index.js?url=' + encodeURIComponent(this.url);
        // let tempUrl = 'http://localhost:3008/api/screenshot?url=' + encodeURIComponent(this.url);


        if (this.isEN) {
            tempUrl = tempUrl + '&en=true';
        }
        window.open(tempUrl, '_blank' );
    }
}
</script>

<style lang="scss">
  .home {
    text-align: left;
    input {
      display: block;
      width: 80%;
      height: calc(1.5em + .75rem + 2px);
      padding: 10px 20px;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 16px;
      transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }

    input:focus {
      color: #495057;
      background-color: #fff;
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
  }

  .btn {
    display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 10px 20px;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  }

  .btn-info {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8;

    margin: 10px 0px;
  }

  .form-check {
    position: relative;
    display: block;
    padding-left: 1.25rem;


    input[type=checkbox], input[type=radio] {
      box-sizing: border-box;
      padding: 0;
    }

    .form-check-input {
      position: absolute;
      margin-left: -1.25rem;
    }

    .form-check-label {
      margin-top: 10px;
      margin-bottom: 0;
    }

    label {
      display: inline-block;
      margin-bottom: .5rem;
    }
  }

  .form-group {
    margin-bottom: 1rem;
  }



</style>

