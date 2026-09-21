function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,_=g?g.emptyScript:"",y=m.reactiveElementPolyfillSupport,f=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??b)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,y?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,k=t=>t,E=w.trustedTypes,A=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+I,C=`<${S}>`,z=document,P=()=>z.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,N="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,H=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,W=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),q=W(1),V=W(2),F=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),Y=new WeakMap,Z=z.createTreeWalker(z,129);function J(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===U?"!--"===c[1]?r=R:void 0!==c[1]?r=D:void 0!==c[2]?(B.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=o??U,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?H:'"'===c[3]?L:j):r===L||r===j?r=H:r===R||r===D?r=U:(r=H,o=void 0);const h=r===H&&t[e+1].startsWith("/>")?" ":"";n+=r===U?i+C:l>=0?(s.push(a),i.slice(0,l)+T+i.slice(l)+I+h):i+I+(-2===l?e:h)}return[J(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=G.createElement(c,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(T)){const e=l[n++],i=s.getAttribute(t).split(I),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?st:"?"===r[1]?ot:"@"===r[1]?nt:it}),s.removeAttribute(t)}else t.startsWith(I)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(I),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),Z.nextNode(),a.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===S)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(I,t+1));)a.push({type:7,index:o}),t+=I.length-1}o++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===F)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=O(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);Z.currentNode=s;let o=Z.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=Z.nextNode(),n++)}return Z.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new et(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=Q(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==F,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,s[i+r],e,r),a===F&&(a=this._$AH[r]),n||=!O(a)||a!==this._$AH[r],a===K?t=K:t!==K&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class nt extends it{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??K)===F)return;const i=this._$AH,s=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==K&&(i===K||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(G,et),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new et(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},pt=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(t){return ut({...t,state:!0,attribute:!1})}const gt={en:{card:{name_default:"Cat Flap",config_required:"Please configure the OnlyCat card.",locked:"Locked",unlocked:"Unlocked",connected:"Connected",offline:"Offline",unavailable:"Unavailable",policy:"Policy",no_recent_activity:"No recent activity",errors:"Device errors"},actions:{unlock:"Unlock",unlock_title:"Unlock now",restart:"Restart",restart_title:"Restart the cat flap",cancel:"Cancel"},camera:{title:"Last activity",stream_unavailable:"Stream unavailable."},history:{title:"Activity history",loading:"Loading…",error:"Unable to load history.",passage_detected:"Passage detected",prey_detected:"Prey detected",human_detected:"Human detected",row_flap:"Passage",row_prey:"Prey",row_human:"Human",chart_now:"now",unlock_triggered:"Triggered by unlock button",kind_in:"In",kind_out:"Out",kind_in_attempt:"Tried to come in",kind_out_attempt:"Tried to go out",kind_unknown:"Passage",attempt:"Didn't go through",outside:"Outside",unknown_pet:"Unknown cat"},pets:{inside:"Inside",outside:"Outside",unknown:"Unknown"},time:{just_now:"just now",minutes_ago:"{n} min ago",hours_ago:"{h}h ago",hours_minutes_ago:"{h}h{m} ago",minutes:"{n} min",hours_minutes:"{h}h{m}",days:"{d} d"},confirm_restart:{title:"Confirm restart",question:"Are you sure you want to restart the cat flap?",note:"The cat flap will be temporarily offline during the restart."},editor:{card_name:"Card name",device:"OnlyCat device",device_hint:"Select the connectivity sensor of your OnlyCat device",show_title:"Show title",show_pets:"Show pets"}},fr:{card:{name_default:"Chatière",config_required:"Veuillez configurer la carte OnlyCat.",locked:"Verrouillé",unlocked:"Ouvert",connected:"Connecté",offline:"Hors ligne",unavailable:"Indisponible",policy:"Politique",no_recent_activity:"Aucune activité récente",errors:"Erreurs de l'appareil"},actions:{unlock:"Déverrouiller",unlock_title:"Déverrouiller maintenant",restart:"Redémarrer",restart_title:"Redémarrer la chatière",cancel:"Annuler"},camera:{title:"Dernière activité",stream_unavailable:"Flux indisponible."},history:{title:"Historique des activités",loading:"Chargement…",error:"Impossible de charger l'historique.",passage_detected:"Passage détecté",prey_detected:"Proie détectée",human_detected:"Humain détecté",row_flap:"Passage",row_prey:"Proie",row_human:"Humain",chart_now:"maintenant",unlock_triggered:"Déclenché par déverrouillage",kind_in:"Entrée",kind_out:"Sortie",kind_in_attempt:"Tentative d'entrée",kind_out_attempt:"Tentative de sortie",kind_unknown:"Passage",attempt:"Non passé",outside:"Dehors",unknown_pet:"Chat inconnu"},pets:{inside:"Dedans",outside:"Dehors",unknown:"Inconnu"},time:{just_now:"à l'instant",minutes_ago:"il y a {n} min",hours_ago:"il y a {h}h",hours_minutes_ago:"il y a {h}h{m}",minutes:"{n} min",hours_minutes:"{h}h{m}",days:"{d} j"},confirm_restart:{title:"Confirmer le redémarrage",question:"Êtes-vous sûr de vouloir redémarrer la chatière ?",note:"La chatière sera temporairement hors ligne pendant le redémarrage."},editor:{card_name:"Nom de la carte",device:"Appareil OnlyCat",device_hint:"Sélectionnez le capteur de connectivité de votre appareil OnlyCat",show_title:"Afficher le titre",show_pets:"Afficher les chats"}}};function _t(t,e){const i=e.indexOf("."),s=e.slice(0,i),o=e.slice(i+1),n=t[s];return"object"==typeof n?n[o]:void 0}function yt(t,e){return _t(gt[function(t){return(t?.locale?.language??t?.language??"en").toLowerCase().startsWith("fr")?"fr":"en"}(t)],e)??_t(gt.en,e)??e}function ft(t,e,i){let s=yt(t,e);for(const[t,e]of Object.entries(i))s=s.replace(`{${t}}`,String(e));return s}function vt(t){const e=t.match(/^binary_sensor\.(.+)_connectivity$/);return e?e[1]:t}class bt extends lt{_t(t){return yt(this.hass,t)}setConfig(t){this._config=t}_connectivityEntities(){return this.hass?.states?Object.keys(this.hass.states).filter(t=>/^binary_sensor\..+_connectivity$/.test(t)):[]}_valueChanged(t){const e=t.target,i=e.getAttribute("data-key");if(!i)return;let s=e.value;"checkbox"===e.type?s=e.checked:"number"===e.type&&(s=Number(e.value)),this._config={...this._config,[i]:s},this._fire()}_fire(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}get _selectedConnectivityEntity(){return this._config?.device_id?`binary_sensor.${this._config.device_id}_connectivity`:""}render(){if(!this._config)return q``;const t=this._connectivityEntities(),e=this._selectedConnectivityEntity;return q`
      <div class="editor">
        <!-- Card name -->
        <div class="field">
          <label>${yt(this.hass,"editor.card_name")}</label>
          <input
            type="text"
            data-key="name"
            .value=${this._config.name??""}
            placeholder="${yt(this.hass,"card.name_default")}"
            @input=${this._valueChanged}
          />
        </div>

        <!-- Device picker (via connectivity entity) -->
        <div class="field">
          <label>
            ${yt(this.hass,"editor.device")} <span class="required">*</span>
          </label>
          ${t.length>0?q`
                <select
                  class="entity-select"
                  .value=${e}
                  @change=${t=>{const e=t.target.value;e&&(this._config={...this._config,device_id:vt(e)},this._fire())}}
                >
                  <option value="" ?selected=${!e}>
                    — ${yt(this.hass,"editor.device")} —
                  </option>
                  ${t.map(t=>q`<option
                        value="${t}"
                        ?selected=${t===e}
                      >
                        ${t}
                      </option>`)}
                </select>
              `:q`
                <input
                  type="text"
                  data-key="device_id"
                  .value=${this._config.device_id??""}
                  placeholder="only_cat"
                  @input=${this._valueChanged}
                />
              `}
          <span class="hint">${yt(this.hass,"editor.device_hint")}</span>
          ${this._config.device_id?q`<code class="derived-id"
                >binary_sensor.${this._config.device_id}_connectivity</code
              >`:K}
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
            ${yt(this.hass,"editor.show_title")}
          </label>
        </div>

        <!-- Show pets -->
        <div class="field field--checkbox">
          <label>
            <input
              type="checkbox"
              data-key="show_pets"
              ?checked=${!1!==this._config.show_pets}
              @change=${this._valueChanged}
            />
            ${yt(this.hass,"editor.show_pets")}
          </label>
        </div>
      </div>
    `}}bt.styles=r`
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
  `,t([ut({attribute:!1})],bt.prototype,"hass",void 0),t([mt()],bt.prototype,"_config",void 0),customElements.define("onlycat-home-assistant-card-editor",bt);const $t="device_tracker.",xt="_tracker",wt=["#ec407a","#7e57c2","#5c6bc0","#8d6e63","#26c6da","#78909c"];function kt(t){return t?t.replace(/[’']s presence$/i,"").replace(/s Anwesenheit$/i,"").trim():""}function Et(t,e){const i=t?.states??{},s=e.pets??Object.keys(i).filter(e=>function(t,e){if(!e.startsWith($t)||!e.endsWith(xt))return!1;const i=t?.entities?.[e];return!i||"onlycat"===i.platform}(t,e)).sort();return s.map((t,e)=>{const s="string"==typeof t?{entity:t}:t,o=i[s.entity]?.attributes?.friendly_name,n=function(t){let e=t;return e.startsWith($t)&&(e=e.slice(15)),e.endsWith(xt)&&(e=e.slice(0,-8)),e.toLowerCase()}(s.entity);return{entityId:s.entity,rfid:n,name:s.name||kt(o)||n,color:s.color||wt[e%wt.length]}})}function At(t,e){const i=!e||"TRANSIT"===e;return"INWARD"===t?i?"in":"in_attempt":"OUTWARD"===t?i?"out":"out_attempt":"unknown"}function Tt(t){return!!t&&"home"!==t&&"unknown"!==t&&"unavailable"!==t}const It={in:"mdi:home-import-outline",out:"mdi:home-export-outline",in_attempt:"mdi:home-import-outline",out_attempt:"mdi:home-export-outline",unknown:"mdi:cat"},St={in:"var(--history-in-color, #43a047)",out:"var(--history-out-color, #fb8c00)",in_attempt:"var(--history-in-color, #43a047)",out_attempt:"var(--history-out-color, #fb8c00)",unknown:"var(--history-flap-color, #29b6f6)"};function Ct(t){return"in_attempt"===t||"out_attempt"===t}class zt extends lt{constructor(){super(...arguments),this.pets=[]}_renderLastPassage(){const t=this.eventEntityId?this.hass?.states?.[this.eventEntityId]?.attributes:void 0,e=At(t?.direction,t?.action);if("unknown"===e)return K;const i=t?.rfidCode?String(t.rfidCode).toLowerCase():void 0,s=i?this.pets.find(t=>t.rfid===i)?.name??yt(this.hass,"history.unknown_pet"):void 0,o=`history.kind_${e}`;return q`<span
      class="camera-passage ${Ct(e)?"camera-passage--attempt":""}"
      style="--passage-color: ${St[e]}"
    >
      <ha-icon icon="${It[e]}"></ha-icon>
      ${yt(this.hass,o)}${s?q` · ${s}`:K}
    </span>`}_entity(){return this.hass?.states?.[this.entityId]}_getSnapshotUrl(){const t=this._entity()?.attributes?.entity_picture;return t??null}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this.entityId}}))}_latestActivityTs(){if(this.lastActivityEntityId){const t=this.hass?.states?.[this.lastActivityEntityId];if(t){const e=t.state||t.attributes?.datetime||t.attributes?.last_activity||t.attributes?.created_at,i=new Date(e).getTime();if(!isNaN(i))return i}}const t=[this.eventEntityId,this.humanEntityId,this.contrabandEntityId];let e=null;for(const i of t){if(!i)continue;const t=this.hass?.states?.[i]?.last_changed;if(!t)continue;const s=new Date(t).getTime();!isNaN(s)&&(null===e||s>e)&&(e=s)}return e}_relativeTime(t){if(!t)return"";const e=new Date(t);if(isNaN(e.getTime()))return"";const i=Math.round((Date.now()-e.getTime())/6e4);if(i<1)return yt(this.hass,"time.just_now");if(i<60)return ft(this.hass,"time.minutes_ago",{n:i});const s=Math.floor(i/60),o=i%60;return 0===o?ft(this.hass,"time.hours_ago",{h:s}):ft(this.hass,"time.hours_minutes_ago",{h:s,m:String(o).padStart(2,"0")})}render(){const t=this._getSnapshotUrl(),e=this._latestActivityTs();return q`
      <div
        class="camera-panel ${t?"camera-panel--clickable":""}"
        @click=${()=>{t&&this._openMoreInfo()}}
      >
        ${t?q`
              <img
                src="${t}"
                alt="${yt(this.hass,"camera.title")}"
                class="camera-img"
              />
              <div class="camera-overlay">
                <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                ${null!==e?q`<span class="camera-ts"
                      >${this._relativeTime(new Date(e).toISOString())}</span
                    >`:K}
                ${this._renderLastPassage()}
              </div>
            `:q`
              <div class="camera-placeholder">
                <ha-icon icon="mdi:paw"></ha-icon>
                <span>${yt(this.hass,"card.no_recent_activity")}</span>
              </div>
            `}
      </div>
    `}}zt.styles=r`
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

    .camera-passage {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px 2px 6px;
      border-radius: 99px;
      background: var(--passage-color);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .camera-passage ha-icon {
      --mdc-icon-size: 15px;
    }

    .camera-passage--attempt {
      background: rgba(0, 0, 0, 0.45);
      border: 1.5px dashed var(--passage-color);
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
  `,t([ut({attribute:!1})],zt.prototype,"hass",void 0),t([ut()],zt.prototype,"entityId",void 0),t([ut()],zt.prototype,"eventEntityId",void 0),t([ut()],zt.prototype,"humanEntityId",void 0),t([ut()],zt.prototype,"contrabandEntityId",void 0),t([ut()],zt.prototype,"lastActivityEntityId",void 0),t([ut({attribute:!1})],zt.prototype,"pets",void 0),customElements.define("onlycat-camera-panel",zt);const Pt={in:"history.kind_in",out:"history.kind_out",in_attempt:"history.kind_in_attempt",out_attempt:"history.kind_out_attempt",unknown:"history.kind_unknown"};class Ot extends lt{constructor(){super(...arguments),this.pets=[],this.historyHours=24,this._show=!1,this._loading=!1,this._hasFetched=!1,this._error=null,this._passages=[],this._prey=[],this._human=[],this._lockData=[],this._outside={},this._offsetPages=0,this._zoom=null}_timeWindow(){const t=new Date;t.setHours(0,0,0,0);const e=new Date(t.getTime()-864e5*this._offsetPages),i=0===this._offsetPages?new Date:new Date(e.getTime()+864e5);return{start:e,end:i}}_isEntityOn(t){return"on"===this.hass?.states?.[t]?.state}static _ts(t){return 1e3*(t.lc??t.lu)}static _periods(t,e,i,s){const o=s-i,n=[];let r=null;for(const s of t){const t=Math.max(i,Ot._ts(s)),a=e(s.s);a&&null===r?r=t:a||null===r||(n.push({start:(r-i)/o,end:Math.min(1,(t-i)/o),startTs:r,endTs:t}),r=null)}return null!==r&&n.push({start:(r-i)/o,end:1,startTs:r,endTs:s}),n}static _parsePassages(t,e,i){const s=i-e,o=[],n=new Map,r=new Map;let a=null;for(const s of t){const t=Math.max(e,Ot._ts(s)),c=s.a??{},l="number"==typeof c.eventId?c.eventId:void 0,d="on"===s.s;d&&(!a||void 0!==l&&void 0!==a.eventId&&l!==a.eventId)&&(a&&(a.endTs=t),a={start:0,end:0,startTs:t,endTs:i,eventId:l,kind:"unknown",rfids:[]},o.push(a),r.set(a,{}));let h=void 0!==l?n.get(l):void 0;if(!h&&d&&a&&(h=a),h){void 0===h.eventId&&void 0!==l&&(h.eventId=l),void 0!==h.eventId&&n.set(h.eventId,h);const t=r.get(h);c.direction&&(t.direction=c.direction),c.action&&(t.action=c.action);const e=[...c.rfidCode?[c.rfidCode]:[],...Array.isArray(c.rfidCodes)?c.rfidCodes:[]];for(const t of e){const e=String(t).toLowerCase();h.rfids.includes(e)||h.rfids.push(e)}}!d&&a&&(a.endTs=t,a=null)}for(const t of o){const i=r.get(t);t.kind=At(i.direction,i.action),t.start=(t.startTs-e)/s,t.end=Math.min(1,(t.endTs-e)/s)}return o}async _load(){if(!this._loading){this._loading=!0,this._error=null;try{const{start:t,end:e}=this._timeWindow(),i=t.getTime(),s=e.getTime(),o=[this.eventEntityId,this.contrabandEntityId,this.humanEntityId,...this.lockEntityId?[this.lockEntityId]:[],...this.pets.map(t=>t.entityId)],n=await this.hass.callWS({type:"history/history_during_period",start_time:t.toISOString(),end_time:e.toISOString(),entity_ids:o,include_start_time_state:!0,significant_changes_only:!1,minimal_response:!1,no_attributes:!1}),r=t=>t&&n?.[t]||[],a=t=>"on"===t;this._passages=Ot._parsePassages(r(this.eventEntityId),i,s),this._prey=Ot._periods(r(this.contrabandEntityId),a,i,s),this._human=Ot._periods(r(this.humanEntityId),a,i,s),this._lockData=Ot._periods(r(this.lockEntityId),a,i,s);const c={};for(const t of this.pets)c[t.rfid]=Ot._periods(r(t.entityId),Tt,i,s);this._outside=c,console.debug("[OnlyCat] history parsed",`passages:${this._passages.length}`,`prey:${this._prey.length}`,`human:${this._human.length}`,this._passages.map(t=>`${new Date(t.startTs).toISOString()} #${t.eventId??"?"} ${t.kind} [${t.rfids.join(",")}]`)),this._hasFetched=!0}catch(t){console.error("[OnlyCat] history error",t),this._error=yt(this.hass,"history.error")}finally{this._loading=!1}}}_toggle(){this._show=!this._show,this._show&&this._load()}_navPrev(){this._offsetPages++,this._zoom=null,this._load()}_navNext(){this._offsetPages>0&&(this._offsetPages--,this._zoom=null,this._load())}_formatDateRange(){const{start:t}=this._timeWindow(),e=this.hass?.locale?.language??"en";return new Intl.DateTimeFormat(e,{weekday:"short",month:"short",day:"numeric"}).format(t)}_axisLabels(){const{start:t,end:e}=this._timeWindow(),i=e.getTime()-t.getTime(),s=t=>{const e=t.getHours(),i=t.getMinutes();return 0===i?`${e}h`:`${e}h${String(i).padStart(2,"0")}`},o=[];for(let n=0;n<=24;n+=6){const r=t.getTime()+36e5*n;if(r>e.getTime()+1)break;const a=Math.min(1,(r-t.getTime())/i);o.push({label:0===n?"0h":s(new Date(r)),frac:a})}if(0===this._offsetPages){(o[o.length-1]?.frac??0)<.97&&o.push({label:s(e),frac:1})}return o}_formatTooltip(t,e){const i=this.hass?.locale?.language??"en",s=t=>t.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit"}),o=Math.round((e-t)/1e3),n=o<60?`${o}s`:o<3600?`${Math.floor(o/60)}min${o%60>0?" "+o%60+"s":""}`:`${Math.floor(o/3600)}h ${Math.floor(o%3600/60)}min`;return`${s(new Date(t))} – ${s(new Date(e))} (${n})`}_kindLabel(t){return yt(this.hass,Pt[t])}_petNames(t){return t.rfids.map(t=>this.pets.find(e=>e.rfid===t)?.name??yt(this.hass,"history.unknown_pet"))}_passageTooltip(t){return[this._formatTooltip(t.startTs,t.endTs),this._kindLabel(t.kind),...this._petNames(t)].join(" · ")}static _isPassage(t){return"kind"in t}_rows(){const t=this.pets.map(t=>({key:`pet:${t.rfid}`,label:t.name,color:t.color,events:this._passages.filter(e=>e.rfids.includes(t.rfid)),background:this._outside[t.rfid]??[],passages:!0}));return[{key:"flap",label:yt(this.hass,"history.row_flap"),color:"var(--history-flap-color, #29b6f6)",events:this._passages,passages:!0},...t,{key:"prey",label:yt(this.hass,"history.row_prey"),color:"var(--history-contraband-color, #e53935)",events:this._prey,passages:!1},{key:"human",label:yt(this.hass,"history.row_human"),color:"var(--history-human-color, #ab47bc)",events:this._human,passages:!1}]}_onBarEnter(t,e){clearTimeout(this._zoomTimer),this._zoom={centerTs:(e.startTs+e.endTs)/2,highlightStartTs:e.startTs,highlightEndTs:e.endTs,color:t.color,label:t.label,rowKey:t.key,eventIndex:t.events.indexOf(e)}}_zoomNavigate(t){if(!this._zoom)return;const e=this._rows().find(t=>t.key===this._zoom.rowKey)?.events??[],i=this._zoom.eventIndex+t;if(i<0||i>=e.length)return;const s=e[i];this._zoom={...this._zoom,eventIndex:i,centerTs:(s.startTs+s.endTs)/2,highlightStartTs:s.startTs,highlightEndTs:s.endTs}}_onBarLeave(){clearTimeout(this._zoomTimer),this._zoomTimer=setTimeout(()=>{this._zoom=null},200)}_renderBar(t,e,i,s,o,n){const r=Ot._isPassage(e)?e:null,a=r?St[r.kind]:t.color,c=r?this._passageTooltip(r):this._formatTooltip(e.startTs,e.endTs),l=r&&Ct(r.kind)?`fill: ${a}; fill-opacity: 0.2; stroke: ${a}; stroke-width: 1.5; stroke-dasharray: 3 2;`:`fill: ${a}; stroke: rgba(255,255,255,0.5); stroke-width: 0.5;`;return V`<g
        class="event-bar"
        @mouseenter=${n?i=>{i.stopPropagation(),this._onBarEnter(t,e)}:null}
      >
      <title>${c}</title>
      <rect x="${i}" y="4" width="${s}" height="20" rx="3"
        style="${l}" opacity="${o}" />
    </g>`}_renderOutside(t,e){const i=yt(this.hass,"history.outside");return(t.background??[]).map(s=>{const[o,n]=e(s);return V`<g>
        <title>${i} ${this._formatTooltip(s.startTs,s.endTs)}</title>
        <rect x="${o}" y="9" width="${Math.max(1,n-o)}" height="10"
          rx="2" class="outside-bar" style="fill: ${t.color};" />
      </g>`})}_renderZoom(t){const e=this._zoom,i=e.highlightEndTs-e.highlightStartTs,s=Math.max(18e5,Math.min(72e5,30*i)),o=e.centerTs-s/2,n=e.centerTs+s/2,r=s,a=t=>Math.min(600,Math.max(0,(t-o)/r*600)),c=this.hass?.locale?.language??"en",l=t=>{const e=new Date(t),i=e.getMinutes();return`${e.getHours()}h${i>0?String(i).padStart(2,"0"):""}`},d=Math.round((e.highlightEndTs-e.highlightStartTs)/1e3),h=d<60?`${d}s`:`${Math.floor(d/60)}min${d%60?" "+d%60+"s":""}`,p=t.passages&&this._lockData.some(t=>t.startTs<=e.highlightEndTs+3e4&&t.endTs>=e.highlightStartTs-3e4),u=t.events,m=u[e.eventIndex],g=m&&Ot._isPassage(m)?m:null,_=g?this._petNames(g):[],y=u.filter(t=>t.endTs>=o&&t.startTs<=n);return q`
      <div
        class="zoom-overlay"
        @mouseenter=${()=>clearTimeout(this._zoomTimer)}
        @mouseleave=${this._onBarLeave}
      >
        <div class="zoom-header-info">
          <span class="zoom-time">${f=e.highlightStartTs,new Date(f).toLocaleTimeString(c,{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
          <span class="zoom-dur">${h}</span>
          ${g&&"unknown"!==g.kind?q`<span
                class="zoom-kind"
                style="color: ${St[g.kind]}"
              >
                <ha-icon icon="${It[g.kind]}"></ha-icon>
                ${this._kindLabel(g.kind)}
              </span>`:K}
          ${_.length?q`<span class="zoom-pets">${_.join(", ")}</span>`:K}
          ${p?q`<ha-icon
                icon="mdi:lock-open-variant"
                class="zoom-unlock-icon"
                title="${yt(this.hass,"history.unlock_triggered")}"
              ></ha-icon>`:K}
        </div>
        <div class="zoom-header-nav">
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${0===e.eventIndex}
            @click=${t=>{t.stopPropagation(),this._zoomNavigate(-1)}}
            title="Previous event"
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button
            class="nav-btn zoom-nav-btn"
            ?disabled=${e.eventIndex>=u.length-1}
            @click=${t=>{t.stopPropagation(),this._zoomNavigate(1)}}
            title="Next event"
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>
        <div class="zoom-track">
          <svg class="zoom-svg" viewBox="0 0 600 28" preserveAspectRatio="none">
            ${this._renderOutside(t,t=>[a(t.startTs),a(t.endTs)])}
            ${y.map(i=>{const s=a(i.startTs),o=Math.max(4,a(i.endTs)-s),n=i.startTs===e.highlightStartTs&&i.endTs===e.highlightEndTs;return this._renderBar(t,i,s,o,n?"1":"0.35",!1)})}
          </svg>
        </div>
        <div class="zoom-axis">
          <span>${l(o)}</span>
          <span>${l(e.centerTs)}</span>
          <span>${l(n)}</span>
        </div>
      </div>
    `;var f}_renderLegend(){const t=this._passages.some(t=>"unknown"!==t.kind),e=this._passages.some(t=>Ct(t.kind));return t||this.pets.length?q`
      <div class="chart-legend">
        ${t?["in","out"].map(t=>q`<span class="legend-item">
                  <span
                    class="legend-swatch"
                    style="background: ${St[t]}"
                  ></span>
                  ${this._kindLabel(t)}
                </span>`):K}
        ${e?q`<span class="legend-item">
              <span class="legend-swatch legend-swatch--attempt"></span>
              ${yt(this.hass,"history.attempt")}
            </span>`:K}
        ${this.pets.length?q`<span class="legend-item">
              <span class="legend-swatch legend-swatch--outside"></span>
              ${yt(this.hass,"history.outside")}
            </span>`:K}
      </div>
    `:K}_renderChart(){const t=this._rows();return q`
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
          ${t.map(t=>q`
              <div class="chart-row">
                <span
                  class="chart-label"
                  style="color: ${t.color}"
                  title="${t.label}"
                  >${t.label}</span
                >
                <div class="chart-track">
                  <svg
                    class="chart-svg"
                    viewBox="0 0 600 28"
                    preserveAspectRatio="none"
                    @mouseleave=${this._onBarLeave}
                  >
                    ${this._renderOutside(t,t=>[600*t.start,600*t.end])}
                    ${t.events.map(e=>this._renderBar(t,e,Math.max(0,600*e.start),Math.max(4,600*(e.end-e.start)),"0.85",!0))}
                  </svg>
                </div>
                <span class="chart-count">${t.events.length}</span>
                ${this._zoom?.rowKey===t.key?this._renderZoom(t):K}
              </div>
            `)}
        </div>

        <div class="chart-axis">
          <div></div>
          <div class="chart-axis-inner">
            ${this._axisLabels().map(({label:t,frac:e})=>q`<span style="left: ${100*e}%">${t}</span>`)}
          </div>
          <div></div>
        </div>
        ${this._renderLegend()}
      </div>
    `}render(){const t=this._isEntityOn(this.eventEntityId),e=this._isEntityOn(this.contrabandEntityId),i=this._isEntityOn(this.humanEntityId);return q`
      <div class="event-section">
        <button
          class="history-toggle ${this._show?"history-toggle--open":""}"
          @click=${this._toggle}
        >
          <ha-icon icon="mdi:chart-timeline-variant"></ha-icon>
          <span>${yt(this.hass,"history.title")}</span>

          ${t?q`<span
                class="event-badge event-badge--flap"
                title="${yt(this.hass,"history.passage_detected")}"
              >
                <ha-icon icon="mdi:cat"></ha-icon>
              </span>`:K}
          ${e?q`<span
                class="event-badge event-badge--contraband"
                title="${yt(this.hass,"history.prey_detected")}"
              >
                <ha-icon icon="mdi:rodent"></ha-icon>
              </span>`:K}
          ${i?q`<span
                class="event-badge event-badge--human"
                title="${yt(this.hass,"history.human_detected")}"
              >
                <ha-icon icon="mdi:account"></ha-icon>
              </span>`:K}

          <ha-icon
            class="chevron"
            icon="${this._show?"mdi:chevron-up":"mdi:chevron-down"}"
          ></ha-icon>
        </button>

        ${this._show?this._loading&&!this._hasFetched?q`<div class="history-status">
                <ha-circular-progress
                  active
                  size="small"
                ></ha-circular-progress>
                <span>${yt(this.hass,"history.loading")}</span>
              </div>`:this._error?q`<div class="history-status history-status--error">
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                  <span>${this._error}</span>
                </div>`:this._renderChart():K}
      </div>
    `}}Ot.styles=r`
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
      grid-template-columns: 64px 1fr 28px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .outside-bar {
      opacity: 0.28;
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
      grid-template-columns: 64px 1fr 28px;
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
      left: 70px;
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
    .zoom-kind {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .zoom-kind ha-icon {
      --mdc-icon-size: 14px;
    }

    .zoom-pets {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    /* ── Legend ──────────────────────────────────────────── */
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 12px;
      margin-top: 6px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .legend-swatch--attempt {
      border: 1.5px dashed var(--secondary-text-color);
      box-sizing: border-box;
    }

    .legend-swatch--outside {
      height: 5px;
      background: var(--secondary-text-color);
      opacity: 0.4;
    }
  `,t([ut({attribute:!1})],Ot.prototype,"hass",void 0),t([ut()],Ot.prototype,"eventEntityId",void 0),t([ut()],Ot.prototype,"contrabandEntityId",void 0),t([ut()],Ot.prototype,"humanEntityId",void 0),t([ut()],Ot.prototype,"lockEntityId",void 0),t([ut({attribute:!1})],Ot.prototype,"pets",void 0),t([ut({type:Number})],Ot.prototype,"historyHours",void 0),t([mt()],Ot.prototype,"_show",void 0),t([mt()],Ot.prototype,"_loading",void 0),t([mt()],Ot.prototype,"_hasFetched",void 0),t([mt()],Ot.prototype,"_error",void 0),t([mt()],Ot.prototype,"_passages",void 0),t([mt()],Ot.prototype,"_prey",void 0),t([mt()],Ot.prototype,"_human",void 0),t([mt()],Ot.prototype,"_lockData",void 0),t([mt()],Ot.prototype,"_outside",void 0),t([mt()],Ot.prototype,"_offsetPages",void 0),t([mt()],Ot.prototype,"_zoom",void 0),customElements.define("onlycat-activity-history",Ot);class Mt extends lt{constructor(){super(...arguments),this.pets=[]}_since(t){const e=t?new Date(t).getTime():NaN;if(isNaN(e))return"";const i=Math.max(0,Math.floor((Date.now()-e)/6e4));if(i<1)return yt(this.hass,"time.just_now");if(i<60)return ft(this.hass,"time.minutes",{n:i});const s=Math.floor(i/60);return s<24?ft(this.hass,"time.hours_minutes",{h:s,m:String(i%60).padStart(2,"0")}):ft(this.hass,"time.days",{d:Math.floor(s/24)})}_openMoreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))}render(){return this.pets.length?q`
      <div class="pets">
        ${this.pets.map(t=>{const e=this.hass?.states?.[t.entityId],i=Tt(e?.state),s="home"===e?.state||i,o=yt(this.hass,s?i?"pets.outside":"pets.inside":"pets.unknown"),n=s?this._since(e.last_changed):"";return q`
            <button
              class="pet ${s?i?"pet--outside":"pet--inside":"pet--unknown"}"
              style="--pet-color: ${t.color}"
              title="${t.name} · ${o}${n?` · ${n}`:""}"
              @click=${()=>this._openMoreInfo(t.entityId)}
            >
              <ha-icon
                icon="${i?"mdi:tree-outline":"mdi:home-outline"}"
              ></ha-icon>
              <span class="pet-name">${t.name}</span>
              <span class="pet-state"
                >${o}${n?q` · ${n}`:K}</span
              >
            </button>
          `})}
      </div>
    `:K}}Mt.styles=r`
    :host {
      display: block;
    }

    .pets {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .pet {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      padding: 5px 10px 5px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-left: 3px solid var(--pet-color);
      border-radius: 9px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 0.8rem;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .pet:hover {
      border-color: var(--pet-color);
    }

    .pet ha-icon {
      --mdc-icon-size: 16px;
      flex-shrink: 0;
    }

    .pet--inside ha-icon {
      color: var(--history-in-color, #43a047);
    }

    .pet--outside ha-icon {
      color: var(--history-out-color, #fb8c00);
    }

    .pet--unknown {
      opacity: 0.6;
    }

    .pet-name {
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pet-state {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
  `,t([ut({attribute:!1})],Mt.prototype,"hass",void 0),t([ut({attribute:!1})],Mt.prototype,"pets",void 0),customElements.define("onlycat-pet-status",Mt);class Nt extends lt{constructor(){super(...arguments),this._showRebootConfirm=!1}get _deviceId(){return this._config?.device_id??""}get _cameraEntityId(){return`camera.${this._deviceId}_last_activity_video`}get _lockEntityId(){return`binary_sensor.${this._deviceId}_lock`}get _connectivityEntityId(){return`binary_sensor.${this._deviceId}_connectivity`}get _policyEntityId(){return`select.${this._deviceId}_policy`}get _unlockEntityId(){return`button.${this._deviceId}_unlock`}get _rebootEntityId(){return`button.${this._deviceId}_reboot`}get _eventEntityId(){return`binary_sensor.${this._deviceId}_event`}get _contrabandEntityId(){return`binary_sensor.${this._deviceId}_contraband`}get _humanEntityId(){return`binary_sensor.${this._deviceId}_human`}get _lastActivityEntityId(){return`image.${this._deviceId}_last_activity_image`}get _errorsEntityId(){return`binary_sensor.${this._deviceId}_errors`}static getStubConfig(){return{name:"",device_id:"",show_title:!0}}static getConfigElement(){return document.createElement("onlycat-home-assistant-card-editor")}setConfig(t){if(!t)throw new Error("Invalid configuration.");this._config={name:t.name??"",device_id:t.device_id??"",show_title:!1!==t.show_title,show_pets:!1!==t.show_pets,...t.pets?{pets:t.pets}:{}}}getCardSize(){return 5}get _pets(){const t=Et(this.hass,this._config),e=JSON.stringify(t);return this._petsCache?.key!==e&&(this._petsCache={key:e,pets:t}),this._petsCache.pets}_entity(t){return this.hass?.states?.[t]}_isOn(t){return"on"===this._entity(t)?.state}_t(t){return yt(this.hass,t)}_tf(t,e){return ft(this.hass,t,e)}_onUnlock(){this._entity(this._unlockEntityId)&&this.hass.callService("button","press",{entity_id:this._unlockEntityId})}_onRebootConfirm(){this._entity(this._rebootEntityId)&&(this.hass.callService("button","press",{entity_id:this._rebootEntityId}),this._showRebootConfirm=!1)}_onPolicyChange(t){const e=t.target.value;e&&this.hass.callService("select","select_option",{entity_id:this._policyEntityId,option:e})}_renderStatusPills(){const t=this._isOn(this._connectivityEntityId),e=!this._isOn(this._lockEntityId),i=this._isOn(this._errorsEntityId);return q`
      <div class="status-pills">
        ${i?q`<ha-icon
              icon="mdi:alert-circle"
              class="error-pill-icon"
              title="${yt(this.hass,"card.errors")}"
            ></ha-icon>`:K}
        <div class="pill ${e?"pill--locked":"pill--unlocked"}">
          <ha-icon
            icon="${e?"mdi:lock":"mdi:lock-open-variant"}"
          ></ha-icon>
          <span
            >${yt(this.hass,e?"card.locked":"card.unlocked")}</span
          >
        </div>
        <div class="pill ${t?"pill--online":"pill--offline"}">
          <ha-icon icon="${t?"mdi:wifi":"mdi:wifi-off"}"></ha-icon>
          <span
            >${yt(this.hass,t?"card.connected":"card.offline")}</span
          >
        </div>
      </div>
    `}_renderPolicy(){const t=this._entity(this._policyEntityId),e=t?.attributes?.options??[],i=t?.state??"";return q`
      <div class="row-section">
        <ha-icon icon="mdi:home-clock" class="section-icon"></ha-icon>
        <span class="section-label">${yt(this.hass,"card.policy")}</span>
        ${t?q`
              <select
                class="policy-select"
                .value=${i}
                @change=${t=>this._onPolicyChange(t)}
              >
                ${e.map(t=>q`<option value="${t}" ?selected=${t===i}>
                      ${t}
                    </option>`)}
              </select>
            `:q`<span class="unavailable"
              >${yt(this.hass,"card.unavailable")}</span
            >`}
      </div>
    `}_renderActions(){return q`
      <div class="actions-row">
        <button
          class="action-btn action-btn--primary"
          @click=${()=>this._onUnlock()}
          title="${yt(this.hass,"actions.unlock_title")}"
        >
          <ha-icon icon="mdi:lock-open-variant"></ha-icon>
          <span>${yt(this.hass,"actions.unlock")}</span>
        </button>

        <button
          class="action-btn action-btn--secondary"
          @click=${()=>this._showRebootConfirm=!0}
          title="${yt(this.hass,"actions.restart_title")}"
        >
          <ha-icon icon="mdi:restart"></ha-icon>
          <span>${yt(this.hass,"actions.restart")}</span>
        </button>
      </div>
    `}_renderRebootModal(){return this._showRebootConfirm?q`
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
            <span>${yt(this.hass,"confirm_restart.title")}</span>
            <button
              class="modal-close"
              @click=${()=>this._showRebootConfirm=!1}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="modal-body">
            <p>${yt(this.hass,"confirm_restart.question")}</p>
            <p class="confirm-note">
              ${yt(this.hass,"confirm_restart.note")}
            </p>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn--cancel"
              @click=${()=>this._showRebootConfirm=!1}
            >
              ${yt(this.hass,"actions.cancel")}
            </button>
            <button
              class="btn btn--danger"
              @click=${()=>this._onRebootConfirm()}
            >
              <ha-icon icon="mdi:restart"></ha-icon>
              ${yt(this.hass,"actions.restart")}
            </button>
          </div>
        </div>
      </div>
    `:K}render(){if(!this.hass||!this._config)return K;const t=this._config.name||yt(this.hass,"card.name_default"),e=this._pets;return this._config.device_id?q`
      <ha-card>
        ${this._config.show_title?q`
              <div class="card-header">
                <ha-icon icon="mdi:paw" class="header-icon"></ha-icon>
                <span class="header-title">${t}</span>
                ${this._renderStatusPills()}
              </div>
            `:q`<div class="card-header card-header--no-title">
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
            .pets=${e}
          ></onlycat-camera-panel>
          ${this._config.show_pets?q`<onlycat-pet-status
                .hass=${this.hass}
                .pets=${e}
              ></onlycat-pet-status>`:K}
          ${this._renderPolicy()} ${this._renderActions()}
          <onlycat-activity-history
            .hass=${this.hass}
            .eventEntityId=${this._eventEntityId}
            .contrabandEntityId=${this._contrabandEntityId}
            .humanEntityId=${this._humanEntityId}
            .lockEntityId=${this._lockEntityId}
            .pets=${e}
            .historyHours=${24}
          ></onlycat-activity-history>
        </div>
      </ha-card>

      ${this._renderRebootModal()}
    `:q`
        <ha-card>
          <div
            class="card-body"
            style="text-align:center;color:var(--warning-color,#ff9800);padding:24px 16px;font-size:0.9rem;"
          >
            <ha-icon
              icon="mdi:alert-circle-outline"
              style="--mdc-icon-size:32px;display:block;margin:0 auto 8px;"
            ></ha-icon>
            ${yt(this.hass,"card.config_required")}
          </div>
        </ha-card>
      `}}Nt.styles=r`
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
  `,t([ut({attribute:!1})],Nt.prototype,"hass",void 0),t([mt()],Nt.prototype,"_config",void 0),t([mt()],Nt.prototype,"_showRebootConfirm",void 0),customElements.define("onlycat-home-assistant-card",Nt),window.customCards=window.customCards||[],window.customCards.push({type:"onlycat-home-assistant-card",name:"OnlyCat Home Assistant Card",description:"Card to monitor and control your OnlyCat smart cat flap.",preview:!0,documentationURL:"https://github.com/OnlyCatAI/onlycat-home-assistant"});
//# sourceMappingURL=onlycat-home-assistant-card.js.map
