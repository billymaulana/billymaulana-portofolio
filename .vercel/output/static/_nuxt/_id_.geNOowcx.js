import{u as b,q as x,o as r,c,a as e,s as a,t as m,v as w,r as p,x as f,y as C,g as $,z as y,F as g,A as B,B as S,b as _,w as v,d as h,e as V}from"./entry.g5socCcX.js";function A(){const t=b("count",()=>Math.round(Math.random()*20));function n(){t.value+=1}function o(){t.value-=1}return{count:t,inc:n,dec:o}}const E={"inline-flex":"",m:"y-3"},F=e("div",{"i-carbon-subtract":""},null,-1),L=[F],M={font:"mono",w:"15","m-auto":"","inline-block":""},j=e("div",{"i-carbon-add":""},null,-1),q=[j],z=x({__name:"Counter",setup(t){const{count:n,inc:o,dec:u}=A();return(i,s)=>(r(),c("div",E,[e("button",{btn:"","p-2":"","rounded-full":"",onClick:s[0]||(s[0]=l=>a(u)())},L),e("div",M,m(a(n)),1),e("button",{btn:"","p-2":"","rounded-full":"",onClick:s[1]||(s[1]=l=>a(o)())},q)]))}}),D=w("user",()=>{const t=p(""),n=p(new Set),o=f(()=>Array.from(n.value)),u=f(()=>o.value.filter(s=>s!==t.value));function i(s){t.value&&n.value.add(t.value),t.value=s}return{setNewName:i,otherNames:u,savedName:t}}),H=e("div",{"i-twemoji:waving-hand":"","text-4xl":"","inline-block":"","animate-shake-x":"","animate-duration-5000":""},null,-1),R=e("h3",{"text-2xl":"","font-500":""}," Hi, ",-1),T={"text-xl":""},U={key:0,"text-sm":"","my-4":""},G=e("span",{"op-50":""},"Also as known as:",-1),J=x({__name:"[id]",setup(t){const n=C(),o=D(),u=n.params.id;return $(()=>{o.setNewName(n.params.id)}),(i,s)=>{const l=y("router-link"),k=z,N=V;return r(),c("div",null,[H,R,e("div",T,m(a(u))+"! ",1),a(o).otherNames.length?(r(),c("p",U,[G,e("ul",null,[(r(!0),c(g,null,B(a(o).otherNames,d=>(r(),c("li",{key:d},[_(l,{to:`/hi/${d}`,replace:""},{default:v(()=>[h(m(d),1)]),_:2},1032,["to"])]))),128))])])):S("",!0),_(k),e("div",null,[_(N,{class:"btn m-3 text-sm",to:"/"},{default:v(()=>[h(" Back ")]),_:1})])])}}});export{J as default};