declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}

export default defineNuxtPlugin(() => {
  const idRaw = useRuntimeConfig().public.yandexMetrikaId
  const id = Number(idRaw)

  if (!idRaw || !Number.isFinite(id) || id <= 0) {
    return
  }

  useHead({
    script: [
      {
        key: 'yandex-metrika',
        innerHTML: `
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) { return; }
  }
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],
  k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${id}, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true
});
        `.trim()
      }
    ],
    noscript: [
      {
        key: 'yandex-metrika-noscript',
        innerHTML: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`
      }
    ]
  })

  const router = useRouter()
  let isInitialNavigation = true

  router.afterEach((to) => {
    // Первый hit уже учитывается в ym(..., "init")
    if (isInitialNavigation) {
      isInitialNavigation = false
      return
    }

    window.ym?.(id, 'hit', to.fullPath)
  })
})
