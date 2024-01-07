import { d as defineStore, e as useRoute, a as __nuxt_component_0$1, b as useState } from '../server.mjs';
import { useSSRContext, ref, computed, defineComponent, watchEffect, resolveComponent, unref, withCtx, createTextVNode, toDisplayString, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import '../../nitro/vercel.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

function useCount() {
  const count = useState("count", () => Math.round(Math.random() * 20));
  function inc() {
    count.value += 1;
  }
  function dec() {
    count.value -= 1;
  }
  return {
    count,
    inc,
    dec
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Counter",
  __ssrInlineRender: true,
  setup(__props) {
    const { count, inc, dec } = useCount();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "inline-flex": "",
        m: "y-3"
      }, _attrs))}><button btn p-2 rounded-full><div i-carbon-subtract></div></button><div font="mono" w="15" m-auto inline-block>${ssrInterpolate(unref(count))}</div><button btn p-2 rounded-full><div i-carbon-add></div></button></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Counter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const useUserStore = defineStore("user", () => {
  const savedName = ref("");
  const previousNames = ref(/* @__PURE__ */ new Set());
  const usedNames = computed(() => Array.from(previousNames.value));
  const otherNames = computed(() => usedNames.value.filter((name) => name !== savedName.value));
  function setNewName(name) {
    if (savedName.value)
      previousNames.value.add(savedName.value);
    savedName.value = name;
  }
  return {
    setNewName,
    otherNames,
    savedName
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const user = useUserStore();
    const name = route.params.id;
    watchEffect(() => {
      user.setNewName(route.params.id);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      const _component_Counter = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div i-twemoji:waving-hand text-4xl inline-block animate-shake-x animate-duration-5000></div><h3 text-2xl font-500> Hi, </h3><div text-xl>${ssrInterpolate(unref(name))}! </div>`);
      if (unref(user).otherNames.length) {
        _push(`<p text-sm my-4><span op-50>Also as known as:</span><ul><!--[-->`);
        ssrRenderList(unref(user).otherNames, (otherName) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_router_link, {
            to: `/hi/${otherName}`,
            replace: ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(otherName)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(otherName), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_Counter, null, null, _parent));
      _push(`<div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn m-3 text-sm",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back `);
          } else {
            return [
              createTextVNode(" Back ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/hi/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-dpru8Pn8.mjs.map
