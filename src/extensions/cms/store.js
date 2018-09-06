import fetch from 'isomorphic-fetch'

const state = {
  cmsPages: [],
  cmsBlocks: [],
  cmsPrismic: []
}

const getters = {
  getBlock: (state) => (id) => {
    return state.cmsBlocks.find(item => item.id === id)
  },
  getBlockIdentifier: (state) => (identifier) => {
    return state.cmsBlocks.find(item => item.identifier === identifier)
  },
  getPage: (state) => (id) => {
    return state.cmsPages.find(item => item.id === id)
  },
  getPageIdentifier: (state) => (identifier) => {
    return state.cmsPages.find(item => item.identifier === identifier)
  },
  getPrismicPage: (state) => (id) => {
    return state.cmsPages.find(item => item.id === id)
  }
}

// actions
const actions = {
  loadCms (context, {url, type}) {
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 200) {
          context.commit(`setCms${type}`, data.result)
        }
      })
      .catch(function (err) {
        console.log(err)
        console.error('You need to install a custom Magento module from Snow.dog to make the CMS magick happen. Please go to https://github.com/SnowdogApps/magento2-cms-api and follow the instructions')
      })
  },
  loadPrismicPage (context, {type, orderings}) {
    fetch('http://localhost:8080/api/ext/cms-data/cmsPrismic/' + type + '/' + orderings, { // should be: config.cms.prismic
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
      .then((response) => {
        return response.text()
      })
      .then((res) => {
        let json = JSON.parse(res)
        let temp = []
        for (let key in json.result[0].data) {
          temp.push(json.result[0].data[key])
        }
        if (temp) {
          'cms/loadCms'.commit(`setPrismicPage`, temp)
          console.log('commited PrismicPage')
        }
      })
      .catch(() => {
        console.log('CMS module error.')
      })
  }
}

// mutations
const mutations = {
  setCmsBlock (state, data) {
    if (!state.cmsBlocks.filter(e => e.id === data.id).length > 0) {
      state.cmsBlocks.push(data)
    }
  },
  setCmsPage (state, data) {
    if (!state.cmsPages.filter(e => e.id === data.id).length > 0) {
      state.cmsPages.push(data)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}