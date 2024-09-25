import{i as d,w as l}from"./wait-8f4ae121.js";/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2021. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */class c{constructor(){var e,t;this.mollie=Mollie((e=document.querySelector("meta[name=mollie-profileId]"))==null?void 0:e.content,{testmode:(t=document.querySelector("meta[name=mollie-testmode]"))==null?void 0:t.content,locale:"en_US"})}createCardHolderInput(){let e=this.mollie.createComponent("cardHolder");e.mount("#card-holder");let t=document.getElementById("card-holder-error");return e.addEventListener("change",function(n){n.error&&n.touched?t.textContent=n.error:t.textContent=""}),this}createCardNumberInput(){let e=this.mollie.createComponent("cardNumber");e.mount("#card-number");let t=document.getElementById("card-number-error");return e.addEventListener("change",function(n){n.error&&n.touched?t.textContent=n.error:t.textContent=""}),this}createExpiryDateInput(){let e=this.mollie.createComponent("expiryDate");e.mount("#expiry-date");let t=document.getElementById("expiry-date-error");return e.addEventListener("change",function(n){n.error&&n.touched?t.textContent=n.error:t.textContent=""}),this}createCvvInput(){let e=this.mollie.createComponent("verificationCode");e.mount("#cvv");let t=document.getElementById("cvv-error");return e.addEventListener("change",function(n){n.error&&n.touched?t.textContent=n.error:t.textContent=""}),this}handlePayNowButton(){if(document.getElementById("pay-now").disabled=!0,document.querySelector("input[name=token]").value!=="")return document.querySelector("input[name=gateway_response]").value="",document.getElementById("server-response").submit();this.mollie.createToken().then(function(e){let t=e.token,n=e.error;if(n){document.getElementById("pay-now").disabled=!1;let o=document.getElementById("errors");o.innerText=n.message,o.hidden=!1;return}let r=document.querySelector('input[name="token-billing-checkbox"]:checked');r&&(document.querySelector('input[name="store_card"]').value=r.value),document.querySelector("input[name=gateway_response]").value=t,document.querySelector("input[name=token]").value="",document.getElementById("server-response").submit()})}handle(){this.createCardHolderInput().createCardNumberInput().createExpiryDateInput().createCvvInput(),Array.from(document.getElementsByClassName("toggle-payment-with-token")).forEach(e=>e.addEventListener("click",t=>{document.getElementById("mollie--payment-container").classList.add("hidden"),document.getElementById("save-card--container").style.display="none",document.querySelector("input[name=token]").value=t.target.dataset.token})),document.getElementById("toggle-payment-with-credit-card").addEventListener("click",e=>{document.getElementById("mollie--payment-container").classList.remove("hidden"),document.getElementById("save-card--container").style.display="grid",document.querySelector("input[name=token]").value=""}),document.getElementById("pay-now").addEventListener("click",()=>this.handlePayNowButton())}}function a(){new c().handle()}d()?a():l("#mollie-credit-card-payment").then(()=>a());