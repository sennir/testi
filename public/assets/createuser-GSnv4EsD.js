import"./style-SSo58T_l.js";import{f as l}from"./fetch-wtUFcH3C.js";const i=document.querySelector(".createuser");i.addEventListener("click",async r=>{r.preventDefault(),console.log("Nyt luodaan käyttäjä");const e=document.querySelector(".create_user_form"),o=e.querySelector("input[name=username]").value,a=e.querySelector("input[name=password]").value,n=e.querySelector("input[name=email]").value;if(!o||!a||!n){alert("Täytä kaikki kentät ennen käyttäjän luomista.");return}const s="https://srprojekti.northeurope.cloudapp.azure.com/api/users",u={username:o,password:e.querySelector("input[name=password]").value,email:e.querySelector("input[name=email]").value},c={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)};try{const t=await l(s,c);console.log(t),alert("Uusi käyttäjä on luotu onnistuneesti! Nyt voi kirjautua sisään etusivulla")}catch(t){console.error(t)}});
