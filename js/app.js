(function () {
  const total = 9
  let current = 0

  const screens = () => document.querySelectorAll('.screen')
  const navButtons = () => document.querySelectorAll('[data-screen]')
  const select = () => document.getElementById('screen-jump')
  const titles = [
    'Solicitud de producto',
    'Cotización — datos del contratante',
    'Cotización — resumen',
    'Cotización guardada',
    'Emisión — declaración jurada',
    'Emisión — beneficiarios',
    'Emisión — resumen',
    'Grupo familiar',
    'Póliza emitida',
  ]

  function show(n) {
    current = Math.max(0, Math.min(total - 1, n))
    const modalEmitir = document.getElementById('modal-emitir')
    if (modalEmitir) modalEmitir.hidden = true
    screens().forEach((el, i) => {
      el.hidden = i !== current
    })
    navButtons().forEach((btn) => {
      const i = parseInt(btn.dataset.screen, 10)
      if (i === current) btn.setAttribute('aria-current', 'page')
      else btn.removeAttribute('aria-current')
    })
    if (select()) select().value = String(current)
    document.title = `${titles[current]} · Demo IBSOFT-157 (HTML)`
    if (history.replaceState) {
      history.replaceState(null, '', `#${current}`)
    }

    const modal = document.getElementById('modal-quote')
    const dim = document.querySelector('#screen-3 .card-muted')
    if (modal) {
      if (current === 3) {
        modal.hidden = false
        if (dim) dim.style.opacity = '0.45'
      } else {
        modal.hidden = true
        if (dim) dim.style.opacity = '1'
      }
    }
  }

  function next() {
    show(current >= total - 1 ? 0 : current + 1)
  }

  function prev() {
    show(current - 1)
  }

  function initCoverageToggles() {
    document.querySelectorAll('[data-coverage-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const panelId = btn.getAttribute('aria-controls')
        const panel = panelId ? document.getElementById(panelId) : null
        if (!panel) return
        const willOpen = panel.hidden
        panel.hidden = !willOpen
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false')
          btn.textContent = willOpen ? '- VER COBERTURAS' : '+ VER COBERTURAS'
      })
    })
  }

  function initProductScreen() {
    const aps = document.getElementById('prod-aps')
    const fn = document.getElementById('prod-funeral')
    const cardAps = document.getElementById('card-aps')
    const cardFn = document.getElementById('card-funeral')
    const plans = document.getElementById('aps-plans')
    const funeralPlans = document.getElementById('funeral-plans')
    if (!aps || !fn || !cardAps || !cardFn) return

    const apply = () => {
      const apsOn = aps.checked
      const fnOn = fn.checked
      cardAps.classList.toggle('product-option--selected', apsOn)
      cardFn.classList.toggle('product-option--selected', fnOn)
      if (plans) plans.hidden = !apsOn
      if (funeralPlans) funeralPlans.hidden = !fnOn
    }

    aps.addEventListener('change', apply)
    fn.addEventListener('change', apply)
    apply()
  }

  document.addEventListener('DOMContentLoaded', () => {
    navButtons().forEach((btn) => {
      btn.addEventListener('click', () => show(parseInt(btn.dataset.screen, 10)))
    })
    if (select()) {
      select().addEventListener('change', (e) => show(parseInt(e.target.value, 10)))
    }

    document.querySelectorAll('[data-action="next"]').forEach((el) => el.addEventListener('click', next))
    document.querySelectorAll('[data-action="prev"]').forEach((el) => el.addEventListener('click', prev))
    document.querySelectorAll('[data-action="home"]').forEach((el) => el.addEventListener('click', () => show(0)))
    document.querySelectorAll('[data-action="go-grupo-familiar"]').forEach((el) =>
      el.addEventListener('click', () => show(7))
    )
    document.querySelectorAll('[data-action="back-beneficiarios"]').forEach((el) =>
      el.addEventListener('click', () => show(5))
    )

    const modalEmitir = document.getElementById('modal-emitir')
    document.querySelectorAll('[data-action="open-modal-emitir"]').forEach((el) =>
      el.addEventListener('click', () => {
        if (modalEmitir) modalEmitir.hidden = false
      })
    )
    document.querySelectorAll('[data-action="close-modal-emitir"]').forEach((el) =>
      el.addEventListener('click', () => {
        if (modalEmitir) modalEmitir.hidden = true
      })
    )
    document.querySelectorAll('[data-action="confirm-modal-emitir"]').forEach((el) =>
      el.addEventListener('click', () => {
        if (modalEmitir) modalEmitir.hidden = true
        show(8)
      })
    )

    const closeModal = () => {
      const modal = document.getElementById('modal-quote')
      const dim = document.querySelector('#screen-3 .card-muted')
      if (modal) modal.hidden = true
      if (dim) dim.style.opacity = '1'
    }
    document.querySelectorAll('[data-action="close-modal"]').forEach((el) => el.addEventListener('click', closeModal))

    initProductScreen()
    initCoverageToggles()

    const hash = Number((location.hash || '#0').slice(1), 10)
    show(Number.isFinite(hash) && hash >= 0 && hash < total ? hash : 0)
  })
})()
