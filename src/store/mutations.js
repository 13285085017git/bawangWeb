const mutations = {
  'GETCONFIG' (state, res) {
    state.configFile = res.data
  },
  'GETIMGDATA' (state, res) {
    state.banner = res
  },
  'LOTTERY' (state, res) {
    state.lottery = res
  },
  'CATEGORY' (state, res) {
    state.categrory = res
  },
  'ARTICLE' (state, res) {
    state.article = res
  },
  'ARTICDETA' (state, res) {
    state.articDeta = res
  },
  'LOADING' (state) {
    state.loadings = true
  },
  'GETINFO' (state, res) {
    state.userInfo = res
  },
  'GETDETILE' (state, res) {
    state.detile = res
  },
  'QSDATA' (state, res) {
    state.QsDetile = res
  },
  'GETTKDATA' (state, res) {
    state.TKdata = res
  },
  'NEWPLDATA' (state, res) {
    state.newPl = res
  },
  'ZLDATA' (state, res) {
    state.zlData = res
  },
  'ZLXQLB' (state, res) {
    state.zlDataList = res
  },
  'TKFL' (state, res) {
    state.tkFl = res
  },
  'KJLIST' (state, res) {
    state.kjlist = res
  },
  'ADDARR' (state, res) {
    state.concatData = res
  },
  'CLEAR' (state, res) {
    state[res] = []
  },
  'BILL' (state, res) {
    state.bill = res
  },
  'ADDZDLB' (state, res) {
    state.zdLb = res
  },
  'MESSAGE' (state, res) {
    state.chartMessage = res
  },
  'MESSAGENUM' (state, res) {
    state.messageNum = res
  }
}
export default mutations
