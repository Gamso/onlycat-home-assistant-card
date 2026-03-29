function t(t,e,i,o){var s,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new r(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,y=g?g.emptyScript:"",_=m.reactiveElementPolyfillSupport,f=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const r=o?.call(this);s?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=o;const r=s.fromAttribute(e,t.type);this[o]=r??this._$Ej?.get(o)??r,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const r=this.constructor;if(!1===o&&(s=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??b)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==s||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,_?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,E=t=>t,k=w.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+T,I=`<${C}>`,z=document,P=()=>z.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,U="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,H=/>/g,N=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=q(1),V=q(2),F=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),Z=new WeakMap,J=z.createTreeWalker(z,129);function K(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,o=[];let s,r=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===R?"!--"===c[1]?n=D:void 0!==c[1]?n=H:void 0!==c[2]?(B.test(c[2])&&(s=RegExp("</"+c[2],"g")),n=N):void 0!==c[3]&&(n=N):n===N?">"===c[0]?(n=s??R,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?N:'"'===c[3]?L:j):n===L||n===j?n=N:n===D||n===H?n=R:(n=N,s=void 0);const h=n===N&&t[e+1].startsWith("/>")?" ":"";r+=n===R?i+I:l>=0?(o.push(a),i.slice(0,l)+S+i.slice(l)+T+h):i+T+(-2===l?e:h)}return[K(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class X{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,r=0;const n=t.length-1,a=this.parts,[c,l]=G(t,e);if(this.el=X.createElement(c,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=J.nextNode())&&a.length<n;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(S)){const e=l[r++],i=o.getAttribute(t).split(T),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?ot:"?"===n[1]?st:"@"===n[1]?rt:it}),o.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(B.test(o.tagName)){const t=o.textContent.split(T),e=t.length-1;if(e>0){o.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],P()),J.nextNode(),a.push({type:2,index:++s});o.append(t[e],P())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(T,t+1));)a.push({type:7,index:s}),t+=T.length-1}s++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,o){if(e===F)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const r=O(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=Q(t,s._$AS(t,e.values),s,o)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??z).importNode(e,!0);J.currentNode=o;let s=J.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new nt(s,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(s=J.nextNode(),r++)}return J.currentNode=z,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new tt(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new X(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new et(this.O(P()),this.O(P()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=E(t).nextSibling;E(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,o){const s=this.strings;let r=!1;if(void 0===s)t=Q(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const o=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=Q(this,o[i+n],e,n),a===F&&(a=this._$AH[n]),r||=!O(a)||a!==this._$AH[n],a===Y?t=Y:t!==Y&&(t+=(a??"")+s[n+1]),this._$AH[n]=a}r&&!o&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class st extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class rt extends it{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??Y)===F)return;const i=this._$AH,o=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==Y&&(i===Y||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(X,et),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new et(e.insertBefore(P(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},pt=(t=ht,e,i)=>{const{kind:o,metadata:s}=i;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ut(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(t){return ut({...t,state:!0,attribute:!1})}const gt={en:{card:{name_default:"Cat Flap",config_required:"Please configure the OnlyCat card.",locked:"Locked",unlocked:"Unlocked",connected:"Connected",offline:"Offline",unavailable:"Unavailable",policy:"Policy",no_recent_activity:"No recent activity",errors:"Device errors"},actions:{unlock:"Unlock",unlock_title:"Unlock now",restart:"Restart",restart_title:"Restart the cat flap",cancel:"Cancel"},camera:{title:"Last activity",stream_unavailable:"Stream unavailable."},history:{title:"Activity history",loading:"Loading…",error:"Unable to load history.",passage_detected:"Passage detected",prey_detected:"Prey detected",human_detected:"Human detected",row_flap:"Passage",row_prey:"Prey",row_human:"Human",chart_now:"now",unlock_triggered:"Triggered by unlock button"},time:{just_now:"just now",minutes_ago:"{n} min ago",hours_ago:"{h}h ago",hours_minutes_ago:"{h}h{m} ago"},confirm_restart:{title:"Confirm restart",question:"Are you sure you want to restart the cat flap?",note:"The cat flap will be temporarily offline during the restart."},editor:{card_name:"Card name",device:"OnlyCat device",device_hint:"Select the connectivity sensor of your OnlyCat device",show_title:"Show title"}},fr:{card:{name_default:"Chatière",config_required:"Veuillez configurer la carte OnlyCat.",locked:"Verrouillé",unlocked:"Ouvert",connected:"Connecté",offline:"Hors ligne",unavailable:"Indisponible",policy:"Politique",no_recent_activity:"Aucune activité récente",errors:"Erreurs de l'appareil"},actions:{unlock:"Déverrouiller",unlock_title:"Déverrouiller maintenant",restart:"Redémarrer",restart_title:"Redémarrer la chatière",cancel:"Annuler"},camera:{title:"Dernière activité",stream_unavailable:"Flux indisponible."},history:{title:"Historique des activités",loading:"Chargement…",error:"Impossible de charger l'historique.",passage_detected:"Passage détecté",prey_detected:"Proie détectée",human_detected:"Humain détecté",row_flap:"Passage",row_prey:"Proie",row_human:"Humain",chart_now:"maintenant",unlock_triggered:"Déclenché par déverrouillage"},time:{just_now:"à l'instant",minutes_ago:"il y a {n} min",hours_ago:"il y a {h}h",hours_minutes_ago:"il y a {h}h{m}"},confirm_restart:{title:"Confirmer le redémarrage",question:"Êtes-vous sûr de vouloir redémarrer la chatière ?",note:"La chatière sera temporairement hors ligne pendant le redémarrage."},editor:{card_name:"Nom de la carte",device:"Appareil OnlyCat",device_hint:"Sélectionnez le capteur de connectivité de votre appareil OnlyCat",show_title:"Afficher le titre"}}};function yt(t,e){const i=e.indexOf("."),o=e.slice(0,i),s=e.slice(i+1),r=t[o];return"object"==typeof r?r[s]:void 0}function _t(t,e){return yt(gt[function(t){return(t?.locale?.language??t?.language??"en").toLowerCase().startsWith("fr")?"fr":"en"}(t)],e)??yt(gt.en,e)??e}function ft(t,e,i){let o=_t(t,e);for(const[t,e]of Object.entries(i))o=o.replace(`{${t}}`,String(e));return o}function vt(t){const e=t.match(/^binary_sensor\.(.+)_connectivity$/);return e?e[1]:t}class bt extends lt{_t(t){return _t(this.hass,t)}setConfig(t){this._config=t}_connectivityEntities(){return this.hass?.states?Object.keys(this.hass.states).filter(t=>/^binary_sensor\..+_connectivity$/.test(t)):[]}_valueChanged(t){const e=t.target,i=e.getAttribute("data-key");if(!i)return;let o=e.value;"checkbox"===e.type?o=e.checked:"number"===e.type&&(o=Number(e.value)),this._config={...this._config,[i]:o},this._fire()}_fire(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}get _selectedConnectivityEntity(){return this._config?.device_id?`binary_sensor.${this._config.device_id}_connectivity`:""}render(){if(!this._config)return W``;const t=this._connectivityEntities(),e=this._selectedConnectivityEntity;return W`
      <div class="editor">
        <!-- Card name -->
        <div class="field">
          <label>${_t(this.hass,"editor.card_name")}</label>
          <input
            type="text"
            data-key="name"
            .value=${this._config.name??""}
            placeholder="${_t(this.hass,"card.name_default")}"
            @input=${this._valueChanged}
          />
        </div>

        <!-- Device picker (via connectivity entity) -->
        <div class="field">
          <label>
            ${_t(this.hass,"editor.device")} <span class="required">*</span>
          </label>
          ${t.length>0?W`
                <select
                  class="entity-select"
                  .value=${e}
                  @change=${t=>{const e=t.target.value;e&&(this._config={...this._config,device_id:vt(e)},this._fire())}}
                >
                  <option value="" ?selected=${!e}>
                    — ${_t(this.hass,"editor.device")} —
                  </option>
                  ${t.map(t=>W`<option
                        value="${t}"
                        ?selected=${t===e}
                      >
                        ${t}
                      </option>`)}
                </select>
              `:W`
                <input
                  type="text"
                  data-key="device_id"
                  .value=${this._config.device_id??""}
                  placeholder="only_cat"
                  @input=${this._valueChanged}
                />
              `}
          <span class="hint">${_t(this.hass,"editor.device_hint")}</span>
          ${this._config.device_id?W`<code class="derived-id"
                >binary_sensor.${this._config.device_id}_connectivity</code
              >`:Y}
        </div>

        <!-- Show title -->
        <div class="field field--checkbox">
          <label>
            <input
              type="checkbox"
              data-key="show_title"
              ?checked=${!1!==this._config.show_title}
              @change=${this._valueChanged}
            />
            ${_t(this.hass,"editor.show_title")}
          </label>
        </div>
      </div>
    `}}bt.styles=n`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field--checkbox {
      flex-direction: row;
      align-items: center;
    }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--secondary-text-color);
    }

    input[type="text"],
    input[type="number"],
    .entity-select {
      padding: 8px 10px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }

    .entity-select {
      cursor: pointer;
    }

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      cursor: pointer;
    }

    .hint {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }

    .derived-id {
      font-size: 0.78rem;
      background: var(--secondary-background-color);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--secondary-text-color);
      font-family: monospace;
    }

    .required {
      color: var(--error-color, #ef5350);
    }
  `,t([ut({attribute:!1})],bt.prototype,"hass",void 0),t([mt()],bt.prototype,"_config",void 0),customElements.define("onlycat-home-assistant-card-editor",bt);class $t extends lt{_entity(){return this.hass?.states?.[this.entityId]}_getSnapshotUrl(){const t=this._entity()?.attributes?.entity_picture;return t??null}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this.entityId}}))}_latestActivityTs(){if(this.lastActivityEntityId){const t=this.hass?.states?.[this.lastActivityEntityId];if(t){const e=t.state||t.attributes?.datetime||t.attributes?.last_activity||t.attributes?.created_at,i=new Date(e).getTime();if(!isNaN(i))return i}}const t=[this.eventEntityId,this.humanEntityId,this.contrabandEntityId];let e=null;for(const i of t){if(!i)continue;const t=this.hass?.states?.[i]?.last_changed;if(!t)continue;const o=new Date(t).getTime();!isNaN(o)&&(null===e||o>e)&&(e=o)}return e}_relativeTime(t){if(!t)return"";const e=new Date(t);if(isNaN(e.getTime()))return"";const i=Math.round((Date.now()-e.getTime())/6e4);if(i<1)return _t(this.hass,"time.just_now");if(i<60)return ft(this.hass,"time.minutes_ago",{n:i});const o=Math.floor(i/60),s=i%60;return 0===s?ft(this.hass,"time.hours_ago",{h:o}):ft(this.hass,"time.hours_minutes_ago",{h:o,m:String(s).padStart(2,"0")})}render(){const t=this._getSnapshotUrl(),e=this._latestActivityTs();return W`
      <div
        class="camera-panel ${t?"camera-panel--clickable":""}"
        @click=${()=>{t&&this._openMoreInfo()}}
      >
        ${t?W`
              <img
                src="${t}"
                alt="${_t(this.hass,"camera.title")}"
                class="camera-img"
              />
              <div class="camera-overlay">
                <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                ${null!==e?W`<span class="camera-ts"
                      >${this._relativeTime(new Date(e).toISOString())}</span
                    >`:Y}
              </div>
            `:W`
              <div class="camera-placeholder">
                <ha-icon icon="mdi:paw"></ha-icon>
                <span>${_t(this.hass,"card.no_recent_activity")}</span>
              </div>
            `}
      </div>
    `}}$t.styles=n`
    :host {
      display: block;
    }

    /* ── Thumbnail ───────────────────────────────────── */
    .camera-panel {
      position: relative;
      height: 160px;
      border-radius: 10px;
      overflow: hidden;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .camera-panel--clickable {
      cursor: pointer;
    }

    .camera-panel--clickable:hover .camera-overlay {
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
    }

    .camera-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .camera-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 40%, rgba(0, 0, 0, 0.55));
      display: flex;
      align-items: flex-end;
      gap: 6px;
      padding: 10px 12px;
      color: #fff;
      transition: background 0.2s;
    }

    .camera-overlay ha-icon {
      --mdc-icon-size: 22px;
    }

    .camera-ts {
      font-size: 0.8rem;
    }

    .camera-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--secondary-text-color);
      opacity: 0.5;
    }

    .camera-placeholder ha-icon {
      --mdc-icon-size: 52px;
    }

    .camera-placeholder span {
      font-size: 0.85rem;
    }
  `,t([ut({attribute:!1})],$t.prototype,"hass",void 0),t([ut()],$t.prototype,"entityId",void 0),t([ut()],$t.prototype,"eventEntityId",void 0),t([ut()],$t.prototype,"humanEntityId",void 0),t([ut()],$t.prototype,"contrabandEntityId",void 0),t([ut()],$t.prototype,"lastActivityEntityId",void 0),customElements.define("onlycat-camera-panel",$t);class xt extends lt{constructor(){super(...arguments),this.historyHours=24,this._show=!1,this._loading=!1,this._hasFetched=!1,this._error=null,this._data=[[],[],[]],this._lockData=[],this._offsetPages=0,this._zoom=null}_timeWindow(){const t=new Date;t.setHours(0,0,0,0);const e=new Date(t.getTime()-864e5*this._offsetPages),i=0===this._offsetPages?new Date:new Date(e.getTime()+864e5);return{start:e,end:i}}_isEntityOn(t){return"on"===this.hass?.states?.[t]?.state}async _load(){if(!this._loading){this._loading=!0,this._error=null;try{const{start:t,end:e}=this._timeWindow(),i=[this.eventEntityId,this.contrabandEntityId,this.humanEntityId],o=this.lockEntityId?[...i,this.lockEntityId]:i,s=o.join(","),r=`history/period/${t.toISOString()}?filter_entity_id=${s}&end_time=${e.toISOString()}&minimal_response&no_attributes&significant_changes_only=false`,n=await this.hass.callApi("GET",r);if(!Array.isArray(n))return this._data=[[],[],[]],void(this._lockData=[]);const a=e.getTime()-t.getTime(),c=[[],[],[],[]];console.debug("[OnlyCat] raw API response:",n.map(t=>`${t[0]?.entity_id}: ${t.length} entries`));for(const i of n){if(!i?.length)continue;const s=i[0],r=o.indexOf(s.entity_id);if(-1===r)continue;let n=null,l=0;for(const e of i){let i,o;const s=e;if("state"in s)i=s.state,o=new Date(s.last_changed).getTime();else{i=s.s;const t=s.lc??s.lu;if(void 0===t)continue;o=t>1e12?t:1e3*t}"on"===i&&null===n?(n=o,l++):"on"!==i&&null!==n&&(c[r].push({start:Math.max(0,(n-t.getTime())/a),end:Math.min(1,(o-t.getTime())/a),startTs:n,endTs:o}),n=null)}null!==n&&c[r].push({start:Math.max(0,(n-t.getTime())/a),end:1,startTs:n,endTs:e.getTime()}),console.debug(`[OnlyCat] ${s.entity_id}: ${i.length} entries → ${l} "on" transitions → ${c[r].length} periods`)}for(let t=0;t<c.length;t++){const e=["event","contraband","human","lock"][t];for(const i of c[t])console.debug(`[OnlyCat] ${e} period: ${new Date(i.startTs).toISOString()} → ${new Date(i.endTs).toISOString()} (${Math.round((i.endTs-i.startTs)/1e3)}s)`)}console.debug("[OnlyCat] history parsed",c.map((t,e)=>`${["event","contraband","human","lock"][e]}:${t.length}`)),this._data=[c[0],c[1],c[2]],this._lockData=c[3]??[],this._hasFetched=!0}catch(t){console.error("[OnlyCat] history error",t),this._error=_t(this.hass,"history.error")}finally{this._loading=!1}}}_toggle(){this._show=!this._show,this._show&&this._load()}_navPrev(){this._offsetPages++,this._load()}_navNext(){this._offsetPages>0&&(this._offsetPages--,this._load())}_formatDateRange(){const{start:t}=this._timeWindow(),e=this.hass?.locale?.language??"en";return new Intl.DateTimeFormat(e,{weekday:"short",month:"short",day:"numeric"}).format(t)}_axisLabels(){const{start:t,end:e}=this._timeWindow(),i=e.getTime()-t.getTime(),o=t=>{const e=t.getHours(),i=t.getMinutes();return 0===i?`${e}h`:`${e}h${String(i).padStart(2,"0")}`},s=[];for(let r=0;r<=24;r+=6){const n=t.getTime()+36e5*r;if(n>e.getTime()+1)break;const a=Math.min(1,(n-t.getTime())/i);s.push({label:0===r?"0h":o(new Date(n)),frac:a})}if(0===this._offsetPages){(s[s.length-1]?.frac??0)<.97&&s.push({label:o(e),frac:1})}return s}_formatTooltip(t,e){const i=this.hass?.locale?.language??"en",o=t=>t.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit"}),s=Math.round((e-t)/1e3),r=s<60?`${s}s`:s<3600?`${Math.floor(s/60)}min${s%60>0?" "+s%60+"s":""}`:`${Math.floor(s/3600)}h ${Math.floor(s%3600/60)}min`;return`${o(new Date(t))} – ${o(new Date(e))} (${r})`}_onBarEnter(t,e,i,o){clearTimeout(this._zoomTimer);const s=this._data[o]?.indexOf(t)??0;this._zoom={centerTs:(t.startTs+t.endTs)/2,highlightStartTs:t.startTs,highlightEndTs:t.endTs,color:e,label:i,rowIndex:o,eventIndex:s}}_zoomNavigate(t){if(!this._zoom)return;const e=this._data[this._zoom.rowIndex],i=this._zoom.eventIndex+t;if(i<0||i>=e.length)return;const o=e[i];this._zoom={...this._zoom,eventIndex:i,centerTs:(o.startTs+o.endTs)/2,highlightStartTs:o.startTs,highlightEndTs:o.endTs}}_onBarLeave(){clearTimeout(this._zoomTimer),this._zoomTimer=setTimeout(()=>{this._zoom=null},200)}_renderZoom(){const t=this._zoom,e=t.highlightEndTs-t.highlightStartTs,i=Math.max(18e5,Math.min(72e5,30*e)),o=t.centerTs-i/2,s=t.centerTs+i/2,r=i,n=this.hass?.locale?.language??"en",a=t=>{const e=new Date(t),i=e.getMinutes();return`${e.getHours()}h${i>0?String(i).padStart(2,"0"):""}`},c=Math.round((t.highlightEndTs-t.highlightStartTs)/1e3),l=c<60?`${c}s`:`${Math.floor(c/60)}min${c%60?" "+c%60+"s":""}`,d=0===t.rowIndex&&this._lockData.some(e=>e.startTs<=t.highlightEndTs+3e4&&e.endTs>=t.highlightStartTs-3e4),h=(this._data[t.rowIndex]??[]).filter(t=>t.endTs>=o&&t.startTs<=s);return W`
      <div
        class="zoom-overlay"
        @mouseenter=${()=>clearTimeout(this._zoomTimer)}
        @mouseleave=${this._onBarLeave}
      >
        <div class="zoom-header-info">
          <span class="zoom-time">${p=t.highlightStartTs,new Date(p).toLocaleTimeString(n,{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
          <span class="zoom-dur">${l}</span>
          ${d?W`<ha-icon
                icon="mdi:lock-open-variant"
                class="zoom-unlock-icon"
                title="${_t(this.hass,"history.unlock_triggered")}"
              ></ha-icon>`:Y}
        </div>
        <div class="zoom-header-nav">
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${0===t.eventIndex}
            @click=${t=>{t.stopPropagation(),this._zoomNavigate(-1)}}
            title="Previous event"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${t.eventIndex>=(this._data[t.rowIndex]?.length??0)-1}
            @click=${t=>{t.stopPropagation(),this._zoomNavigate(1)}}
            title="Next event"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>
        <div class="zoom-track">
          <svg class="zoom-svg" viewBox="0 0 600 28" preserveAspectRatio="none">
            ${h.map(e=>{const i=Math.max(0,(e.startTs-o)/r*600),s=Math.min(600,(e.endTs-o)/r*600),n=Math.max(4,s-i),a=e.startTs===t.highlightStartTs&&e.endTs===t.highlightEndTs;return V`<g>
                <title>${this._formatTooltip(e.startTs,e.endTs)}</title>
                <rect
                  x="${i}" y="4" width="${n}" height="20" rx="3"
                  style="fill: ${t.color}; stroke: rgba(255,255,255,0.6); stroke-width: 1;"
                  opacity="${a?"1":"0.35"}"
                />
              </g>`})}
          </svg>
        </div>
        <div class="zoom-axis">
          <span>${a(o)}</span>
          <span>${a(t.centerTs)}</span>
          <span>${a(s)}</span>
        </div>
      </div>
    `;var p}_renderChart(){const t=[{label:_t(this.hass,"history.row_flap"),color:"var(--history-flap-color, #29b6f6)",events:this._data[0]??[]},{label:_t(this.hass,"history.row_prey"),color:"var(--history-contraband-color, #e53935)",events:this._data[1]??[]},{label:_t(this.hass,"history.row_human"),color:"var(--history-human-color, #ab47bc)",events:this._data[2]??[]}];return W`
      <div class="history-chart">
        <div class="chart-nav">
          <button
            class="nav-btn"
            @click=${this._navPrev}
            title="Previous period"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <span class="nav-label">${this._formatDateRange()}</span>
          <button
            class="nav-btn"
            @click=${this._navNext}
            ?disabled=${0===this._offsetPages}
            title="Next period"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>

        <div class="chart-rows">
          ${t.map((t,e)=>W`
              <div class="chart-row">
                <span class="chart-label" style="color: ${t.color}"
                  >${t.label}</span
                >
                <div class="chart-track">
                  <svg
                    class="chart-svg"
                    viewBox="0 0 600 28"
                    preserveAspectRatio="none"
                    @mouseleave=${this._onBarLeave}
                  >
                    ${t.events.map(i=>{const o=Math.max(0,600*i.start),s=Math.max(4,600*(i.end-i.start));return V`<g
                          class="event-bar"
                          @mouseenter=${o=>{o.stopPropagation(),this._onBarEnter(i,t.color,t.label,e)}}
                        >
                        <title>${this._formatTooltip(i.startTs,i.endTs)}</title>
                        <rect
                          x="${o}"
                          y="4"
                          width="${s}"
                          height="20"
                          rx="3"
                          style="fill: ${t.color}; stroke: rgba(255,255,255,0.5); stroke-width: 0.5;"
                          opacity="0.85"
                        />
                      </g>`})}
                  </svg>
                </div>
                <span class="chart-count">${t.events.length}</span>
                ${this._zoom?.rowIndex===e?this._renderZoom():Y}
              </div>
            `)}
        </div>

        <div class="chart-axis">
          <div></div>
          <div class="chart-axis-inner">
            ${this._axisLabels().map(({label:t,frac:e})=>W`<span style="left: ${100*e}%">${t}</span>`)}
          </div>
          <div></div>
        </div>
      </div>
    `}render(){const t=this._isEntityOn(this.eventEntityId),e=this._isEntityOn(this.contrabandEntityId),i=this._isEntityOn(this.humanEntityId);return W`
      <div class="event-section">
        <button
          class="history-toggle ${this._show?"history-toggle--open":""}"
          @click=${this._toggle}
        >
          <ha-icon icon="mdi:chart-timeline-variant"></ha-icon>
          <span>${_t(this.hass,"history.title")}</span>

          ${t?W`<span
                class="event-badge event-badge--flap"
                title="${_t(this.hass,"history.passage_detected")}"
              >
                <ha-icon icon="mdi:cat"></ha-icon>
              </span>`:Y}
          ${e?W`<span
                class="event-badge event-badge--contraband"
                title="${_t(this.hass,"history.prey_detected")}"
              >
                <ha-icon icon="mdi:rodent"></ha-icon>
              </span>`:Y}
          ${i?W`<span
                class="event-badge event-badge--human"
                title="${_t(this.hass,"history.human_detected")}"
              >
                <ha-icon icon="mdi:account"></ha-icon>
              </span>`:Y}

          <ha-icon
            class="chevron"
            icon="${this._show?"mdi:chevron-up":"mdi:chevron-down"}"
          ></ha-icon>
        </button>

        ${this._show?this._loading&&!this._hasFetched?W`<div class="history-status">
                <ha-circular-progress
                  active
                  size="small"
                ></ha-circular-progress>
                <span>${_t(this.hass,"history.loading")}</span>
              </div>`:this._error?W`<div class="history-status history-status--error">
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  <span>${this._error}</span>
                </div>`:this._renderChart():Y}
      </div>
    `}}xt.styles=n`
    :host {
      display: block;
    }

    /* ── Toggle button ───────────────────────────────── */
    .event-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .history-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 9px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 9px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: left;
      transition: border-color 0.15s;
    }

    .history-toggle:hover {
      border-color: var(--primary-color);
    }

    .history-toggle--open {
      border-color: var(--primary-color);
    }

    .history-toggle ha-icon:first-child {
      color: var(--primary-color);
      --mdc-icon-size: 18px;
    }

    .history-toggle span:first-of-type {
      flex: 1;
    }

    .chevron {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }

    /* ── Live event badges ───────────────────────────── */
    .event-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 5px;
      border-radius: 6px;
      font-size: 0;
    }

    .event-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .event-badge--flap {
      background: rgba(41, 182, 246, 0.15);
      color: #29b6f6;
    }

    .event-badge--contraband {
      background: rgba(229, 57, 53, 0.15);
      color: #e53935;
    }

    .event-badge--human {
      background: rgba(171, 71, 188, 0.15);
      color: #ab47bc;
    }

    /* ── Loading / error ─────────────────────────────── */
    .history-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      font-size: 0.875rem;
      color: var(--secondary-text-color);
    }

    .history-status--error {
      color: var(--error-color, #ef5350);
    }

    /* ── Chart container ─────────────────────────────── */
    .history-chart {
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 10px 12px 8px;
      animation: fadeSlide 0.2s ease;
    }

    @keyframes fadeSlide {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── Period navigation ───────────────────────────── */
    .chart-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      transition:
        border-color 0.15s,
        opacity 0.15s;
    }

    .nav-btn:hover:not(:disabled) {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .nav-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }

    .nav-btn ha-icon {
      --mdc-icon-size: 16px;
    }

    .nav-label {
      flex: 1;
      text-align: center;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Timeline rows ───────────────────────────────── */
    .chart-rows {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .chart-row {
      display: grid;
      grid-template-columns: 52px 1fr 28px;
      align-items: center;
      gap: 6px;
      position: relative;
    }

    .chart-label {
      font-size: 0.72rem;
      font-weight: 700;
      text-align: right;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .chart-track {
      height: 28px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      overflow: hidden;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .chart-svg .event-bar {
      cursor: pointer;
    }

    .chart-svg .event-bar:hover rect {
      opacity: 1;
    }

    .chart-count {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .chart-axis {
      display: grid;
      grid-template-columns: 52px 1fr 28px;
      gap: 6px;
      margin-top: 4px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }

    .chart-axis-inner {
      position: relative;
      height: 14px;
      overflow: visible;
    }

    .chart-axis-inner span {
      position: absolute;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    /* ── Zoom overlay ────────────────────────────────────── */
    .zoom-overlay {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 58px;
      right: 34px;
      z-index: 10;
      background: var(--card-background-color);
      border: 1px solid var(--primary-color, #6200ea);
      border-radius: 6px;
      padding: 4px 8px 2px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
      pointer-events: auto;
      animation: fadeSlide 0.12s ease;
    }

    .zoom-header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .zoom-nav-btn {
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }

    .zoom-nav-btn ha-icon {
      --mdc-icon-size: 14px;
    }

    .zoom-header-info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .zoom-label-title {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .zoom-time {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      background: rgba(41, 182, 246, 0.15);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .zoom-dur {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 1px 6px;
      border-radius: 8px;
    }

    .zoom-unlock-icon {
      --mdc-icon-size: 14px;
      color: #ff9800;
    }

    .zoom-track {
      height: 28px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      overflow: hidden;
    }

    .zoom-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .zoom-axis {
      display: flex;
      justify-content: space-between;
      margin-top: 2px;
      font-size: 0.62rem;
      color: var(--secondary-text-color);
      opacity: 0.7;
    }
  `,t([ut({attribute:!1})],xt.prototype,"hass",void 0),t([ut()],xt.prototype,"eventEntityId",void 0),t([ut()],xt.prototype,"contrabandEntityId",void 0),t([ut()],xt.prototype,"humanEntityId",void 0),t([ut()],xt.prototype,"lockEntityId",void 0),t([ut({type:Number})],xt.prototype,"historyHours",void 0),t([mt()],xt.prototype,"_show",void 0),t([mt()],xt.prototype,"_loading",void 0),t([mt()],xt.prototype,"_hasFetched",void 0),t([mt()],xt.prototype,"_error",void 0),t([mt()],xt.prototype,"_data",void 0),t([mt()],xt.prototype,"_lockData",void 0),t([mt()],xt.prototype,"_offsetPages",void 0),t([mt()],xt.prototype,"_zoom",void 0),customElements.define("onlycat-activity-history",xt);class wt extends lt{constructor(){super(...arguments),this._showRebootConfirm=!1}get _deviceId(){return this._config?.device_id??""}get _cameraEntityId(){return`camera.${this._deviceId}_last_activity_video`}get _lockEntityId(){return`binary_sensor.${this._deviceId}_lock`}get _connectivityEntityId(){return`binary_sensor.${this._deviceId}_connectivity`}get _policyEntityId(){return`select.${this._deviceId}_policy`}get _unlockEntityId(){return`button.${this._deviceId}_unlock`}get _rebootEntityId(){return`button.${this._deviceId}_reboot`}get _eventEntityId(){return`binary_sensor.${this._deviceId}_event`}get _contrabandEntityId(){return`binary_sensor.${this._deviceId}_contraband`}get _humanEntityId(){return`binary_sensor.${this._deviceId}_human`}get _lastActivityEntityId(){return`image.${this._deviceId}_last_activity_image`}get _errorsEntityId(){return`binary_sensor.${this._deviceId}_errors`}static getStubConfig(){return{name:"",device_id:"",show_title:!0}}static getConfigElement(){return document.createElement("onlycat-home-assistant-card-editor")}setConfig(t){if(!t)throw new Error("Invalid configuration.");this._config={name:t.name??"",device_id:t.device_id??"",show_title:!1!==t.show_title}}getCardSize(){return 5}_entity(t){return this.hass?.states?.[t]}_isOn(t){return"on"===this._entity(t)?.state}_t(t){return _t(this.hass,t)}_tf(t,e){return ft(this.hass,t,e)}_onUnlock(){this._entity(this._unlockEntityId)&&this.hass.callService("button","press",{entity_id:this._unlockEntityId})}_onRebootConfirm(){this._entity(this._rebootEntityId)&&(this.hass.callService("button","press",{entity_id:this._rebootEntityId}),this._showRebootConfirm=!1)}_onPolicyChange(t){const e=t.target.value;e&&this.hass.callService("select","select_option",{entity_id:this._policyEntityId,option:e})}_renderStatusPills(){const t=this._isOn(this._connectivityEntityId),e=!this._isOn(this._lockEntityId),i=this._isOn(this._errorsEntityId);return W`
      <div class="status-pills">
        ${i?W`<ha-icon
              icon="mdi:alert-circle"
              class="error-pill-icon"
              title="${_t(this.hass,"card.errors")}"
            ></ha-icon>`:Y}
        <div class="pill ${e?"pill--locked":"pill--unlocked"}">
          <ha-icon
            icon="${e?"mdi:lock":"mdi:lock-open-variant"}"
          ></ha-icon>
          <span
            >${_t(this.hass,e?"card.locked":"card.unlocked")}</span
          >
        </div>
        <div class="pill ${t?"pill--online":"pill--offline"}">
          <ha-icon icon="${t?"mdi:wifi":"mdi:wifi-off"}"></ha-icon>
          <span
            >${_t(this.hass,t?"card.connected":"card.offline")}</span
          >
        </div>
      </div>
    `}_renderPolicy(){const t=this._entity(this._policyEntityId),e=t?.attributes?.options??[],i=t?.state??"";return W`
      <div class="row-section">
        <ha-icon icon="mdi:home-clock" class="section-icon"></ha-icon>
        <span class="section-label">${_t(this.hass,"card.policy")}</span>
        ${t?W`
              <select
                class="policy-select"
                .value=${i}
                @change=${t=>this._onPolicyChange(t)}
              >
                ${e.map(t=>W`<option value="${t}" ?selected=${t===i}>
                      ${t}
                    </option>`)}
              </select>
            `:W`<span class="unavailable"
              >${_t(this.hass,"card.unavailable")}</span
            >`}
      </div>
    `}_renderActions(){return W`
      <div class="actions-row">
        <button
          class="action-btn action-btn--primary"
          @click=${()=>this._onUnlock()}
          title="${_t(this.hass,"actions.unlock_title")}"
        >
          <ha-icon icon="mdi:lock-open-variant"></ha-icon>
          <span>${_t(this.hass,"actions.unlock")}</span>
        </button>

        <button
          class="action-btn action-btn--secondary"
          @click=${()=>this._showRebootConfirm=!0}
          title="${_t(this.hass,"actions.restart_title")}"
        >
          <ha-icon icon="mdi:restart"></ha-icon>
          <span>${_t(this.hass,"actions.restart")}</span>
        </button>
      </div>
    `}_renderRebootModal(){return this._showRebootConfirm?W`
      <div
        class="modal-backdrop"
        @click=${t=>{t.target===t.currentTarget&&(this._showRebootConfirm=!1)}}
      >
        <div class="modal modal--confirm" role="dialog" aria-modal="true">
          <div class="modal-header">
            <ha-icon
              icon="mdi:alert-circle"
              style="color:var(--warning-color,#ff9800)"
            ></ha-icon>
            <span>${_t(this.hass,"confirm_restart.title")}</span>
            <button
              class="modal-close"
              @click=${()=>this._showRebootConfirm=!1}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="modal-body">
            <p>${_t(this.hass,"confirm_restart.question")}</p>
            <p class="confirm-note">
              ${_t(this.hass,"confirm_restart.note")}
            </p>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn--cancel"
              @click=${()=>this._showRebootConfirm=!1}
            >
              ${_t(this.hass,"actions.cancel")}
            </button>
            <button
              class="btn btn--danger"
              @click=${()=>this._onRebootConfirm()}
            >
              <ha-icon icon="mdi:restart"></ha-icon>
              ${_t(this.hass,"actions.restart")}
            </button>
          </div>
        </div>
      </div>
    `:Y}render(){if(!this.hass||!this._config)return Y;const t=this._config.name||_t(this.hass,"card.name_default");return this._config.device_id?W`
      <ha-card>
        ${this._config.show_title?W`
              <div class="card-header">
                <ha-icon icon="mdi:paw" class="header-icon"></ha-icon>
                <span class="header-title">${t}</span>
                ${this._renderStatusPills()}
              </div>
            `:W`<div class="card-header card-header--no-title">
              ${this._renderStatusPills()}
            </div>`}

        <div class="card-body">
          <onlycat-camera-panel
            .hass=${this.hass}
            .entityId=${this._cameraEntityId}
            .eventEntityId=${this._eventEntityId}
            .humanEntityId=${this._humanEntityId}
            .contrabandEntityId=${this._contrabandEntityId}
            .lastActivityEntityId=${this._lastActivityEntityId}
          ></onlycat-camera-panel>
          ${this._renderPolicy()} ${this._renderActions()}
          <onlycat-activity-history
            .hass=${this.hass}
            .eventEntityId=${this._eventEntityId}
            .contrabandEntityId=${this._contrabandEntityId}
            .humanEntityId=${this._humanEntityId}
            .lockEntityId=${this._lockEntityId}
            .historyHours=${24}
          ></onlycat-activity-history>
        </div>
      </ha-card>

      ${this._renderRebootModal()}
    `:W`
        <ha-card>
          <div
            class="card-body"
            style="text-align:center;color:var(--warning-color,#ff9800);padding:24px 16px;font-size:0.9rem;"
          >
            <ha-icon
              icon="mdi:alert-circle-outline"
              style="--mdc-icon-size:32px;display:block;margin:0 auto 8px;"
            ></ha-icon>
            ${_t(this.hass,"card.config_required")}
          </div>
        </ha-card>
      `}}wt.styles=n`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    /* ── Header ─────────────────────────────────────────────── */
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px 10px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
    }

    .card-header--no-title {
      justify-content: flex-end;
    }

    .header-icon {
      color: var(--primary-color);
      --mdc-icon-size: 22px;
      flex-shrink: 0;
    }

    .header-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Status pills ────────────────────────────────────────── */
    .status-pills {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .pill {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .pill ha-icon {
      --mdc-icon-size: 14px;
    }

    .pill--locked {
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }
    .pill--unlocked {
      background: rgba(255, 152, 0, 0.15);
      color: #ff9800;
    }
    .pill--online {
      background: rgba(33, 150, 243, 0.12);
      color: #29b6f6;
    }
    .pill--offline {
      background: rgba(244, 67, 54, 0.12);
      color: #ef5350;
    }
    .error-pill-icon {
      color: var(--error-color, #e53935);
      --mdc-icon-size: 24px;
      width: 24px;
      height: 24px;
      display: flex;
      flex-shrink: 0;
    }

    /* ── Body ────────────────────────────────────────────────── */
    .card-body {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* ── Shared row section ───────────────────────────────────── */
    .row-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-icon {
      color: var(--primary-color);
      --mdc-icon-size: 20px;
      flex-shrink: 0;
    }

    .section-label {
      font-size: 0.875rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .unavailable {
      font-size: 0.875rem;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* ── Policy select ────────────────────────────────────────── */
    .policy-select {
      flex: 1;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 0.875rem;
      cursor: pointer;
      min-width: 0;
    }

    /* ── Action buttons ───────────────────────────────────────── */
    .actions-row {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 12px;
      border: none;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition:
        filter 0.15s,
        transform 0.1s;
    }

    .action-btn:active {
      transform: scale(0.96);
      filter: brightness(0.9);
    }

    .action-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    .action-btn--primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .action-btn--secondary {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #ccc);
    }

    /* ── Modals ───────────────────────────────────────────────── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal {
      background: var(--card-background-color);
      border-radius: 14px;
      max-width: 520px;
      width: 92%;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      animation: slideUp 0.2s ease;
    }

    .modal--confirm {
      max-width: 380px;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
      font-weight: 600;
      font-size: 0.95rem;
    }

    .modal-header ha-icon:first-child {
      color: var(--primary-color);
    }

    .modal-close {
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: background 0.15s;
    }

    .modal-close:hover {
      background: var(--secondary-background-color);
    }

    .modal-body {
      padding: 16px;
    }

    .modal-body p {
      margin: 0 0 8px;
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }

    .confirm-note {
      color: var(--secondary-text-color) !important;
      font-size: 0.82rem !important;
    }

    .modal-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 10px 16px 14px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: filter 0.15s;
    }

    .btn:hover {
      filter: brightness(0.92);
    }

    .btn--cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc);
    }

    .btn--danger {
      background: var(--error-color, #ef5350);
      color: #fff;
    }

    .btn ha-icon {
      --mdc-icon-size: 16px;
    }
  `,t([ut({attribute:!1})],wt.prototype,"hass",void 0),t([mt()],wt.prototype,"_config",void 0),t([mt()],wt.prototype,"_showRebootConfirm",void 0),customElements.define("onlycat-home-assistant-card",wt),window.customCards=window.customCards||[],window.customCards.push({type:"onlycat-home-assistant-card",name:"OnlyCat Home Assistant Card",description:"Card to monitor and control your OnlyCat smart cat flap.",preview:!0,documentationURL:"https://github.com/OnlyCatAI/onlycat-home-assistant"});
//# sourceMappingURL=onlycat-home-assistant-card.js.map
