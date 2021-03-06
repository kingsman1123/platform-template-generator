const { generateComponent } = require('./generateComponent')
const { generateElementButton, generateVButton, isRightBtn } = require('./button')
const { searchData, methods, pageData, tableData, tableMethods, paginationData, paginationMethods, tableHeight } = require('./data')
const { generateAttrStr, generateEventsStr } = require('./index')

function generateSearch(data) {
    let result = 
`
        <div class="form-container">
            <el-form ref="searchForm" :model="searchData" label-width="${data.labelWidth? data.labelWidth : '80px'}">
                <el-row class="global-div-search">`

    tableHeight.max -= (Math.ceil(data.options.length / 4) * 50 + 71)
    data.options.forEach(item => {
        if (typeof item.defaultVal == 'string') {
            searchData[item.prop] = `'${item.defaultVal}'`
        } else {
            searchData[item.prop] = item.defaultVal
        }
        
        result += 
`                   
                    <el-col :lg="6" :md="8" :sm="12">
                        <el-form-item label="${item.label}" prop="${item.prop}">
                            ${generateComponent(item)}
                        </el-form-item>
                    </el-col>`
    })

    result += 
`                   
                    <el-button type="primary" class="global-btn-search" @click="search" v-if="global || permission.read">搜索</el-button>
                </el-row>
            </el-form>
        </div>`

    return result
}

function generateButton(data) {
    if (!data || !data.length) return ''
    tableHeight.max -= 42
    let leftBtnStr = ''
    let rightBtnStr = ''
    data.forEach(item => {
        if (item.type == 'el-button') {
            leftBtnStr += generateElementButton(item)
        } else {
            if (isRightBtn(item.attrs.type)) {
                rightBtnStr += generateVButton(item)
            } else {
                leftBtnStr += generateVButton(item)
            }
        }
    })
    

    return `            <div class="btn-group">
                <div class="div-btn">
                    ${leftBtnStr.slice(1)}
                </div>
                <div class="right-btn">
                    ${rightBtnStr.slice(1)}
                </div>
            </div>
        `
}

function generateTable(data) {
    if (!data || !data.length) return ''
    Object.assign(pageData.data, tableData)
    Object.assign(methods, tableMethods)

    let result = `<el-table id="printTable" border stripe :data="tableData" highlight-current-row max-height="templateTableMaxHeight"
                    @row-click="rowChange" :row-class-name="getRowIndex">`

    data.forEach(item => {
        result += `<el-table-column prop="${item.prop}" label="${item.label}"></el-table-column>`
    })

    result += '</el-table>'
    return result
}

function generatePagination() {
    tableHeight.max -= 72
    Object.assign(pageData.data, paginationData)
    Object.assign(methods, paginationMethods)
    
    return `
            <el-pagination class="page-container"
                @size-change="sizeChange"
                @current-change="pageChange"
                :current-page="pageNumber"
                :page-sizes="[20, 30, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>`
}

function generateModal(data) {
    if (!data || !data.length) return ''
    let result = ''
    data.forEach(item => {
        result += 
        `
        <Modal ${generateAttrStr(item.attrs)} ${generateAttrStr(item.dattrs, false, true)} ${generateEventsStr(item.events)}>

        </Modal>
        `
    })

    return result
}

module.exports = {
    generateSearch,
    generateButton,
    generateTable,
    generatePagination,
    generateModal,
}