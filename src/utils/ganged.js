/*
 * @Page: 联动
 * @Author: csg
 * @Date: 2018-12-25 18:31:00
 * @Last Modified by: csg
 */
var startId = 0;
export default {
  computed: {
    getType() {
      return this.form.type;
    },
    getDesc() {
      var arr = this.desc.map(item => {
        item.replace(/\s+/g, ' ');
      });
      return (this.desc = arr);
    }
  },
  data() {
    return {
      // 确认枚举值禁止按钮
      sureBtn: [false],
      // select一开始的个数
      arr: [1],
      // 枚举类型表头
      EnumerationHeaderArr: [],
      // radio循环部分
      EnumeratedRadio: [],
      // 记录所有选中的数据
      pitchOnRadioArr: [],
      // 枚举联动弹窗控制
      linkAgeVisible: false,
      // 控制下拉选中后出现的内容 textarea
      contextBool: [false],
      // 控制select是否能选
      selectBool: [true],
      // 添加按钮 是否能添加
      addBtnBool: true,
      // 选择联动select
      linkageDropDown: [],
      // 联动 之后 能否编辑
      editBtnBool: [false],
      // 联动下的字段值
      desc: [],
      // 选中的字段值
      radio: [],
      show: true,
      // select v-model
      headerSelect: '',
      input: '',
      show: false,
      objChild: {
        // select 树
        showTree: false
      },
      // 控制枚举编辑字段值弹窗显示隐藏
      dialogTableVisible: false,
      // 表单属性 渲染的数据
      linkList: [],
      // 子id
      id: 0,
      TableHeaderSelectValue: [],
      // 表区id
      userDataId: 0,
      // 表区位置
      tableListPosition: {},
      // 非联动的枚举值弹窗控制
      linkageSetDialog: false,
      // 关联的数据
      radioLinkAgeArr: [],
      // 联动表头数据
      tableHearderList: [],
      // 记录编辑时删除的表头关联id
      deleteHeaderId: 0,
      // 公式弹窗
      formulaVisible: false,
      // 公式弹窗select监听的值
      linkageDropDownSelect: [],
      // 公式弹窗select循环的数据
      formateSelect: [],
      // 公式弹窗radio选中的
      formateRadio: [],
      // 公式弹窗表格信息非枚举类型表头
      theEnumerationList: [],
      // 单选按钮数据 选填 不可填 必填
      choosedButtonDatas: [
        {
          name: '可填',
          value: '001'
        },
        {
          name: '必填',
          value: '003'
        },
        {
          name: '不可填',
          value: '002'
        }
      ],
      // 公式弹窗radio循环的
      formateRadioList: [],
      // 公式弹窗中的左侧渲染的部分
      mathList: [1],
      // 公式弹窗所有表头
      formulaHeaderList: [],
      // 公式弹窗中禁止添加按钮
      MathAddBtn: true,
      // 公式弹窗中保存之后的数居
      sureList: [],
      // 记录保存的id
      saveId: 0,
      // 公式弹窗确认之后的总数数据
      sumList: [],
      // 记录select选择部分的单选this.formateRadio
      selectRadio: [],
      // 记录公式弹窗中的table数据
      tableList: [],
      // table选中的填写类型
      head: [],
      // 公式弹窗中select 禁止选择
      selectForbid: [],
      // 表头与radio以及table 非枚举类型表头的关联数据
      rList: [],
      // 总数居
      formateList: [],
      // 记录表格中选中的数据
      tableRadio: [],
      // 记录表格中的input
      tableInput: [],
      // 记录表区
      tableArea: [],
      obj: {},
      arrr: [],
      OBJa: {},
      aa: {}
    };
  },
  watch: {
    getType(val) {
      if (val === '0001') {
        // 只存在手动填写
        const objArr = [{ value: '0001', label: '手动填写' }];
        this.form.options1 = objArr;
      } else if (val === '0002') {
        // 存在手动填写跟逻辑编辑
        const objArr = [
          { value: '0001', label: '手动填写' },
          { value: '0002', label: '逻辑获取' }
        ];
        this.form.options1 = objArr;
        const list = [
          {
            value: '0001',
            label: 'BOM数据'
          },
          {
            value: '0002',
            label: '财务数据'
          },
          {
            value: '0003',
            label: '需求数据'
          }
        ];
        this.form.BomOptions = list;
      } else if (val === '0004') {
        // 存在手动填写跟逻辑编辑
        const objArr = [
          { value: '0001', label: '手动填写' },
          { value: '0002', label: '逻辑获取' }
        ];
        this.form.options1 = objArr;
        const list = [
          {
            value: '0001',
            label: 'BOM数据'
          },
          {
            value: '0002',
            label: '财务数据'
          },
          {
            value: '0003',
            label: '需求数据'
          }
        ];
        this.form.BomOptions = list;
      } else if (val === '0003') {
        const objArr = [
          { value: '0001', label: '手动填写' },
          { value: '0002', label: '逻辑获取' },
          { value: '0003', label: '公式计算' }
        ];
        this.form.options1 = objArr;
        const list = [
          {
            value: '0001',
            label: 'BOM数据'
          },
          {
            value: '0003',
            label: '需求数据'
          },
          {
            value: '0004',
            label: '付款条件'
          },
          {
            value: '0005',
            label: '贷款利率'
          },
          {
            value: '0006',
            label: '承兑期限'
          },
          {
            value: '0007',
            label: '贴现率'
          }
        ];
        this.form.BomOptions = list;
      } else if (val === '') {
        this.form.options1 = [];
      }
    },
    // textarea v-model 文本框
    desc(val) {
      // var arr = []
      if (val !== '') {
        val.map((item, index) => {
          item = item.replace(/\s+/g, ' ');
          this.desc[index] = item;
        });
      }
      // console.log(val)
    },
    // 非联动的枚举值
    NonlinkageValue(val) {
      if (val !== '') {
        this.NonlinkageValue = val.replace(/\s+/g, ' ');
      }
    },
    // radio v-model
    radio(val) {
      // select 能否选值
      val.map((item, index) => {
        if (!item) {
          this.selectBool[index + 1] = false;
        } else {
          this.selectBool[index + 1] = true;
        }
      });
      // 添加按钮能否添加
      if (val[this.arr.length - 1]) {
        this.addBtnBool = false;
      } else {
        this.addBtnBool = true;
      }
      // console.log(val)
    }
  },
  mounted() {
    // 进入时判断
    this.form.options1 = [];
    console.log('111111111111', sessionStorage.getItem('avatarCode'));
  },
  methods: {
    // 联动弹窗中底部添加按钮
    addField(index, $event) {
      console.log('枚举值添加', index, $event);
    },
    handleClickTree() {
      this.objChild.showTree = !this.objChild.showTree;
    },
    handleClickTreeClose() {
      this.objChild.showTree = false
    },
    handleClickTreeOpen() {
      this.objChild.showTree = true
    },
    // 大的类型 change
    handleTypeChange(data) {
      this.form.logicalAcquisitionType = '';
      console.log('类型select：', data);
      if (data === '0001') {
        // 只存在手动填写
        const objArr = [{ value: '0001', label: '手动填写' }];
        this.form.options1 = objArr;
        this.form.acquisitionMode = '';
      } else if (data === '0002') {
        // 存在手动填写跟逻辑编辑
        const objArr = [
          { value: '0001', label: '手动填写' },
          { value: '0002', label: '逻辑获取' }
        ];
        this.form.options1 = objArr;
        this.form.acquisitionMode = '';
      } else if (data === '0004') {
        // 存在手动填写跟逻辑编辑
        const objArr = [
          { value: '0001', label: '手动填写' },
          { value: '0002', label: '逻辑获取' }
        ];
        this.form.options1 = objArr;
      } else if (data === '0003') {
        const objArr = [
          { value: '0001', label: '手动填写' },
          { value: '0002', label: '逻辑获取' },
          { value: '0003', label: '公式计算' }
        ];
        this.form.options1 = objArr;
        this.form.acquisitionMode = '';
      }
    },
    // 重置按钮
    handleReset() {
      console.log('重置');
      this.form.name = '';
      this.form.info = '';
      this.form.fillIn = '';
      this.form.type = '';
      this.form.characterType = '';
      this.form.acquisitionMode = '';
      this.form.logicalAcquisitionType = '';
      this.form.dateFormat = '';
      this.form.decimalDigit = '';
      this.form.formulatxt1 = '';
      this.form.formulatxt2 = '';
      this.form.formulatxt3 = '';
      this.form.formulaSymbol1 = '';
      this.form.formulaSymbol2 = '';
      this.form.formulaMode = '';
      this.form.linkageSet = '';
      // this.form.options1 = []
    },
    // textarea change事件 更改联动数据
    textareaChange(data, index) {
      // console.log(data, index)
    },
    // 添加联动按钮弹窗
    handleFieldEbumeration(tableList, index) {
      // if (
      //   this.EnumerationHeaderArr.length &&
      //   startId > this.EnumerationHeaderArr.length
      // ) {
      //   startId = startId;
      // }
      this.linkAgeVisible = true;
      // 表区id
      this.userDataId = tableList.id;
      // 表区位置
      this.tableListPosition = tableList.position;
      // 枚举表头承接量
      var MEJArr = [];
      var b = Date.parse(new Date());
      // 去出所有的枚举类型表头(只有顶部最底层的表头)
      tableList.theadTopEntity.leafIndexList.map((item, index) => {
        if (
          item.userData.type === '0001' &&
          item.userData.linkageSet === '是'
        ) {
          var obj = {
            type: 'select',
            id: ++b,
            indexPosition: '',
            disabled: false
          };
          obj.name = item.cell.content;
          obj.position = item.position;
          MEJArr.push(obj);
        }
      });
      // 表头存放信息
      this.EnumerationHeaderArr = MEJArr;
      // 记录初始id
      // startId = this.EnumerationHeaderArr.length;
      if (!tableList.userData.data) {
        // 循环的每一块级结构
        this.arr = [1];
        // 文本填写清空
        this.desc = [];
        // radio循环体清空
        this.EnumeratedRadio = [];
        // 选择联动select
        this.linkageDropDown = [];
        // 记录所有选中的数据
        this.pitchOnRadioArr = [];
        // 控制下拉选中后出现的内容 textarea
        this.contextBool = [false];
        // 控制select是否能选 disabled
        this.selectBool = [true];
        // 添加按钮 是否能添加
        this.addBtnBool = true;
        // 联动 之后 能否编辑
        this.editBtnBool = [false];
        // 选中的字段值
        this.radio = [];
        // 总数据
        this.radioLinkAgeArr = [];
        // 表头关联的数据
        this.tableHearderList = [];
      } else {
        // 循环的每一块级结构
        this.arr = tableList.userData.loopArr;
        // 文本填写清空
        this.desc = tableList.userData.desc;
        // radio循环体清空
        this.EnumeratedRadio = tableList.userData.EnumeratedRadio;
        // 选择联动select
        this.linkageDropDown = tableList.userData.linkageDropDown;
        // 记录所有选中的数据
        this.pitchOnRadioArr = tableList.userData.pitchOnRadioArr;
        // 控制下拉选中后出现的内容 textarea
        this.contextBool = tableList.userData.contextBool;
        // 控制select是否能选 disabled
        this.selectBool = tableList.userData.selectBool;
        // 添加按钮 是否能添加
        this.addBtnBool = tableList.userData.addBtnBool;
        // 联动 之后 能否编辑
        this.editBtnBool = tableList.userData.editBtnBool;
        // 选中的字段值
        this.radio = tableList.userData.radio;
        // 所有枚举值
        this.radioLinkAgeArr = tableList.userData.radioLinkAgeArr;
        // 表头数据
        this.EnumerationHeaderArr = tableList.userData.EnumerationHeaderArr;
        // 表头关联的数据
        this.tableHearderList = tableList.userData.tableHearderList;
        // if (MEJArr.length > this.EnumerationHeaderArr.length) {
        //   console.log(MEJArr)
        //   MEJArr.forEach((item, itemIndex) => {
        //     this.EnumerationHeaderArr.forEach((a, aIndex) => {
        //       if (itemIndex > aIndex) {
        //         this.EnumerationHeaderArr.push(item)
        //         console.log(111111111111111111111)
        //       }
        //     })
        //   })
        // }
        this.EnumerationHeaderArr = this.EnumerationHeaderArr.concat(MEJArr);
        // 去重
        let obj = {};
        this.EnumerationHeaderArr = this.EnumerationHeaderArr.reduce(
          (cur, next) => {
            obj[next.name] ? '' : (obj[next.name] = true && cur.push(next));
            return cur;
          },
          []
        );
      }
      console.log(tableList.userData.radioLinkAgeArr, this.tableList);
      // console.log(
      //   '表头数据',
      //   this.EnumerationHeaderArr,
      //   '------tableList------',
      //   this.tableList,
      //   '-----------传入当前的tableList-下的userdata----------------',
      //   tableList.userData,
      //   MEJArr
      // );
    },
    // 联动弹窗 select change
    handleSelectClick(event, index) {
      this.linkageDropDown[index] = event;
      // 遍历表头 选中时赋给this.TableHeaderSelectValue[index] 为了取id 给关联的枚举值pid
      this.EnumerationHeaderArr.map(item => {
        if (item.name === this.linkageDropDown[index]) {
          this.$set(this.TableHeaderSelectValue, index, item);
          this.deleteHeaderId = item.id;
        }
      });
      // 选中时 根据父级改变 EnumeratedRadio[index] list
      var listArr = [];
      this.radioLinkAgeArr.map(item => {
        if (item.name === this.TableHeaderSelectValue[index].name) {
          listArr.push(item);
        }
      });
      this.$set(this.EnumeratedRadio, index, listArr);
      if (index > 0) {
        this.$set(this.radio, index, '');
        var list = [];
        var obj = {};
        var headerObj = {};
        // 承接前一个选中的枚举值 上一个单选选中的 为了寻找枚举值
        this.EnumeratedRadio[index - 1].map(i => {
          if (i.name === this.radio[index - 1]) {
            obj = i;
          }
        });
        // 选中的表头数据
        this.EnumerationHeaderArr.map((item, itemIndex) => {
          if (item.name === this.linkageDropDown[index]) {
            headerObj = item;
          }
        });
        // 选出与前一个枚举值关联切与该选中表头关联的数据
        this.radioLinkAgeArr.map((item, itemIndex) => {
          if (item.pid === headerObj.id && item.rid === obj.id) {
            list.push(item);
          }
        });
        this.EnumeratedRadio[index] = list;
        // 清除之后的
        this.EnumeratedRadio.map((a, aIndex) => {
          if (index < aIndex) {
            this.$set(this.EnumeratedRadio, aIndex, []);
          }
        });
        console.log(
          '---------------------------------------------1111111111111',
          list
        );
      }
      //

      if (this.linkageDropDown[index + 1]) {
        this.EnumerationHeaderArr.forEach(item => {
          if (item.name === this.linkageDropDown[index + 1]) {
            this.OBJa = item;
          }
        });
      }
      this.radioLinkAgeArr.forEach(item => {
        if (this.OBJa.id === item.pid && this.linkageDropDown[index + 1]) {
          this.$set(this.sureBtn, index + 1, true);
          console.log(444444444444444444444444444444444);
        }
      });

      console.log(
        '选中时的选择内容',
        this.EnumeratedRadio[index],
        '总的枚举值数据----',
        this.radioLinkAgeArr
      );
    },
    // 联动弹窗字段 确认按钮
    fieldSure(index) {
      // 确认之后前边的不能编辑
      if (index > 0) {
        this.$set(this.editBtnBool, index - 1, true);
      }
      // index是否存在枚举值 当desc[index]为空时
      if (this.desc[index] === '' || !this.desc[index]) {
        this.$message.error('请填写枚举值字段！');
        return false;
      }
      // 禁止选择
      this.EnumerationHeaderArr.map((item, itemIndex) => {
        // 找出选中的select值 对应的所有属性(id, value等) 选中的val
        if (item.name === this.linkageDropDown[index]) {
          // 接一下表头跟选中的select的数据
          this.TableHeaderSelectValue[index] = item;
        }
      });
      // 记录表头关联信息
      if (index > 0) {
        var list = this.TableHeaderSelectValue;
        list[index].linkeageId = [];
        this.tableHearderList.push(list[index]);
        this.tableHearderList[index - 1].linkeageId.push(
          this.TableHeaderSelectValue[index].id
        );
        this.tableHearderList[index - 1].linkeageId = [
          ...new Set(this.tableHearderList[index - 1].linkeageId)
        ];
      } else {
        var list = this.TableHeaderSelectValue;
        list[index].linkeageId = [];
        this.tableHearderList.push(list[index]);
      }
      // 将文本中的数据变为数组 来单选
      if (this.desc[index]) {
        var arr = this.desc[index].split(' ');
      }
      var newArr = [];
      // 确定之后select框禁止选择
      if (index === 0) {
        this.$set(this.selectBool, index, false);
      }
      // this.$set(this.selectBool, index, false)
      // 确认枚举值按钮
      this.contextBool[index] = true;
      // 将文本框内容转为数组对象
      arr.map(item => {
        var signAgainReq = {};
        signAgainReq.name = item;
        signAgainReq.type = 'value';
        // 选中表头的id 父级
        signAgainReq.pid = this.TableHeaderSelectValue[index].id;
        signAgainReq.id = ++startId;
        // 所有选中的数据
        if (index > 0) {
          signAgainReq.rid = this.pitchOnRadioArr[index - 1].id;
        } else {
          signAgainReq.rid = '';
        }
        newArr.push(signAgainReq);
      });
      // 循环的radio 列表
      this.EnumeratedRadio[index] = newArr;

      // 将select对应的枚举值放入 存放所有枚举值的数组中
      this.EnumeratedRadio[index].map(item => {
        // 防止重复添加
        this.radioLinkAgeArr.map((i, iIndex) => {
          if (i.id === item.id) {
            this.radioLinkAgeArr.splice(iIndex, 1);
            // console.log('确认截取后的--------------------------------', startId)
          }
        });
        this.radioLinkAgeArr.push(item);
      });

      var arrHeader = [];

      // 枚举类型表头处理
      this.EnumerationHeaderArr.map(item => {
        if (item.type === 'select') {
          arrHeader.push(item);
        }
      });
      this.EnumerationHeaderArr = arrHeader;
      // 若表头中的disabled全为true 添加按钮禁止添加
      this.addBtnBool = true;
      // 添加下标 为了禁止选择
      this.EnumerationHeaderArr.map(item => {
        if (this.linkageDropDown[index] === item.name) {
          item.indexPosition = index;
        }
      });
      console.log(
        '关联的枚举值数组----------- radioLinkAgeArr',
        this.radioLinkAgeArr,
        '222222222222222222222222',
        this.EnumerationHeaderArr
      );
    },
    // 联动弹窗字段 字段编辑按钮
    fieldRedact(index) {
      // 将存在的单选数组分割字符串
      var radioDescArr = [];
      this.EnumeratedRadio[index].map(item => {
        radioDescArr.push(item.name);
      });
      this.desc[index] = radioDescArr.join(' ');
      // 在存放所有枚举值的数组中清空index=0时自定义的枚举值
      if (index === 0) {
        this.radioLinkAgeArr.splice(0, this.EnumeratedRadio[index].length);
        // 将startId 回到起始状态
        startId = this.EnumerationHeaderArr.length;
        // 清空文本框中的字段
      } else {
        // 确认之后 不管时哪个 EnumeratedRadio[index]都是对应的
        this.EnumeratedRadio[index].map(item => {
          this.radioLinkAgeArr.map((i, iIndex) => {
            if (i.pid === item.pid && i.rid === item.rid) {
              // 截取掉 重新编辑
              this.radioLinkAgeArr.splice(iIndex, 1);
            }
          });
        });
      }
      // this.desc[index] = ''
      // select选择禁止
      this.$set(this.selectBool, index, true);
      this.TableHeaderSelectValue.splice(
        index,
        this.TableHeaderSelectValue.length - index
      );
      // 清除表头记录的关联数据
      if (index > 0) {
        this.tableHearderList.map((item, itemIndex) => {
          if (item.id === this.EnumerationHeaderArr[index - 1].id) {
            console.log(item.linkeageId);
            this.EnumerationHeaderArr.map((a, aIndex) => {
              if (a.name === this.linkageDropDown[index]) {
                item.linkeageId.map((i, iIndex) => {
                  if (i === a.id) {
                    item.linkeageId.splice(iIndex, 1);
                  }
                });
              }
            });
          }
        });
      }
      // 编辑的显示 还是确定枚举值显示
      this.$set(this.contextBool, index, false);
      // 添加按钮 禁止添加
      this.addBtnBool = true;
      // 添加下标 为了取消禁止选择
      this.EnumerationHeaderArr.map(item => {
        if (this.linkageDropDown[index] === item.name) {
          item.indexPosition = '';
        }
      });
      console.log(
        '此处的下标为: ',
        index,
        '选中关联下一级的Radio--------数据pitchOnRadioArr',
        this.pitchOnRadioArr,
        '选中的父级TableHeaderSelectValue',
        this.TableHeaderSelectValue,
        '父级关联的数据 ------ EnumeratedRadio ',
        this.EnumeratedRadio,
        '选中的 ------ this.radio',
        this.radio,
        '关联的枚举值数组----------- radioLinkAgeArr',
        this.radioLinkAgeArr,
        'id--------------------------',
        startId,
        '222222222222222222222222',
        this.EnumerationHeaderArr
      );
    },
    // 单选 选中的值
    handleRadio(index) {
      // 遍历此chuck的radio数组 用于下一个desc中的值
      var linkRadioArr = [];
      // this.$set(this.EnumeratedRadio, index + 1, [])
      this.EnumeratedRadio.map((item, itemIndex) => {
        if (
          itemIndex > index &&
          this.EnumeratedRadio[itemIndex] &&
          this.EnumeratedRadio[itemIndex] !== []
        ) {
          this.$set(this.EnumeratedRadio, itemIndex, []);
        }
        // 清空之后单选选中的
        this.radio.map((radioitem, itemIndex) => {
          if (itemIndex > index) {
            this.radio.splice(itemIndex, 1);
          }
        });
      });

      // index下所有的radio
      var obj = {};
      this.EnumerationHeaderArr.map(a => {
        if (a.name === this.linkageDropDown[index + 1]) {
          obj = a;
        }
      });
      this.EnumeratedRadio[index].map(item => {
        // console.log(item, this.radio[index])
        if (item.name === this.radio[index]) {
          // 选中时寻找关联的枚举值radioLinkeAgeArr 存放所有关联的枚举值
          this.radioLinkAgeArr.map(a => {
            // console.log(a)
            if (item.id === a.rid && obj.id === a.pid) {
              console.log('00000000000000000000000000000000000000', obj);
              linkRadioArr.push(a);
            }
          });
          this.$set(this.EnumeratedRadio, index + 1, linkRadioArr);
          if (linkRadioArr.length === 0) {
            this.$set(this.desc, index + 1, '');
            this.$set(this.contextBool, index + 1, false);
          } else {
            // 变为单选类型
            this.$set(this.contextBool, index + 1, true);
          }
          // 记录单选框选中的数据
          this.$set(this.pitchOnRadioArr, index, item);

          console.log(
            '-------------选中------',
            this.EnumeratedRadio[index + 1],
            '-----总的radio',
            this.EnumeratedRadio,
            '--------总数据',
            this.radioLinkAgeArr
          );
        }
      });
      // 为了下一个选择的父级的id 与 子集的pid  对应linkageDropDownp[index+1]
      this.EnumeratedRadio[index + 1].map(item => {
        // 遍历表头
        this.EnumerationHeaderArr.map(a => {
          if (item.pid === a.id) {
            this.$set(this.linkageDropDown, index + 1, a.name);
          }
        });
      });
      console.log('-------------------', this.EnumeratedRadio[index + 1]);
      if (this.EnumerationHeaderArr.length <= this.arr.length) {
        this.addBtnBool = true;
      } else {
        this.addBtnBool = false;
      }

      this.EnumeratedRadio[index].forEach(item => {
        this.radioLinkAgeArr.forEach(a => {
          if (item.id === a.rid && this.linkageDropDown[index + 1]) {
            this.$set(this.sureBtn, index + 1, false);
          }
        });
      });

      console.log(
        '下一个表头数据--------------',
        obj,
        '---------选中的',
        this.pitchOnRadioArr[index],
        // strList.join(',')
        '此index下的选择组',
        this.EnumeratedRadio[index]
      );
    },
    // 当个循环块 单选下边的添加枚举值按钮
    handleAddLinkage(index) {
      if (index > 0) {
        console.log(
          '添加',
          index,
          this.linkageDropDown[index],
          this.EnumeratedRadio[index - 1]
        );
      }
    },
    // radio上的删除按钮
    handleDelete(index) {
      console.log(index);
    },
    // 联动 添加按钮
    handleAddSelect() {
      var a = 1;
      this.arr.push(++a);
      // 添加按钮 禁止添加
      this.addBtnBool = true;
    },
    // 联动弹窗确定按钮
    linkAgeSure() {
      // 关闭弹窗
      this.linkAgeVisible = false;
      // 表头跟枚举值合并
      var aggregateData = this.radioLinkAgeArr.concat(
        this.EnumerationHeaderArr
      );
      this.tableList.map((item, itemIndex) => {
        if (item.id === this.userDataId) {
          // 当前表区的总数据
          item.userData.data = aggregateData;
          // 当前表区的所有枚举值
          item.userData.radioLinkAgeArr = this.radioLinkAgeArr;
          // 表区位置
          item.userData.position = this.tableListPosition;
          // 循环体的个数
          item.userData.loopArr = this.arr;
          // 文本的数据
          item.userData.desc = this.desc;
          // 选中的radio
          item.userData.radio = this.radio;
          // 循环的每个radioList
          item.userData.EnumeratedRadio = this.EnumeratedRadio;
          // select中选中的数据
          item.userData.linkageDropDown = this.linkageDropDown;
          // 记录所有选中的数据
          item.userData.pitchOnRadioArr = this.pitchOnRadioArr;
          // 控制下拉选中后出现的内容
          item.userData.contextBool = this.contextBool;
          // 控制select是否能选
          item.userData.selectBool = this.selectBool;
          // 添加按钮 是否能添加
          item.userData.addBtnBool = this.addBtnBool;
          // 联动之后能否编辑
          item.userData.editBtnBool = this.editBtnBool;
          // 表头数据
          item.userData.EnumerationHeaderArr = this.EnumerationHeaderArr;
          // 表区id
          item.userData.id = this.userDataId;
          // 表头关联的数据
          item.userData.tableHearderList = this.tableHearderList;
        }
      });
      // 去重
      var obj = {};
      this.tableHearderList = this.tableHearderList.reduce((item, next) => {
        obj[next.id] ? '' : (obj[next.id] = true && item.push(next));
        return item;
      }, []);
      // 将列表信息传给
      console.log(this.radioLinkAgeArr, this.tableList);
      // console.log(
      //   '---------------表区Id-------------',
      //   this.userDataId,
      //   '------总的表区数据------',
      //   this.tableList,
      //   '表头数据--------------',
      //   this.EnumerationHeaderArr,
      //   '总数据----------------',
      //   aggregateData,
      //   '---循环体的个数---',
      //   this.arr,
      //   '---文本的数据---',
      //   this.desc,
      //   '---选中的radio---',
      //   this.radio,
      //   '---循环的每个radioList---',
      //   this.EnumeratedRadio,
      //   '---select中选中的数据---',
      //   this.linkageDropDown,
      //   '---记录所有选中的数据---',
      //   this.pitchOnRadioArr,
      //   '---控制下拉选中后出现的内容 textarea---',
      //   this.contextBool,
      //   '---控制select是否能选 disabled---',
      //   this.selectBool,
      //   '---添加按钮 是否能添加---',
      //   this.addBtnBool,
      //   '---联动之后能否编辑---',
      //   this.editBtnBool,
      //   '---表区位置---',
      //   this.tableListPosition,
      //   '---------------------关联的表头list-----------------------',
      //   this.tableHearderList
      // );
      // if (this.tableListPosition.length > 0) {
      this.tabularLinkage(this.tableListPosition);
      // }
    },
    // 弹窗关闭前的回调
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 下拉框出现/隐藏时触发
    changeValue1($event, index) {
      console.log(index);
      if ($event) {
        this.EnumerationHeaderArr.map((item, itemIndex) => {
          if (item.indexPosition === '' || item.indexPosition === index) {
            item.disabled = false;
          } else {
            item.disabled = true;
          }
        });
      }
    },
    // 表单属性
    tableAreaNumber() {
      this.linkList = this.tableList;
      console.log(this.tableList);
    },
    // 非联动的枚举值设置
    linkageSet() {
      this.linkageSetDialog = true;
      console.log('非联动的枚举值');
    },
    // 非联动枚举值确定按钮
    linkageSetSure() {
      this.linkageSetDialog = false;
      this.form.linkageSetArr = this.NonlinkageValue.split(' ');
      console.log(this.form.linkageSetArr);
    },
    // 联动弹窗 关闭是事件
    closeDialog() {
      this.linkAgeVisible = false;
      // console.log(
      //   '联动弹窗关闭回调---------做数据清空 或者 其他弹窗关闭后的操作'
      // )
    },
    // 公式弹窗出现按钮
    handleFormula(tableList, index, ArrList) {
      // 弹窗显示
      this.formulaVisible = true;
      // 表区id
      this.userDataId = tableList.id;
      // 记录表区
      this.tableArea = tableList;
      console.log('表区Id', this.userDataId, tableList);
      // 枚举类型非联动表头数据
      var enumerationHeaderList = [];
      // 非枚举类型联动表头数据
      var theEnumerationHeaderList = [];
      // 当前表区数据
      tableList.theadTopEntity.leafIndexList.map((item, itemIndex) => {
        if (
          item.userData.type === '0001' &&
          item.userData.linkageSet === '否' &&
          item.userData.acquisitionMode === '0001'
        ) {
          // 表头数据存储
          var obj = {};
          obj.name = item.cell.content;
          obj.position = item.position;
          obj.id = item.id;
          obj.disabled = false;
          obj.IndexPos = '';
          if (item.cell.content !== '') {
            enumerationHeaderList.push(obj);
          }
        } else if (item.userData.type !== '0001') {
          var object = {};
          object.name = item.cell.content;
          object.position = item.position;
          object.id = item.id;
          object.genre = item.userData.type;
          // 填写类型
          object.type = '';
          // 公式
          object.val = '';
          if (item.cell.content !== '') {
            theEnumerationHeaderList.push(object);
          }
        }
      });
      // 表头与radio以及table 非枚举类型表头的关联数据
      this.rList = [];
      // 承载数据
      var List = [];
      if (!tableList.userData.List) {
        // 表头禁止选择取消
        this.selectForbid = [];
        // 禁止添加按钮取消
        this.MathAddBtn = true;
        // 左侧块结构部分为1
        this.mathList = [1];
        // 表区数据清空
        this.theEnumerationList = [];
        // 表头数据清空
        this.formulaHeaderList = [];
        // 清空select数据
        this.linkageDropDownSelect = [];
        // 清空选择部分的所有单选框
        this.formateRadioList = [];
        this.formateList = [];
        // 枚举值选中的清空
        this.formateRadio = [];
        // 表格非枚举类型
        this.theEnumerationList = theEnumerationHeaderList;
        //
        this.obj = {};
      } else {
        // 表头禁止选择取消
        this.selectForbid = tableList.userData.selectForbid;
        // 禁止添加按钮取消
        this.MathAddBtn = tableList.userData.MathAddBtn;
        // 左侧块结构部分为1
        this.mathList = tableList.userData.mathList;
        // 表区数据清空
        this.theEnumerationList = tableList.userData.theEnumerationList;
        // 再次添加时回显添加的非枚举类型表头数据
        for (
          var item = 0;
          item < tableList.theadTopEntity.leafIndexList.length;
          item++
        ) {
          for (var a = 0; a < this.theEnumerationList.length; a++) {
            if (
              tableList.theadTopEntity.leafIndexList[item].userData.type !==
                '0001' &&
              this.theEnumerationList[a].id !==
                tableList.theadTopEntity.leafIndexList[item].id &&
              this.theEnumerationList[a].name !==
                tableList.theadTopEntity.leafIndexList[item].name
            ) {
              var object = {};
              object.name =
                tableList.theadTopEntity.leafIndexList[item].cell.content;
              object.position =
                tableList.theadTopEntity.leafIndexList[item].position;
              object.id = tableList.theadTopEntity.leafIndexList[item].id;
              object.genre =
                tableList.theadTopEntity.leafIndexList[item].userData.type;
              // 填写类型
              object.type = '';
              // 公式
              object.val = '';
              if (
                tableList.theadTopEntity.leafIndexList[item].cell.content !== ''
              ) {
                this.theEnumerationList.splice(item, 1, object);
                // 去重
                let aa = {};
                this.theEnumerationList = this.theEnumerationList.reduce(
                  (cur, next) => {
                    aa[next.id] ? '' : (aa[next.id] = true && cur.push(next));
                    return cur;
                  },
                  []
                );
                // console.log(
                //   this.theEnumerationList,
                //   11111111111111111111111111
                // );
              }
            }
          }
        }
        // 表头数据清空
        this.formulaHeaderList = tableList.userData.formulaHeaderList;
        // 清空select数据
        this.linkageDropDownSelect = tableList.userData.linkageDropDownSelect;
        // 清空选择部分的所有单选框
        this.formateRadioList = tableList.userData.formateRadioList;
        // 表头与radio以及table 非枚举类型表头的关联数据
        this.rList = JSON.parse(tableList.userData.rList);
        // 选中的radio
        this.formateRadio = JSON.parse(tableList.userData.formateRadio);
        // 位置变化是改变
        tableList.theadTopEntity.leafIndexList.map((item, itemIndex) => {
          tableList.userData.List[0].r.map(a => {
            a.head.map(c => {
              if (
                item.id === c.id &&
                JSON.stringify(item.position) !== JSON.stringify(c.position)
              ) {
                var Obj = JSON.stringify(item.position);
                c.position = JSON.parse(Obj);
                // console.log(
                //   c.position,
                //   '1111111111111111111111111111111111111111111'
                // );
              }
            });
          });
        });
        // 总数居
        List = tableList.userData.List;
      }
      // 给表头数据
      this.formulaHeaderList = enumerationHeaderList;
      // 判断radio的值 进行table 公式回显

      // 存一下表头的id 表头 为了g
      var headerIdList = [];
      // 表头循环 为了取表头
      this.formulaHeaderList.map((a, aIndex) => {
        // select选中的循环
        this.linkageDropDownSelect.map((c, cIndex) => {
          if (a.name === c) {
            headerIdList.push(a.id);
          }
        });
      });

      // 表头与选中的radio id
      var radioIdList = [];
      this.linkageDropDownSelect.map((a, aIndex) => {
        // select下边的radio 当前list数据
        this.formateRadioList[aIndex].map((c, cIndex) => {
          // 单选监听中的 取出选中的id  radio c.text选中名称
          if (this.formateRadio[aIndex] === c.text) {
            radioIdList.push(c.value);
          }
        });
      });
      // 存放select与radio的id关联
      var glist = [];
      for (var i = 0; i < headerIdList.length; i++) {
        glist.push(headerIdList[i] + '|' + radioIdList[i]);
      }

      if (List.length > 0 && List[0].r) {
        List[0].r.forEach(item => {
          if (item.g === glist.join(',')) {
            item.head.forEach(i => {
              this.theEnumerationList.forEach(a => {
                if (i.id === a.id) {
                  a.type = i.type;
                  a.val = i.val;
                }
              });
            });
          }
        });
      }
      // console.log(tableList, this.formateRadioList[index]);
    },
    // 公式弹窗确认按钮
    handleFormulaSure() {
      // 弹窗关闭
      // debugger
      this.formulaVisible = false;
      // 承接总数居
      this.formateList.push(this.obj);
      // console.log(1111111111111111111111111111111111111111111111)
      // 去重
      // this.formateList = [...new Set(this.formateList)]
      var obj = {};
      this.formateList.map(item => {
        item.pos = JSON.stringify(item.pos);
      });
      this.formateList = this.formateList.reduce(function(item, next) {
        obj[next.pos] ? '' : (obj[next.pos] = true && item.push(next));
        return item;
      }, []);
      if (this.formateList.length > 0 && Object.keys(this.obj).length > 0) {
        this.formateList[0].pos = JSON.parse(this.formateList[0].pos);
        // console.log('111111111111111111111111', this.formateList)

        this.formateList[0].r.map(item => {
          if (typeof item.head === 'string') {
            item.head = JSON.parse(item.head);
            // console.log(item.head)
          }
        });
      }
      this.formateList.map((item, index) => {
        if (typeof item.pos === 'string') {
          this.formateList[0].pos = JSON.parse(this.formateList[0].pos);
        }
        console.log(11111111111, item, this.formateList);
      });
      this.tableList.map((item, itemIndex) => {
        if (item.id === this.userDataId) {
          // 填报总数居
          // this.formateList[0].pos = JSON.parse(this.formateList[0].pos)
          item.userData.List = this.formateList;
          // item.userData.list = JSON.stringify(this.formateList)
          // 公式弹窗中select 禁止选择  ------正常
          item.userData.selectForbid = this.selectForbid;
          // 记录公式弹窗中的table数据
          // item.userData.tableList = this.tableList
          // 公式弹窗radio选中的
          item.userData.formateRadio = JSON.stringify(this.formateRadio);
          //                          ------正常
          item.userData.linkageDropDownSelect = this.linkageDropDownSelect;
          // 公式弹窗中的左侧渲染的部分 ------正常
          item.userData.mathList = this.mathList;
          // 公式弹窗中禁止添加按钮     ------正常
          item.userData.MathAddBtn = this.MathAddBtn;
          // 表区的数据                ------正常
          item.userData.theEnumerationList = this.theEnumerationList;
          // 表头数据清空              ------正常
          item.userData.formulaHeaderList = this.formulaHeaderList;
          // 清空选择部分的所有单选框   ------正常
          item.userData.formateRadioList = this.formateRadioList;
          // 表头与radio以及table 非枚举类型表头的关联数据
          item.userData.rList = JSON.stringify(this.rList);
        }
      });
      // console.log(222222222222222222222222, this.formateList)
      console.log(
        11111111111111111111111,
        this.formateList,
        '--------',
        this.tableList
        // '选中的radio',
        // this.formateRadio
      );
    },
    // 公式弹窗中的select 选中时change
    handleLinkageDropDownSelect($event, index) {
      console.log('选中时', this.userDataId, this.tableList);
      // 当前表区数据
      var id = parseInt(this.userDataId.split('')[1]);
      // console.log(
      //   $event,
      //   this.tableList,
      //   this.formateRadioList,
      //   id,
      //   this.userDataId
      // );
      this.tableArea.theadTopEntity.leafIndexList.map((item, itemIndex) => {
        if (
          item.userData.type === '0001' &&
          item.userData.linkageSet === '否' &&
          item.userData.acquisitionMode === '0001'
        ) {
          if (item.cell.content === $event) {
            // 表头下的枚举字段存储
            this.formateRadioList[index] =
              item.tbodyConfig.container.cell.displayClass.normal.select.optionList;
            // console.log(
            //   item.tbodyConfig.container.cell.displayClass.normal.select
            //     .optionList
            // )
          }
        }
      });
      // 清空之前的位置 添加位置
      this.formulaHeaderList.map(item => {
        // 清空之前的位置
        if (item.IndexPos === index) {
          item.IndexPos = '';
        }
        // 添加位置
        if (item.name === $event) {
          item.IndexPos = index;
        }
      });
      // console.log(this.formulaHeaderList, $event);
    },
    // 公式弹窗单选选中change
    handleFormateRadio($event, index) {
      console.log($event, index);
      this.MathAddBtn = false;
      // 取出表头id 跟对应的radio选中的id  与 this.rList做对比
      // 存一下表头的id 表头 为了g
      var headerIdList = [];
      // 表头循环 为了取表头
      this.formulaHeaderList.map((a, aIndex) => {
        // select选中的循环
        this.linkageDropDownSelect.map((c, cIndex) => {
          if (a.name === c) {
            headerIdList.push(a.id);
          }
        });
      });
      // theadTopEntity
      // 表头与选中的radio id
      var radioIdList = [];
      this.linkageDropDownSelect.map((a, aIndex) => {
        // select下边的radio 当前list数据
        this.formateRadioList[aIndex].map((c, cIndex) => {
          // 单选监听中的 取出选中的id  radio c.text选中名称
          if (this.formateRadio[aIndex] === c.text) {
            radioIdList.push(c.value);
          }
        });
      });
      // 存放select与radio的id关联
      var glist = [];
      for (var i = 0; i < headerIdList.length; i++) {
        glist.push(headerIdList[i] + '|' + radioIdList[i]);
      }
      this.theEnumerationList.map(item => {
        item.type = '';
        item.val = '';
      });
      // 遍历数组 取出g相等的head 将判断拷贝对象是字符串还是数组
      this.rList.forEach(item => {
        if (item.g === glist.join(',')) {
          if (typeof item.head !== 'string') {
            item.head.forEach(a => {
              console.log(a);
              this.theEnumerationList.forEach(i => {
                if (a.id === i.id) {
                  i.type = a.type;
                  i.val = a.val;
                }
              });
            });
          } else {
            JSON.parse(item.head).forEach(c => {
              // console.log('Parse---', c)
              this.theEnumerationList.forEach(d => {
                if (c.id === d.id) {
                  d.type = c.type;
                  d.val = c.val;
                }
              });
            });
          }
        }
      });
      console
        .log
        // '表区数据---------',
        // this.theEnumerationList,
        // 'id',
        // glist.join(',')
        ();
    },
    // 公式弹窗列表中的radio
    handleTableRadio(index, row) {
      console.log(index, row);
      if (row.type !== '002') {
        row.val = '';
      }
    },
    // 公式弹窗中添加按钮
    handleMathAdd() {
      var a = 1;
      this.MathAddBtn = true;
      if (this.formulaHeaderList.length > this.mathList.length) {
        this.mathList.push(++a);
      } else {
        this.$message({
          message: '无添加数据',
          type: 'warning'
        });
      }

      console.log('添加非联动枚举值类型的表头');
      // this.linkageDropDownSelect.map(a => {
      //   this.formulaHeaderList.map(c => {
      //     if (a === c.name) {
      //       c.disabled = true;
      //     }
      //   });
      // });
    },
    // 公式保存按钮
    formatePreserve() {
      // 禁止选择
      this.mathList.map((a, aIndex) => {
        this.$set(this.selectForbid, aIndex, true);
      });
      // 加号禁止添加
      this.MathAddBtn = true;
      // obj选中的位置
      var pos = [];
      // 存一下表头的id 表头 为了g
      var headerIdList = [];
      // 表头循环 为了取表头
      this.formulaHeaderList.map((a, aIndex) => {
        // select选中的循环
        this.linkageDropDownSelect.map((c, cIndex) => {
          if (a.name === c) {
            pos.push(a.position);
            headerIdList.push(a.id);
          }
        });
      });

      // 表头与选中的radio id
      var radioIdList = [];
      this.linkageDropDownSelect.map((a, aIndex) => {
        // select下边的radio 当前list数据
        this.formateRadioList[aIndex].map((c, cIndex) => {
          // 单选监听中的 取出选中的id  radio c.text选中名称
          if (this.formateRadio[aIndex] === c.text) {
            radioIdList.push(c.value);
          }
        });
      });
      // 存放select与radio的id关联
      var glist = [];
      for (var i = 0; i < headerIdList.length; i++) {
        glist.push(headerIdList[i] + '|' + radioIdList[i]);
      }

      // 选中的公式类型数据
      var head = [];
      // 表单数据
      this.theEnumerationList.map(a => {
        if (a.type !== '') {
          head.push(a);
        }
      });
      // hear = JSON.stringify(head)
      var objA = {};
      objA.g = glist.join(',');
      objA.head = JSON.stringify(head);

      if (this.rList.length > 0) {
        this.rList.forEach((item, index) => {
          if (item.g === objA.g) {
            var data = { g: '', head: '' };
            data.g = glist.join(',');
            data.head = JSON.stringify(head);
            this.rList.splice(index, 1, data);
            // this.rList.push(data)
          } else {
            var data = { g: '', head: '' };
            data.g = glist.join(',');
            data.head = JSON.stringify(head);
            this.rList.push(data);
            // console.log('循环中的----', data)
            // return false
          }
        });
      } else {
        // this.rList.push(data)
        this.rList.push(objA);
      }

      // 去重
      var Distinct = {};
      this.rList = this.rList.reduce(function(item, next) {
        Distinct[next.g] ? '' : (Distinct[next.g] = true && item.push(next));
        return item;
      }, []);
      // 保存之后pos是固定的 所以先把表头pos保存下来
      this.obj.pos = JSON.stringify(pos);
      this.obj.r = this.rList;
      console.log(
        // '----数据',

        // '---------',
        // head,
        // '11111111111',
        // objA
        this.rList
      );
    },
    // 公式弹窗select下拉显示隐藏时 触发
    formateChangeValue($event, index) {
      // console.log($event, index, this.formulaHeaderList);
      if ($event) {
        this.formulaHeaderList.map((item, itemIndex) => {
          if (item.IndexPos === '' || item.IndexPos === index) {
            item.disabled = false;
          } else {
            item.disabled = true;
          }
        });
      }
    }
  }
};
