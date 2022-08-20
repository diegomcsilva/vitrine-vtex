function roundUp(num, precision) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

const excludesProducts = [
  'Bebê Conforto Cocoon Galzerano Preto',
  'Bebê Conforto Cocoon Galzerano Duolee',
  'Bebê Conforto Cocoon Dzieco Preto',
  'Carrinho de Bebê Vulkan Galzerano Preto',
  'Carrinho de Bebê Vulkan Galzerano Cinza'
]

const historyFilterCategory = () => {
  const {
    pathname
  } = window.location;

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  if (getCookie('currentPage') && getCookie('currentPage') === pathname) {
    const lastFilter = getCookie('lastFilter').split(',');

    lastFilter.forEach(item => {
      $(`.multi-search-checkbox[value="${item}"]`).trigger('click');
    })

    mudaValorPreteleira();
  } else {
    setCookie('currentPage', pathname);
  }

  $('.search-multiple-navigator').on('click', 'label', (e) => {
    const valor = e.currentTarget;

    if (valor.querySelector('input:checked')) {
      const lastFilter = `${getCookie('lastFilter') ? `${getCookie('lastFilter').replace(valor.title)},` : ''}${valor.title}`;

      setCookie('lastFilter', lastFilter);
    }

  })
}

const mudaValorPreteleira = () => {
  const listaProdutos = document.querySelectorAll('.carouselGallery ul > li:not(.helperComplement)')
  const desconto = 0.15
  if(listaProdutos) {
    listaProdutos.forEach((item) => {
      const itemEl = item.querySelector('.best-price-2020')
      const oldPrice = item.querySelector('.oldPrice')
      const formato = { style: 'currency', currency: 'BRL' }
      const nome = item.querySelector('.shelfProductName a')

      const contaiansName = nome && excludesProducts.contains(nome.innerText)

      if (itemEl && !oldPrice && !contaiansName) {
        const preco = itemEl
          .innerText
          .replace('R$ ', '')
          .replace('.', '-')
          .replace(',', '.')
          .replace('-', '')
  
        const valorDoDesconto = preco * desconto
  
        const precoComDesconto = (preco - valorDoDesconto).toFixed(2)

        const elementoDe = '<span class="oldPrice">De <strong>' + itemEl.innerText + '</strong></span>'
        const precoFinal = Number(precoComDesconto).toLocaleString('pt-BR', formato) + '<span class="price-obs"> (Preço para pagamento com ADDI - pix parcelado)</span>'
 
        $(itemEl).before(elementoDe)
        itemEl.innerHTML = precoFinal
      }
    })
  }
}

const mudaValorPageProduto = () => {
  const desconto = 0.15
  const itemEl = document.querySelector('.plugin-preco .skuBestPrice');

  if(itemEl) {
    const oldPrice = document.querySelector('.skuListPrice')
    const formato = { style: 'currency', currency: 'BRL' }
    const nome = document.querySelector('.productName')

    const contaiansName = nome && excludesProducts.contains(nome.innerText)

    if (!oldPrice && !contaiansName) {
      const preco = itemEl
        .innerText
        .replace('R$ ', '')
        .replace('.', '-')
        .replace(',', '.')
        .replace('-', '')
  
      const valorDoDesconto = preco * desconto
  
      const precoComDesconto = (preco - valorDoDesconto).toFixed(2)
      console.log('precoComDesconto', precoComDesconto)
      const precoParcelado = precoComDesconto / $('.skuBestInstallmentNumber').text().replace('x', '')
      console.log('precoParcelado', precoParcelado)
  
      const elementoDe = '<em class="valor-de price-list-price" style="display: block;">De: <strong class="skuListPrice">' + itemEl.innerText + '</strong></em>'
      const precoFinal = Number(precoComDesconto).toLocaleString('pt-BR', formato) + '<span class="price-obs"> (Preço para pagamento com ADDI - pix parcelado)</span>'
      const precoFinalParcelado = Number(roundUp(precoParcelado, 2)).toLocaleString('pt-BR', formato)
        
      // $('.skuBestInstallmentValue').text(precoFinalParcelado)
      $('.valor-por.price-best-price').before(elementoDe)
      itemEl.innerHTML = precoFinal
    }
  }
}

const changeLocationUiAutocomplete = function() {
  $('ul.ui-autocomplete').insertAfter('fieldset.busca')
}

$(document).ready(function () {
  // historyFilterCategory();
  changeLocationUiAutocomplete();
  // mudaValorPreteleira();
  // mudaValorPageProduto();
});

$(document).ajaxStop(function () {
  // mudaValorPreteleira();
});

