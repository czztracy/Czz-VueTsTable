/*
 * @Page: 非联动模拟数据
 * @Author: cls
 * @Date: 2018-1-8
 * @Last Modified by: cls
 */
var monifei = {
	pos:[],
	r:[
		{
			g:'1-1547020967000,2-1547020980001,3-1547020996002',
			head:[
				{
					pos:{
                        colNum: 7,
                        colStr: 'H',
                        rowNum: 1,
                        rowStr: 2,
                        table: 0
                    },//非枚举类型表头位置
					name:'',//非枚举类型表头位置
					type:'002',// 可填(001), 不可填(002), 必填(003)
					val:'=E2*F2'// 公式(input)
                },
                {
					pos:{
                        colNum: 9,
                        colStr: 'J',
                        rowNum: 1,
                        rowStr: 2,
                        table: 0
                    },//非枚举类型表头位置
					name:'',//非枚举类型表头位置
					type:'003',// 可填(001), 不可填(002), 必填(003)
					val:'=E2+F2+G2'// 公式(input)
				}
			]
        },
        {
			g:'1-1547020967002,2-1547020980001,3-1547020996000',
			head:[
				{
					pos:{
                        colNum: 6,
                        colStr: 'G',
                        rowNum: 2,
                        rowStr: 3,
                        table: 0
                    },//非枚举类型表头位置
					name:'',//非枚举类型表头位置
					type:'001',// 可填(001), 不可填(002), 必填(003)
					val:''// 公式(input)
                },
                {
					pos:{
                        colNum: 7,
                        colStr: 'H',
                        rowNum: 2,
                        rowStr: 3,
                        table: 0
                    },//非枚举类型表头位置
					name:'',//非枚举类型表头位置
					type:'002',// 可填(001), 不可填(002), 必填(003)
					val:''// 公式(input)
                },
                {
					pos:{
                        colNum: 8,
                        colStr: 'I',
                        rowNum: 2,
                        rowStr: 3,
                        table: 0
                    },//非枚举类型表头位置
					name:'',//非枚举类型表头位置
					type:'003',// 可填(001), 不可填(002), 必填(003)
					val:''// 公式(input)
				}
			]
        }
	]
}
monifei.pos = [{
    colNum: 1,
    colStr: 'B',
    rowNum: 0,
    rowStr: 1,
    table: 0
},{
    colNum: 2,
    colStr: 'C',
    rowNum: 0,
    rowStr: 1,
    table: 0
},{
    colNum: 3,
    colStr: 'D',
    rowNum: 0,
    rowStr: 1,
    table: 0
}]
export default monifei