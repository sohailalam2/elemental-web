import{_ as s,c as n,o as a,a as e}from"./app.ee22a17e.js";const u=JSON.parse('{"title":"Component Registration","description":"","frontmatter":{},"headers":[],"relativePath":"elemental-component/component-registry/component-registration.md"}'),l={name:"elemental-component/component-registry/component-registration.md"},t=e(`<h1 id="component-registration" tabindex="-1">Component Registration <a class="header-anchor" href="#component-registration" aria-hidden="true">#</a></h1><p>The registration capabilities offered by <code>ElementalComponentRegistry</code> are also available through <code>ElementalComponent</code>. Therefore, it is not mandatory to use the Registry to register your components and templates. The static method <code>register()</code> provided by <code>ElementalComponent</code> can also be used to register components directly.</p><h2 id="register-a-component" tabindex="-1">Register a Component <a class="header-anchor" href="#register-a-component" aria-hidden="true">#</a></h2><p>All custom elements MUST be registered before they can be instantiated, not doing so will result in an <code>ElementalComponentIsNotRegisteredException</code> exception.</p><div class="warning custom-block"><p class="custom-block-title">👺 Register Your Component</p><p>Register your components before you use.</p></div><h3 id="method-signature" tabindex="-1">Method Signature <a class="header-anchor" href="#method-signature" aria-hidden="true">#</a></h3><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki slack-dark vp-code-dark"><code><span class="line"><span style="color:#C586C0;">export</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">class</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">ElementalComponentRegistry</span><span style="color:#E6E6E6;"> {</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#569CD6;">public</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">static</span><span style="color:#E6E6E6;"> </span><span style="color:#DCDCAA;">registerComponent</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">element</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">Class</span><span style="color:#E6E6E6;">&lt;</span><span style="color:#4EC9B0;">HTMLElement</span><span style="color:#E6E6E6;">&gt;, </span><span style="color:#9CDCFE;">options</span><span style="color:#D4D4D4;">?:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">RegistrationOptions</span><span style="color:#E6E6E6;">)</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">void</span><span style="color:#E6E6E6;"> {}</span></span>
<span class="line"><span style="color:#E6E6E6;">}</span></span>
<span class="line"></span></code></pre><pre class="shiki slack-ochin vp-code-light"><code><span class="line"><span style="color:#7B30D0;">export</span><span style="color:#002339;"> </span><span style="color:#0991B6;">class</span><span style="color:#002339;"> </span><span style="color:#0444AC;">ElementalComponentRegistry</span><span style="color:#002339;"> {</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#DA5221;">public</span><span style="color:#002339;"> </span><span style="color:#DA5221;">static</span><span style="color:#002339;"> </span><span style="color:#7EB233;">registerComponent</span><span style="color:#002339;">(</span><span style="color:#B1108E;">element</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">Class</span><span style="color:#002339;">&lt;</span><span style="color:#0444AC;">HTMLElement</span><span style="color:#002339;">&gt;, </span><span style="color:#B1108E;">options</span><span style="color:#7B30D0;">?:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">RegistrationOptions</span><span style="color:#002339;">)</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">void</span><span style="color:#002339;"> {}</span></span>
<span class="line"><span style="color:#002339;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="tip custom-block"><p class="custom-block-title">💁 Auto generated ID</p><p>All custom elements when instantiated will get an auto-generated <code>id</code> if one is not provided</p></div><h3 id="registrationoptions" tabindex="-1">RegistrationOptions <a class="header-anchor" href="#registrationoptions" aria-hidden="true">#</a></h3><table><thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td>prefix</td><td><code>ElementalComponentPrefix</code></td><td>The custom prefix for the element. Defaults to <code>el-</code> prefix</td></tr><tr><td>templateId</td><td><code>string</code></td><td>The ID of the template that should be used as a template for this component This option allows us to reuse existing templates</td></tr><tr><td>template</td><td><code>string</code></td><td>The template HTML that should be registered along with the template registration.</td></tr><tr><td>styles</td><td><code>string</code></td><td>Styles that will be registered as a style element in the component root</td></tr><tr><td>extends</td><td><code>string</code></td><td>👺 <code>deprecated</code> do NOT use! <br> <br> The extension of native HTML components is not supported by Safari. The team has decided to not support it in the future either. So use this functionality with caution</td></tr></tbody></table><h3 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h3><h4 id="registering-with-default-prefix-el" tabindex="-1">Registering with default prefix <code>el</code> <a class="header-anchor" href="#registering-with-default-prefix-el" aria-hidden="true">#</a></h4><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki slack-dark vp-code-dark"><code><span class="line"><span style="color:#6A9955;">// Here ButtonCounter gets registered as \`el-button-counter\`</span></span>
<span class="line"><span style="color:#6A9955;">// and ready for use as &lt;el-button-counter&gt;&lt;/el-button-counter&gt;</span></span>
<span class="line"><span style="color:#9CDCFE;">ElementalComponentRegistry</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">register</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">ButtonCounter</span><span style="color:#E6E6E6;">);</span></span>
<span class="line"></span></code></pre><pre class="shiki slack-ochin vp-code-light"><code><span class="line"><span style="color:#357B42;font-style:italic;">// Here ButtonCounter gets registered as \`el-button-counter\`</span></span>
<span class="line"><span style="color:#357B42;font-style:italic;">// and ready for use as &lt;el-button-counter&gt;&lt;/el-button-counter&gt;</span></span>
<span class="line"><span style="color:#2F86D2;">ElementalComponentRegistry</span><span style="color:#002339;">.</span><span style="color:#7EB233;">register</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">ButtonCounter</span><span style="color:#002339;">);</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="registering-with-custom-prefix" tabindex="-1">Registering with custom prefix <a class="header-anchor" href="#registering-with-custom-prefix" aria-hidden="true">#</a></h4><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki slack-dark vp-code-dark"><code><span class="line"><span style="color:#6A9955;">// Here ButtonCounter gets registered as \`awesome-button-counter\`</span></span>
<span class="line"><span style="color:#6A9955;">// and ready for use as &lt;awesome-button-counter&gt;&lt;/awesome-button-counter&gt;</span></span>
<span class="line"><span style="color:#9CDCFE;">ElementalComponentRegistry</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">register</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">ButtonCounter</span><span style="color:#E6E6E6;">, {</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#9CDCFE;">prefix:</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">ElementalComponentPrefix</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">from</span><span style="color:#E6E6E6;">(</span><span style="color:#CE9178;">&#39;awesome&#39;</span><span style="color:#E6E6E6;">),</span></span>
<span class="line"><span style="color:#E6E6E6;">});</span></span>
<span class="line"></span></code></pre><pre class="shiki slack-ochin vp-code-light"><code><span class="line"><span style="color:#357B42;font-style:italic;">// Here ButtonCounter gets registered as \`awesome-button-counter\`</span></span>
<span class="line"><span style="color:#357B42;font-style:italic;">// and ready for use as &lt;awesome-button-counter&gt;&lt;/awesome-button-counter&gt;</span></span>
<span class="line"><span style="color:#2F86D2;">ElementalComponentRegistry</span><span style="color:#002339;">.</span><span style="color:#7EB233;">register</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">ButtonCounter</span><span style="color:#002339;">, {</span></span>
<span class="line"><span style="color:#002339;">  prefix: </span><span style="color:#2F86D2;">ElementalComponentPrefix</span><span style="color:#002339;">.</span><span style="color:#7EB233;">from</span><span style="color:#002339;">(</span><span style="color:#A44185;">&#39;awesome&#39;</span><span style="color:#002339;">),</span></span>
<span class="line"><span style="color:#002339;">});</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="tip custom-block"><p class="custom-block-title">💁 Register any <code>HTMLElement</code></p><p>It may come as no surprise that the <code>register()</code> method can be used to register any <code>HTMLElement</code>, and is not limited to just <code>ElementalComponent</code>. So, don&#39;t be shy, go ahead and give it a try, you&#39;ll be amazed at how much it can benefit you! 😃</p></div><h4 id="registering-a-component-and-a-template-together" tabindex="-1">Registering a component and a template together <a class="header-anchor" href="#registering-a-component-and-a-template-together" aria-hidden="true">#</a></h4><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki slack-dark vp-code-dark"><code><span class="line"><span style="color:#569CD6;">const</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">template</span><span style="color:#E6E6E6;"> </span><span style="color:#D4D4D4;">=</span><span style="color:#E6E6E6;"> </span><span style="color:#CE9178;">\`&lt;button&gt;MyButton&lt;/button&gt;\`</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9CDCFE;">ElementalComponentRegistry</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">register</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">ButtonCounter</span><span style="color:#E6E6E6;">, { </span><span style="color:#9CDCFE;">template</span><span style="color:#E6E6E6;"> });</span></span>
<span class="line"></span></code></pre><pre class="shiki slack-ochin vp-code-light"><code><span class="line"><span style="color:#0991B6;">const</span><span style="color:#002339;"> </span><span style="color:#2F86D2;">template</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">=</span><span style="color:#002339;"> </span><span style="color:#A44185;">\`&lt;button&gt;MyButton&lt;/button&gt;\`</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#2F86D2;">ElementalComponentRegistry</span><span style="color:#002339;">.</span><span style="color:#7EB233;">register</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">ButtonCounter</span><span style="color:#002339;">, { </span><span style="color:#2F86D2;">template</span><span style="color:#002339;"> });</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="copying-an-existing-template-while-registering-a-component" tabindex="-1">Copying an existing template while registering a component <a class="header-anchor" href="#copying-an-existing-template-while-registering-a-component" aria-hidden="true">#</a></h4><p>Let&#39;s say we already have a template registered in the DOM with an id of <code>custom-template</code>. If we choose to create an element that uses this existing template instead, then we can simply pass the <code>templateId</code> during the registration of the component and its content will be copied into a new template.</p><p>If no such template is found, an <code>ElementalComponentNoSuchTemplateFoundException</code> will be thrown.</p><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki slack-dark vp-code-dark"><code><span class="line"><span style="color:#9CDCFE;">ElementalComponentRegistry</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">register</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">ButtonCounter</span><span style="color:#E6E6E6;">, { </span><span style="color:#9CDCFE;">templateId:</span><span style="color:#E6E6E6;"> </span><span style="color:#CE9178;">\`some-template-id\`</span><span style="color:#E6E6E6;"> });</span></span>
<span class="line"></span></code></pre><pre class="shiki slack-ochin vp-code-light"><code><span class="line"><span style="color:#2F86D2;">ElementalComponentRegistry</span><span style="color:#002339;">.</span><span style="color:#7EB233;">register</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">ButtonCounter</span><span style="color:#002339;">, { templateId: </span><span style="color:#A44185;">\`some-template-id\`</span><span style="color:#002339;"> });</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><div class="warning custom-block"><p class="custom-block-title">It&#39;s a copy not a reference</p><p>If a <code>templateId</code> is provided and a template with such an id already exists, then the registry will try to copy its content into a new template element which will then be registered for the given component.</p></div><h4 id="registering-a-component-with-a-template-and-styles" tabindex="-1">Registering a component with a template and styles <a class="header-anchor" href="#registering-a-component-with-a-template-and-styles" aria-hidden="true">#</a></h4><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki slack-dark vp-code-dark"><code><span class="line"><span style="color:#569CD6;">const</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">template</span><span style="color:#E6E6E6;"> </span><span style="color:#D4D4D4;">=</span><span style="color:#E6E6E6;"> </span><span style="color:#CE9178;">\`&lt;button&gt;MyButton&lt;/button&gt;\`</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"><span style="color:#569CD6;">const</span><span style="color:#E6E6E6;"> </span><span style="color:#9CDCFE;">styles</span><span style="color:#E6E6E6;"> </span><span style="color:#D4D4D4;">=</span><span style="color:#E6E6E6;"> </span><span style="color:#CE9178;">\`:host { padding: 0; margin: 0; }\`</span><span style="color:#E6E6E6;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#9CDCFE;">ElementalComponentRegistry</span><span style="color:#E6E6E6;">.</span><span style="color:#DCDCAA;">register</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">ButtonCounter</span><span style="color:#E6E6E6;">, { </span><span style="color:#9CDCFE;">template</span><span style="color:#E6E6E6;">, </span><span style="color:#9CDCFE;">styles</span><span style="color:#E6E6E6;"> });</span></span>
<span class="line"></span></code></pre><pre class="shiki slack-ochin vp-code-light"><code><span class="line"><span style="color:#0991B6;">const</span><span style="color:#002339;"> </span><span style="color:#2F86D2;">template</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">=</span><span style="color:#002339;"> </span><span style="color:#A44185;">\`&lt;button&gt;MyButton&lt;/button&gt;\`</span><span style="color:#002339;">;</span></span>
<span class="line"><span style="color:#0991B6;">const</span><span style="color:#002339;"> </span><span style="color:#2F86D2;">styles</span><span style="color:#002339;"> </span><span style="color:#7B30D0;">=</span><span style="color:#002339;"> </span><span style="color:#A44185;">\`:host { padding: 0; margin: 0; }\`</span><span style="color:#002339;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#2F86D2;">ElementalComponentRegistry</span><span style="color:#002339;">.</span><span style="color:#7EB233;">register</span><span style="color:#002339;">(</span><span style="color:#2F86D2;">ButtonCounter</span><span style="color:#002339;">, { </span><span style="color:#2F86D2;">template</span><span style="color:#002339;">, </span><span style="color:#2F86D2;">styles</span><span style="color:#002339;"> });</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="check-if-component-is-registered" tabindex="-1">Check if component is registered <a class="header-anchor" href="#check-if-component-is-registered" aria-hidden="true">#</a></h2><p><code>ElementalComponentRegistry</code> exposes the following helper methods to check whether a component has been registered or not.</p><h3 id="method-signatures" tabindex="-1">Method Signatures <a class="header-anchor" href="#method-signatures" aria-hidden="true">#</a></h3><div class="language-ts line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki slack-dark vp-code-dark"><code><span class="line"><span style="color:#C586C0;">export</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">class</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">ElementalComponentRegistry</span><span style="color:#E6E6E6;"> {</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// This checks the registry&#39;s storage and will only return a \`true\`</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// if the component was registered using the Registry</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#569CD6;">public</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">static</span><span style="color:#E6E6E6;"> </span><span style="color:#DCDCAA;">isComponentRegisteredByClassName</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">className</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">string</span><span style="color:#E6E6E6;">)</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// This checks the registry&#39;s storage and will only return a \`true\`</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// if the component was registered using the Registry</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#569CD6;">public</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">static</span><span style="color:#E6E6E6;"> </span><span style="color:#DCDCAA;">isComponentRegistered</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">element</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">Class</span><span style="color:#E6E6E6;">&lt;</span><span style="color:#4EC9B0;">HTMLElement</span><span style="color:#E6E6E6;">&gt;)</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// This directly checks the Browser&#39;s component registry</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// and bypasses the \`ElementalComponentRegistry\`.</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// A component that may have be registered directly using the</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// \`customElements\` API and not with \`ElementalComponentRegistry\`,</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#6A9955;">// in such cases this will still return \`true\`</span></span>
<span class="line"><span style="color:#E6E6E6;">  </span><span style="color:#569CD6;">public</span><span style="color:#E6E6E6;"> </span><span style="color:#569CD6;">static</span><span style="color:#E6E6E6;"> </span><span style="color:#DCDCAA;">isComponentRegisteredByTagName</span><span style="color:#E6E6E6;">(</span><span style="color:#9CDCFE;">tagName</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">string</span><span style="color:#E6E6E6;">)</span><span style="color:#D4D4D4;">:</span><span style="color:#E6E6E6;"> </span><span style="color:#4EC9B0;">boolean</span><span style="color:#E6E6E6;"> {}</span></span>
<span class="line"><span style="color:#E6E6E6;">}</span></span>
<span class="line"></span></code></pre><pre class="shiki slack-ochin vp-code-light"><code><span class="line"><span style="color:#7B30D0;">export</span><span style="color:#002339;"> </span><span style="color:#0991B6;">class</span><span style="color:#002339;"> </span><span style="color:#0444AC;">ElementalComponentRegistry</span><span style="color:#002339;"> {</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// This checks the registry&#39;s storage and will only return a \`true\`</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// if the component was registered using the Registry</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#DA5221;">public</span><span style="color:#002339;"> </span><span style="color:#DA5221;">static</span><span style="color:#002339;"> </span><span style="color:#7EB233;">isComponentRegisteredByClassName</span><span style="color:#002339;">(</span><span style="color:#B1108E;">className</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">string</span><span style="color:#002339;">)</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// This checks the registry&#39;s storage and will only return a \`true\`</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// if the component was registered using the Registry</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#DA5221;">public</span><span style="color:#002339;"> </span><span style="color:#DA5221;">static</span><span style="color:#002339;"> </span><span style="color:#7EB233;">isComponentRegistered</span><span style="color:#002339;">(</span><span style="color:#B1108E;">element</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#0444AC;">Class</span><span style="color:#002339;">&lt;</span><span style="color:#0444AC;">HTMLElement</span><span style="color:#002339;">&gt;)</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// This directly checks the Browser&#39;s component registry</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// and bypasses the \`ElementalComponentRegistry\`.</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// A component that may have be registered directly using the</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// \`customElements\` API and not with \`ElementalComponentRegistry\`,</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#357B42;font-style:italic;">// in such cases this will still return \`true\`</span></span>
<span class="line"><span style="color:#002339;">  </span><span style="color:#DA5221;">public</span><span style="color:#002339;"> </span><span style="color:#DA5221;">static</span><span style="color:#002339;"> </span><span style="color:#7EB233;">isComponentRegisteredByTagName</span><span style="color:#002339;">(</span><span style="color:#B1108E;">tagName</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">string</span><span style="color:#002339;">)</span><span style="color:#7B30D0;">:</span><span style="color:#002339;"> </span><span style="color:#DC3EB7;">boolean</span><span style="color:#002339;"> {}</span></span>
<span class="line"><span style="color:#002339;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div>`,29),o=[t];function p(r,c,i,y,d,E){return a(),n("div",null,o)}const h=s(l,[["render",p]]);export{u as __pageData,h as default};
