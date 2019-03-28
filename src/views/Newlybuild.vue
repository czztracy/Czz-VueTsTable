/*
 * @Page: 
 * @Author: cong
 * @Date: 2018-12-21 14:06:25
 * @Last Modified by: cong
 */
<template>
  <div class="newlybuild" v-loading="tableloading">
    <el-container>
      <el-aside style="width: auto; min-width: 224px;">
        <broadsideTree/>
      </el-aside>
      <el-main>
        <div class="con">
          <div class="content">
            <div class="relevantGroup" @mousedown="hideMenu($event)">
              <el-row>
                <el-col :span="8">
                  <div @click.stop="handleClickTreeClose">
                  <el-button icon="el-icon-plus" @click="optionalTable.addTableDialog = true">添加表区</el-button>
                  <el-switch v-model="mySwitch" active-text="显示模板信息"/>
                  <!-- <el-button icon="el-icon-plus" @click="myRuler">标尺</el-button> -->
                  <!-- 添加表区弹窗 -->
                  <el-dialog
                    title="添加表区"
                    width="625px"
                    :visible.sync="optionalTable.addTableDialog"
                    center
                  >
                    <span>
                      <el-radio-group v-model="optionalTable.tempChooseRadio">
                        <el-radio :label="1">
                          <img src="@/assets/temp1.png" class="radioimg">
                          <div>表区结构1</div>
                        </el-radio>
                        <el-radio :label="2">
                          <img src="@/assets/temp2.png" class="radioimg">
                          <div>表区结构2</div>
                        </el-radio>
                        <el-radio :label="3">
                          <img src="@/assets/temp3.png" class="radioimg">
                          <div>表区结构4</div>
                        </el-radio>
                      </el-radio-group>
                    </span>
                    <el-dialog
                      width="350px"
                      title="请选择行列个数"
                      :visible.sync="optionalTable.innerVisible"
                      append-to-body
                      center
                    >
                      <span>
                        <el-form
                          :model="optionalTable"
                          :rules="optionalTableRules"
                          ref="optionalTabler"
                        >
                          <el-form-item prop="colNum">
                            <el-input
                              type="number"
                              min="1"
                              max="20"
                              placeholder="请输入列"
                              v-model.number="optionalTable.colNum"
                            >
                              <template slot="prepend">列</template>
                            </el-input>
                          </el-form-item>
                          <el-form-item prop="rowNum">
                            <el-input
                              type="number"
                              min="1"
                              max="20"
                              placeholder="请输入行"
                              v-model.number="optionalTable.rowNum"
                            >
                              <template slot="prepend">行</template>
                            </el-input>
                          </el-form-item>
                        </el-form>
                      </span>
                      <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="chooseTable">确 定</el-button>
                        <el-button
                          @click="optionalTable.innerVisible = optionalTable.addTableDialog = false"
                        >取 消</el-button>
                      </span>
                    </el-dialog>
                    <span slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="optionalTable.innerVisible = true">确 定</el-button>
                      <el-button @click="optionalTable.addTableDialog = false">取 消</el-button>
                    </span>
                  </el-dialog>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div @click.stop="handleClickTreeClose">
                  <el-input v-model="input" placeholder="编辑模板名称" maxlength="20"></el-input>
                  </div>
                </el-col>
                <el-col :span="1" style="position: relative;">
                  <el-button @click.stop="handleClickTree">
                    <i class="el-icon-tickets"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </el-button>
                  <selectTree :message="objChild" @tolisten="getTemplate"/>
                </el-col>
                <el-col :span="8">
                  <div @click.stop="handleClickTreeClose">
                  <el-button
                    icon="el-icon-edit-outline"
                    @click="interfaceBtn('003')"
                    v-if="getLocalStorage.page == 2"
                    :disabled="isSubmit"
                  >修改</el-button>
                  <el-button
                    icon="el-icon-printer"
                    @click="interfaceBtn('001')"
                    v-else="getLocalStorage.page == 1"
                  >保存</el-button>
                  <el-button icon="el-icon-view" @click="isPreview">预览</el-button>
                  <!-- 预览弹窗 -->
                  <el-dialog
                    title="预览"
                    :fullscreen="fullscreen"
                    class="preview"
                    :visible.sync="previewTableDialog"
                    center
                    @close="closeDialogs"
                  >
                    <span class="maskcon">
                      <headers
                        ref="childrenOne"
                        :tab-head-json="tabHeadJson"
                        @tableHeadeJson="getHeadJson"
                      />
                      <MyTable v-for="table in saveList" :key="table.id" :inputTable="table"></MyTable>
                       <!-- <footers
                        ref="childrenTwo"
                        :tab-foot-json="tabFootJson"
                        @formJson="getFootJson"
                      />-->
                      <div>
                        <el-form class="tabFoot" :model="tabFootJson">
                          <el-form-item label="填写人签字：" class="reportMan">
                            <el-input
                              :disabled="supplierAble"
                              placeholder
                              v-model="tabFootJson.name"
                              type="input"
                            />
                          </el-form-item>
                          <el-form-item label="联系电话：" class="reportMan">
                            <el-input
                              :disabled="supplierAble"
                              placeholder
                              v-model="tabFootJson.tel"
                              type="input"
                            />
                          </el-form-item>
                          <el-form-item label="公司名称：" class="reportMan name">
                            <el-input
                              placeholder
                              v-model="tabFootJson.corporateName"
                              type="input"
                              disabled
                            />
                          </el-form-item>
                          <!-- <span>(签章位置)</span> -->
                          <el-form-item label="填写日期：" class="reportMan name">
                            <el-input placeholder v-model="tabFootJson.date" type="input" disabled/>
                          </el-form-item>
                          <el-form-item label="填写说明：" class="reportMan name explain">
                            <el-input
                              :disabled="explainAble"
                              autosize
                              placeholder="请输入填写说明"
                              v-model="tabFootJson.explain"
                              resize="none"
                              type="textarea"
                              class="explainInput"
                            />
                          </el-form-item>
                        </el-form>
                      </div>
                    </span>
                    <span slot="footer" class="dialog-footer">
                      <!-- <el-button @click="previewTableDialog = false">关闭</el-button> -->
                      <el-button @click="closePreview">关闭</el-button>
                    </span>
                  </el-dialog>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="abouttable" @click.stop="handleClickTreeClose">
              <div class="topruler" ref="topruler">
                <span v-for="(item, index) in rulerInfo.topLength" :key="index"/>
              </div>
              <div class="leftruler" ref="leftruler">
                <span v-for="(item, index) in rulerInfo.leftLength" :key="index"/>
              </div>
            </div>
            <div class="table" ref="mytable" @click.stop="handleClickTreeClose">
              <div class="tmpcenter">
                <headers
                  ref="childrenOne"
                  v-show="mySwitch"
                  :tab-head-json="tabHeadJson"
                  @tableHeadeJson="getHeadJson"
                />
                <div class="tablecom">
                  <TableCom v-for="table in tableList" :key="table.id" :inputTable="table"/>
                </div>
                <!-- <footers
                  ref="childrenTwo"
                  v-show="mySwitch"
                  :tab-foot-json="tabFootJson"
                  @formJson="getFootJson"
                />-->
                <div v-show="mySwitch">
                  <el-form class="tabFoot" :model="tabFootJson">
                    <el-form-item label="填写人签字：" class="reportMan">
                      <el-input
                        :disabled="supplierAble"
                        placeholder
                        v-model="tabFootJson.name"
                        type="input"
                      />
                    </el-form-item>
                    <el-form-item label="联系电话：" class="reportMan">
                      <el-input
                        :disabled="supplierAble"
                        placeholder
                        v-model="tabFootJson.tel"
                        type="input"
                      />
                    </el-form-item>
                    <el-form-item label="公司名称：" class="reportMan name">
                      <el-input
                        placeholder
                        v-model="tabFootJson.corporateName"
                        type="input"
                        disabled
                      />
                    </el-form-item>
                    <!-- <span>(签章位置)</span> -->
                    <el-form-item label="填写日期：" class="reportMan name">
                      <el-input placeholder v-model="tabFootJson.date" type="input" disabled/>
                    </el-form-item>
                    <el-form-item label="填写说明：" class="reportMan name explain">
                      <el-input
                        :disabled="explainAble"
                        autosize
                        placeholder="请输入填写说明"
                        v-model="tabFootJson.explain"
                        resize="none"
                        type="textarea"
                        class="explainInput"
                      />
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
            <div class="btnGro" @click.stop="handleClickTreeClose">
              <el-button @click="interfaceBtn('002')" type="primary" :disabled="isSubmit">提 交</el-button>
            </div>
          </div>
        </div>
        <div class="attribute-panel">
          <i class="el-icon-arrow-right" @click="show = !show"/>
          <el-tabs type="border-card" v-show="show" @tab-click="tableAreaNumber">
            <el-tab-pane label="字段属性">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="字段名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="是否必填">
                  <el-select v-model="form.fillIn">
                    <el-option label="是" value="0001"></el-option>
                    <el-option label="否" value="0002"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="提示信息">
                  <el-input v-model="form.info"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                  <el-select
                    v-model="form.type"
                    placeholder="请选择类型"
                    @change="handleTypeChange($event)"
                  >
                    <el-option
                      v-for="item in form.typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否联动" v-if="this.form.type === '0001'">
                  <el-select v-model="form.linkageSet" @change="formLinkageSet">
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="枚举编辑"
                  v-if="this.form.type === '0001' && this.form.linkageSet === '否'"
                  align="left"
                >
                  <el-button size="medium" @click="linkageSet">编辑</el-button>
                </el-form-item>
                <el-form-item label="获取方式">
                  <el-select v-model="form.acquisitionMode" placeholder="请选择获取方式">
                    <el-option
                      v-for="item in form.options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="字符类型"
                  v-if="this.form.type === '0003' && this.form.acquisitionMode === '0001'"
                >
                  <el-select v-model="form.characterType">
                    <el-option label="整型" value="整型"></el-option>
                    <el-option label="浮点型" value="浮点型"></el-option>
                    <el-option label="百分数" value="百分数"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="小数位数"
                  v-if="this.form.characterType === '浮点型' && this.form.acquisitionMode === '0001'"
                >
                  <el-input v-model="form.decimalDigit"></el-input>
                </el-form-item>
                <el-form-item
                  label="小数位数"
                  v-if="this.form.characterType === '百分数' && this.form.acquisitionMode === '0001'"
                >
                  <el-input v-model="form.percentageDigit"></el-input>
                </el-form-item>
                
                <el-form-item label="逻辑类型" v-if="this.form.acquisitionMode === '0002'">
                  <el-select v-model="form.logicalAcquisitionType" placeholder="请选择逻辑获取类型">
                    <el-option
                      v-for="item in form.BomOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="计算方式"
                  v-if="this.form.type === '0003' && this.form.acquisitionMode === '0003'"
                >
                  <el-select v-model="form.formulaMode" placeholder="请选择逻辑获取类型">
                    <el-option
                      v-for="item in form.formulaModeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="公式"
                  v-if="this.form.type === '0003' && this.form.formulaMode === '0002' && this.form.acquisitionMode === '0003'"
                >
                  <div class="formula">
                    <el-select v-model="form.formulaSymbol1" placeholder=" ">
                      <el-option label=">" value=">"></el-option>
                      <el-option label=">=" value=">="></el-option>
                      <el-option label="==" value="=="></el-option>
                      <el-option label="<" value="<"></el-option>
                      <el-option label="<=" value="<="></el-option>
                    </el-select>
                    <el-input v-model="form.formulatxt2" class="formulatxt"></el-input>
                    <el-select v-model="form.formulaSymbol2" placeholder=" ">
                      <el-option label=">" value=">"></el-option>
                      <el-option label=">=" value=">="></el-option>
                      <el-option label="==" value="=="></el-option>
                      <el-option label="<" value="<"></el-option>
                      <el-option label="<=" value="<="></el-option>
                    </el-select>
                    <el-input v-model="form.formulatxt3" class="formulatxt"></el-input>
                  </div>
                </el-form-item>
                <el-form-item
                  label="公式"
                  v-if="this.form.type === '0003' && this.form.formulaMode === '0001' && this.form.acquisitionMode === '0003'"
                >
                  <el-input v-model="form.formulatxt1" placeholder="{sc}{sr};行:{sr}列:{sc}"></el-input>
                  <div class="tips">
                    <p>两个单元格相加:A2+B2</p>
                    <p>两列相加:A{sr}+B{sr}</p>
                    <p>两行相加:{sc}2+{sc}3</p>
                    <p>跨表区相加:表1!C2+表2!C2</p>
                  </div>
                </el-form-item>
                <el-form-item
                  label="小数位数"
                  v-if="this.form.type === '0003' && this.form.formulaMode === '0001' && this.form.acquisitionMode === '0003'"
                >
                  <el-select v-model="form.decimals" placeholder="请选择">
                    <el-option
                      v-for="item in form.decimalsData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="btnTabGro">
                  <el-button type="primary" @click="getFieldProperties">确定</el-button>
                  <el-button @click="handleReset">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="表单属性">
              <div class="tableAreaBox">
                <div class="chuck" v-for="(item, index) in linkList" :key="index">
                  <span style="margin-right: 12px; font-size: 14px;">{{ item.topLeftValue }}</span>
                  <!-- 点击添加 -->
                  <el-button
                    icon="el-icon-share"
                    @click="handleFieldEbumeration(tableList[index], index)"
                  >添加关联</el-button>
                  <el-button @click="handleFormula(tableList[index], index, tableList)">公式</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 非联动的枚举值设置弹窗 -->
        <div class="dialogTempField">
          <el-dialog :visible.sync="linkageSetDialog" v-dialogDrag title="枚举值设置" width="30%">
            <el-input type="textarea" placeholder="请填写枚举值" v-model="NonlinkageValue"/>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="linkageSetSure">确 定</el-button>
              <el-button @click="linkageSetDialog = false">取 消</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- 枚举联动字段弹窗 -->
        <div class="linkAge">
          <el-dialog
            :visible.sync="linkAgeVisible"
            :close-on-click-modal="false"
            v-dialogDrag
            title="添加关联"
            @close="closeDialog"
            custom-class="DIALOG"
          >
            <div class="hint">
              <div
                class="IMG"
                style="display: inline-block;vertical-align: middle; margin-right: 4px;"
              >
                <img src="@/assets/tubiao.png">
              </div>
              <div class="text" style="display: inline-block;">请在下拉框中选择需要联动的字段</div>
            </div>
            <div class="fieldAssociated">
              <div class="associatedBox" v-for="(node, index) in arr" :key="index">
                <el-select
                  v-model="linkageDropDown[index]"
                  placeholder="请选择"
                  :disabled="!selectBool[index]"
                  @change="handleSelectClick($event, index)"
                  @visible-change="changeValue1($event, index)"
                >
                  <el-option
                    v-for="item in EnumerationHeaderArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    :disabled="item.disabled"
                  />
                </el-select>
                <div class="Box" style="overflow:hidden;" v-show="linkageDropDown[index]">
                  <div class="edit" v-if="!contextBool[index]">
                    <div class="editCon">
                      <el-input
                        type="textarea"
                        v-model.trim="desc[index]"
                        @change="textareaChange($event, index)"
                      />
                    </div>
                    <div class="bottomBtn">
                      <el-button @click="fieldSure(index)" :disabled="sureBtn[index]">确定枚举值</el-button>
                    </div>
                  </div>
                  <div class="editChoice" v-if="contextBool[index]">
                    <div class="editCon">
                      <el-radio-group v-model="radio[index]" @change="handleRadio(index, $event)">
                        <el-radio
                          v-for="(item, index) in EnumeratedRadio[index]"
                          :key="index"
                          :label="item.name"
                          border
                        >
                          <span class="radioText">{{item.name}}</span>
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="bottomBtn">
                      <el-button
                        @click="fieldRedact(index, $event)"
                        :disabled="editBtnBool[index]"
                      >编辑</el-button>
                      <!-- <el-button @click="addField(index, $event)" v-if="editBtnBool[index]">添加</el-button>
                      <el-button
                        v-else
                        @click="fieldRedact(index, $event)"
                        :disabled="editBtnBool[index]"
                      >编辑</el-button>-->
                    </div>
                  </div>
                </div>
                <div class="picImg">
                  <img src="@/assets/Group.png">
                </div>
              </div>
              <el-button
                class="Btn"
                icon="el-icon-plus"
                :disabled="addBtnBool"
                @click="handleAddSelect"
              />
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="linkAgeSure" style="margin-right: 20px;">确 定</el-button>
              <el-button @click="linkAgeVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 公式弹窗 -->
        <div class="linkAge formate">
          <el-dialog
            v-dialogDrag
            :visible.sync="formulaVisible"
            :close-on-click-modal="false"
            title="公式设置"
            @close="closeDialog"
            custom-class="formula"
          >
            <div class="hint">
              <div
                class="IMG"
                style="display: inline-block;vertical-align: middle; margin-right: 4px;"
              >
                <img src="@/assets/tubiao.png">
                <el-button type="primary" class="preserve" @click="formatePreserve">保存</el-button>
              </div>
              <div class="text" style="display: inline-block;">请在下拉框中选择需要非联动的表头</div>
            </div>
            <div class="fieldAssociated">
              <div class="associatedBox" v-for="(item, itemIndex) in mathList" :key="itemIndex">
                <el-select
                  v-model="linkageDropDownSelect[itemIndex]"
                  placeholder="请选择"
                  :disabled="selectForbid[itemIndex]"
                  @change="handleLinkageDropDownSelect($event, itemIndex)"
                  @visible-change="formateChangeValue($event, itemIndex)"
                >
                  <el-option
                    v-for="item in formulaHeaderList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    :disabled="item.disabled"
                  />
                </el-select>
                <div class="Box" style="overflow:hidden;">
                  <div class="editChoice">
                    <div class="editCon">
                      <el-radio-group
                        v-model="formateRadio[itemIndex]"
                        @change="handleFormateRadio($event, itemIndex)"
                      >
                        <el-radio
                          v-for="item in formateRadioList[itemIndex]"
                          :key="item.value"
                          :label="item.text"
                          border
                        >{{item.text}}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rightBox">
                <el-button
                  class="addBtn"
                  @click="handleMathAdd"
                  icon="el-icon-plus"
                  :disabled="MathAddBtn"
                />
                <el-table
                  :data="theEnumerationList"
                  :header-cell-style="{'color': '#4A4A4A', 'text-align': 'center'}"
                  :cell-style="{'text-align': 'center','white-space': 'nowrap','text-overflow':'ellipsis', 'overflow':'hidden'}"
                  style="width: 100%;"
                  height="100%"
                  align="center"
                >
                  <el-table-column fixed prop="name" label="非枚举类型表头"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-radio-group
                        v-model="scope.row.type"
                        @change.native="handleTableRadio(scope.$index, scope.row)"
                      >
                        <el-radio-button
                          v-for="item in choosedButtonDatas"
                          :key="item.value"
                          :label="item.value"
                        >{{item.name}}</el-radio-button>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="公式">
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.val"
                        placeholder="请输入所需公式"
                        v-if="scope.row.type === '002' && scope.row.genre === '0003'"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="handleFormulaSure" style="margin-right: 20px;">确 定</el-button>
              <el-button @click="formulaVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
        <div class="addSum">
          <el-dialog title="合计" :visible.sync="addSumdialog" width="500px">
            <el-form :model="addSumdialogForm" label-width="80px" ref="addSumdialogForm">
              <el-form-item label="选择表头">
                <el-select
                  v-model="addSumdialogForm.chooseThead"
                  multiple
                  placeholder="请选择需要合计的表头信息"
                  class="selectwidth"
                >
                  <el-option
                    v-for="item in addSumdialogForm.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="表头名称">
                <el-input placeholder="默认是：合计" v-model="addSumdialogForm.theadName"/>
              </el-form-item>
              <!-- <el-form-item label="表头宽度">
                <el-input placeholder="默认是100px" type="number" v-model="addSumdialogForm.theadWidth">
                  <template slot="append">px</template>
                </el-input>
              </el-form-item>-->
            </el-form>
            <div slot="footer">
              <el-button @click="addSumdialog = false">取 消</el-button>
              <el-button type="primary" v-if="acrossDialog===1" @click="addSum">确 定</el-button>
              <el-button type="primary" v-else @click="addCrossSum">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
    <!-- 右键菜单 -->
    <div ref="tests" class="menuss">
      <div v-show="controlMenus" class="menuContent">
        <p @click="addColss()">添加列</p>
        <p @click="deleUnit('col')">删除列</p>
        <p @click="addUnit()">添加行</p>
        <div v-if="controlPar">
          <p class="huise">删除行</p>
          <p @click="addPar()">添加父级</p>
          <p @click="merge()">合并单元格</p>
          <p @click="theadDelete()">删除该表头</p>
          <p @click="controlWidth(1)">设置列宽</p>
          <p @click="controlWidth(2)">设置行高</p>
          <p class="huise">合计</p>
          <!-- <p @click="addCrossShow()">跨表区合计(自动)</p> -->
        </div>
        <div v-else>
          <p @click="deleUnit('row')">删除行</p>
          <p class="huise">添加父级</p>
          <p class="huise">合并单元格</p>
          <p class="huise">删除该表头</p>
          <p @click="controlWidth(1)">设置列宽</p>
          <p @click="controlWidth(2)">设置行高</p>
          <p @click="addSumdialogShow('left')">合计</p>
          <!-- <p @click="addCrossShow()">跨表区合计(自动)</p> -->
        </div>
      </div>
    </div>
    <!-- 设置列宽/行高的弹窗 -->
    <el-dialog
      title="设置宽/高"
      :visible.sync="controldialogWH"
      width="500px"
      style="z-index: 1000000 !important;"
      >
      <el-input
        type="number"
        min="1"
        max="500"
        v-if="controlWH === 1"
        placeholder="最大宽度：500px"
        v-model="widthHeight"
      />
      <el-input
        type="number"
        min="1"
        max="500"
        v-else
        placeholder="最大高度：500px"
        v-model="Heightwidth"
      />
      <div slot="footer">
        <el-button @click="controldialogWH = false">取 消</el-button>
        <el-button
          v-if="controlWH === 1"
          v-loading="sureWidthHeight"
          type="primary"
          @click="controlWidHeight(widthHeight, 500)"
        >确 定</el-button>
        <el-button
          v-else
          v-loading="sureWidthHeight"
          type="primary"
          @click="controlWidHeight(Heightwidth, 500)"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import broadsideTree from "@/components/templateTree/templateMapTree.vue";
import selectTree from "@/components/templateTree/templateSelectTree.vue";
import {
  TableCom,
  TableListCom,
  BaseTable,
  BaseTableList,
  ParamTheadAdd,
  ParamTheadDelete
} from "vue3-drag-table/lib/drag-table.umd.min";
import ganged from "@/utils/ganged";
import footers from "@/components/Quotation/footer.vue";
import headers from "@/components/Quotation/header.vue";
import { searchLiscount, searchLending } from "@/utils/supplier";
import {
  interfaceSave,
  interfaceGetTemplate
} from "@/utils/newTemplateInterface";
import { judgeUrl, tableVersion } from "@/utils/api.ts";
@Component({
  components: {
    TableCom,
    broadsideTree,
    selectTree,
    footers,
    headers
  },
  mixins: [ganged] as any
})
export default class Newlybuild extends Vue {
  // 签字、电话不可填写
  supplierAble: boolean = true;
  // 填写说明
  explainAble: boolean = false;
  fullscreen: boolean = true;
  // 选择表区相关
  optionalTable: any = {
    rowNum: 1,
    colNum: 1,
    // 添加表单单选
    tempChooseRadio: 1,
    // 选择表区弹窗
    addTableDialog: false,
    // 添加行列弹窗
    innerVisible: false
  };
  optionalTableRules: any = {
    rowNum: [{ validator: this.checkNum, trigger: "blur" }],
    colNum: [{ validator: this.checkNum, trigger: "blur" }]
  };
  // 尺子
  rulerInfo: any = {
    topLength: 0,
    leftLength: 0
  };
  // 表头信息
  tabHeadJson: any = {
    quotationName: "报价单",
    quotationNum: "",
    Identification: "2",
    signal: false
  };
  // 表尾信息
  tabFootJson: any = {
    Identification: "2",
    date: "",
    Opinion: "", // 供应商意见（可填写）
    name: "", // 填写人签字
    tel: "", // 联系电话
    corporateName: "", // 公司名称（用户登录时获取）
    // 填写说明（用户可修改）
    explain: `1、公式    计算单价 = ①＋②＋③＋④＋⑤＋⑥＋⑦＋⑧—⑨＋⑩。\r\n2、一般管理费、利润供应商根据公司自身管理实际填写。\r\n3、买方有权拒绝不完整或迟到的报价。\r\n4、供应商报价时，一定确保所填写数据真实有效。虚假报价一经查实，买方有权按照合同追责。`
  };
  // 是否显示模板信息
  mySwitch: boolean = false;
  tableHearderList: any = new Array(); // 联动表头数据
  // 表单数据
  form: any = {
    name: "", // 字段名称
    info: "", // 提示信息
    fillIn: "", // 是否必填
    type: "", // 类型
    characterType: "", // 字符类型
    acquisitionMode: "", // 获取方式
    linkageSet: "", // 是否联动
    linkageSetArr: new Array(), // 非联动的枚举值
    percentageDigit: "",
    // 计算方式
    formulaModeOptions: [
      {
        value: "0001",
        label: "单元格间计算"
      },
      {
        value: "0002",
        label: "单元格内计算"
      }
    ],
    // 获取方式select数组
    options1: [
      {
        value: "0001",
        label: "手动填写"
      },
      {
        value: "0003",
        label: "公式计算"
      },
      {
        value: "0002",
        label: "逻辑获取"
      }
    ],
    decimals: "",
    // 小数位数
    decimalsData: [
      {
        value: "0",
        label: "0"
      },
      {
        value: "1",
        label: "1"
      },
      {
        value: "2",
        label: "2"
      },
      {
        value: "3",
        label: "3"
      },
      {
        value: "4",
        label: "4"
      }
    ],
    // 类型
    typeOptions: [
      {
        value: "0001",
        label: "枚举类型"
      },
      {
        value: "0002",
        label: "文本类型"
      },
      {
        value: "0003",
        label: "数值类型"
      },
      {
        value: "0004",
        label: "日期类型"
      }
    ],
    // BOM
    BomOptions: [
      {
        value: "0001",
        label: "BOM数据"
      },
      {
        value: "0002",
        label: "财务数据"
      },
      {
        value: "0003",
        label: "需求数据"
      }
    ],
    // 枚举下的编辑
    enumerateOptions: [],
    // 日期格式
    dataOptions: [
      {
        value: "1",
        label: "YYYY-MM-mm1"
      },
      {
        value: "2",
        label: "YYYY-MM-mm2"
      }
    ],
    logicalAcquisitionType: "", // 逻辑获取类型
    dateFormat: "", // 日期格式
    decimalDigit: "", // 小数位数
    formulaMode: "", // 计算方式
    formulatxt1: "", // 公式文本1
    formulatxt2: "", // 公式文本2
    formulatxt3: "", // 公式文本3
    formulaSymbol1: "", // 公式符号1
    formulaSymbol2: "", // 公式符号2
    isLinkage: false, // 是否联动
    linkageCon: {} // 联动信息
  };
  // 非联动枚举值
  NonlinkageValue = "";
  // 判断是否提交
  isSubmit = true;
  // 侧边版是否隐藏
  show: boolean = false;
  // 模板名称
  input: string = "";
  // localStorage信息
  getLocalStorage: any = {};
  // 模板版本id
  templateVersionId: any = "";
  // 提交按钮loading
  tableloading: boolean = false;
  // iframe 数据
  iframeData: any = {};
  // 表单计数
  tableNum = 0;
  table: BaseTable = new BaseTable("table");
  // 以下三个为中间存储单元
  tmpTable: any = null;
  tmpTHead: any = null;
  tableList: any = new Array();
  // 保存表格
  saveList: any = new Array();
  // 预览弹框是否隐藏
  previewTableDialog = false;
  // 存储预览数据
  previewdata: any = new Array();
  // 控制右键菜单的显示
  controlMenus = false;
  // 控制右键菜单的添加父级
  controlPar = true;
  // 删除的行
  deleTarget: any = "";
  // 设置表格宽高的弹窗
  controldialogWH: boolean = false;
  widthHeight: string = "";
  Heightwidth: string = "";
  controlWH: any = 0;
  // 宽高确定的loading
  sureWidthHeight: boolean = false;
  // 每一行选择后的公式
  linkageFormula: any = [];
  // 所有表区id的集合
  areaTable: any = new Array();
  nullArray: any = new Array();
  // 所有公示表头的集合
  headTotal: any = [];
  // 获取存在公式关系单元格的行数
  formulaRow: any = [];
  // 表区公式关系数组
  formulaRelation: any = null;
  // 每一行公式关系的初始化
  arrayOneRow: any = new Array();
  // change事件找到的表头
  parentHead: any = null;
  // 联动首个表头位置存储
  firstLinkagePosition: any = {};
  // 合计
  addSumdialog = false;
  addSumdialogForm: any = {
    chooseThead: [],
    theadWidth: "",
    options: [],
    theadName: "",
    addSumData: [],
    type: "",
    tableId: 0
  };
  acrossCollection: any = []; // 跨表区集合
  acrossDialog: any = 1; // 合计是否跨表区区分
  acrossTotal: any = false; // 跨表区
  judgeUrls: any = "";
  beforeCreate() {
    this.judgeUrls = judgeUrl();
    if (this.judgeUrls === "003") {
      const myUserData1 = {
        page: "1", // 进入标识 新建
        region: "fe7ab57d0a7911e9b460fa163e23d187", // 区域
        templateClassId: "SC0004", // 品类
        userCode: "01482957" // 用户编码
      };
      const myUserData2 = {
        page: "2", // 进入标识 编辑
        templateId: "HR19012485369745833984", // 模板id
        templateVersionId: "HR19012485369781485568", // 模板版本号
        userCode: "01482957", // 用户编码
        templateClassId: "SC0004" // 品类id
      };
      window.sessionStorage.setItem("userData", JSON.stringify(myUserData1));
    }
  }
  created() {
    // this.editTemplateInitialization((window as any).sessionStorage.getItem("thediffirent"));
    if (!(window as any).sessionStorage.getItem("userData")) {
      this.$message.error("入口不对，请重新进入");
      this.tableloading = true;
      return;
    }
    this.getLocalStorage = JSON.parse(
      (window as any).sessionStorage.getItem("userData")
    );
    if (this.getLocalStorage.page == 2) {
      this.isSubmit = false;
      this.tableloading = true;
      interfaceGetTemplate(this.getLocalStorage.templateId, val => {
        this.input = val.resultData.templateName;
        Object.keys(val.resultData).forEach((element: any) => {
          this.getLocalStorage[element] = val.resultData[element];
        });
        this.editTemplateInitialization(this.getLocalStorage.templateScript);
        this.tableloading = false;
      });
    }
  }
  mounted() {
    this.myRuler();
    this.getCurrentDate();
  }
  @Watch("rulerInfo.topLength")
  watchWidth(now: any, before: any) {
    if (now !== before) {
      // console.log(now, before);
      this.myRuler();
    }
  }
  // 行列数字校验
  checkNum(rule, value, callback) {
    if (!value) {
      return callback(new Error("输入框不能为空"));
    } else {
      const reg = /^[1-9]+\d*$/;
      if (!reg.test(value)) {
        callback(new Error("请填写大于0的正整数"));
      } else {
        if (value > 20) {
          callback(new Error("请输入小于20的值"));
        }
      }
    }
  }
  // 表格回调
  onTableChange(msg: any) {
    switch (msg.ev_type) {
      case "click":
        console.log(msg);
        this.$nextTick(() => {
          this.rulerInfo.topLength = Math.floor(
            ((this.$refs.mytable as any).offsetWidth - 20) / 10
          );
        });
        this.tmpTHead = msg.data.object;
        this.tmpTable = this.tmpTHead.$rootTable;
        this.controlMenus = false;
        if (this.tmpTHead.type != "tbody") {
          this.headClick(msg);
          // this.addColBtn = true;
        } else {
          // this.addColBtn = false;
          this.show = false;
          // this.getHeadInfo();
        }
        break;
      case "rightClick":
        document.oncontextmenu = () => {
          return false;
        };
        // 更新定位
        this.tmpTHead = msg.data.object;
        this.deleTarget = msg.data.object;
        this.tmpTable = this.deleTarget.$rootTable;
        // 表头才有添加父级，表区才能删除
        if (msg.data.object.$rootParent.type !== "tbody") {
          this.controlPar = true;
        } else {
          this.controlPar = false;
        }
        // 菜单的位置
        this.controlMenus = true;
        // const widths = msg.event.clientX;
        const widths = msg.event.pageX;
        const heights = msg.event.pageY;
        (this.$refs.tests as HTMLElement).style.left = widths + "px";
        (this.$refs.tests as HTMLElement).style.top = heights + "px";
        break;
      case "blur":
        // 失焦校验
        this.blurCheck(msg.data.object);
        if (this.tmpTHead.type === "tbody") {
          if (this.tmpTable.tableHeadLeft.length == 0) {
            if (
              this.tmpTable.tableHeadTop[0][this.tmpTHead.position.colNum]
                .userData.formulaMode == "0002"
            ) {
              this.cellCheck(
                this.tmpTHead.cell.value,
                this.tmpTable.tableHeadTop[0][this.tmpTHead.position.colNum]
                  .userData
              );
            }
          } else if (this.tmpTable.tableHeadTop.length == 0) {
            if (
              this.tmpTable.tableHeadLeft[this.tmpTHead.position.rowNum][0]
                .userData.formulaMode == "0002"
            ) {
              this.cellCheck(
                this.tmpTHead.cell.value,
                this.tmpTable.tableHeadLeft[this.tmpTHead.position.rowNum][0]
                  .userData
              );
            }
          }
        }
        break;
      case "change":
        this.formula(msg.data.object);
        this.changeLinkage(msg.data.object);
        break;
      case "drop":
        msg.data.object.source.containerData.childrenShow =
          msg.data.object.target.containerData.childrenShow;
      default:
    }
  }
  // 选择表单
  chooseTable() {
    const reg = /^[1-9]+\d*$/;
    if (
      reg.test(this.optionalTable.colNum) &&
      reg.test(this.optionalTable.rowNum) &&
      this.optionalTable.colNum <= 20 &&
      this.optionalTable.rowNum <= 20
    ) {
      this.tableloading = true;
      this.tableNum++;
      const table: BaseTable = new BaseTable("表" + this.tableNum, {
        tableGroupId: "haier",
        hasLeftFixedTable: false,
        isTopLeftShow: true,
        canResizeWidth: true
      });
      table.tableSubject.subscribe(this.onTableChange, this);
      if (this.optionalTable.tempChooseRadio == 1) {
        for (let i = 0; i < this.optionalTable.colNum; i++) {
          const tmpData = {
            id: i + 1,
            cell: {
              value: ""
            }
          };
          table.theadAdd({
            type: "top",
            sourceContainerData: tmpData,
            targetParentPosition: []
          });
        }
        for (let i = 0; i < this.optionalTable.rowNum; i++) {
          table.addOneRow();
        }
      } else if (this.optionalTable.tempChooseRadio == 2) {
        for (let i = 0; i < this.optionalTable.colNum; i++) {
          const tmpData = {
            id: i + 1,
            cell: {
              value: ""
            }
          };
          table.theadAdd({
            type: "top",
            sourceContainerData: tmpData,
            targetParentPosition: []
          });
        }
        const addData1 = {
          cell: {
            value: ""
          },
          childrenShow: false
        };
        table.theadAdd({
          type: "left",
          sourceContainerData: addData1,
          targetParentPosition: []
        });
        for (let i = 0; i < this.optionalTable.rowNum; i++) {
          const addData = {
            cell: {
              value: ""
            },
            childrenShow: false
          };
          table.theadAdd({
            type: "left",
            sourceContainerData: addData,
            targetParentPosition: [0]
          });
        }
      } else if (this.optionalTable.tempChooseRadio == 3) {
        for (let i = 0; i < this.optionalTable.rowNum; i++) {
          const tmpData = {
            id: i + 1,
            cell: {
              value: ""
            }
          };
          table.theadAdd({
            type: "left",
            sourceContainerData: tmpData,
            targetParentPosition: []
          });
        }
        for (let i = 0; i < this.optionalTable.colNum; i++) {
          table.addOneCol();
        }
      }
      table.render();
      this.linkageFormula.push(this.nullArray.slice(0));
      this.formulaRow.push(this.nullArray.slice(0));
      this.areaTable.push(table.position.table);
      this.tableList.push(table);
      table.topLeftValue = table.position.table;
      this.optionalTable = {
        rowNum: 1,
        colNum: 1,
        tempChooseRadio: 1,
        addTableDialog: false,
        innerVisible: false
      };
      this.tableloading = false;
    }
  }
  // 表单属性->确定按钮
  getFieldProperties() {
    // 重置表头属性 是否删除 相应的公式关系
    // this.checkResetFormula(this.tmpTHead.position);
    const userData: any = {};
    // 判断重置联动枚举
    // if(this.form.linkageSet === "是" && this.form.type !== "枚举类型") {
    //   this.isRenderByThead();
    //   this.clearanceLinkageData();
    // }
    // let userData: any = {};
    Object.keys(this.form).forEach(Element => {
      userData[Element] = this.form[Element];
    });
    const container = this.tmpTable.getContainer(this.tmpTHead.position);
    const checkType: any = new Array();
    // 是否必填
    if (this.form.fillIn === "0001") {
      checkType.push("notNull");
      this.typeChecking(checkType, container);
    }
    // 类型判断
    if (this.form.type === "0001") {
      if (this.form.linkageSet === "否") {
        const data: any = [
          {
            text: "",
            value: (new Date() as any).valueOf().toString()
          }
        ];
        this.form.linkageSetArr.forEach((element: any, index: number) => {
          const temp = {
            text: element,
            value: (new Date() as any).valueOf().toString() + index
          };
          data.push(temp);
        });
        this.typeEnumeration(container, data);
      } else {
        this.typeEnumeration(container, "");
      }
    } else if (this.form.type === "0004") {
      checkType.push("date");
      this.typeChecking(checkType, container);
    } else if (this.form.type === "0003") {
      checkType.push("number");
      this.typeChecking(checkType, container);
      if (this.form.acquisitionMode === "0003") {
        if (this.form.formulaMode === "0001") {
          if (this.form.formulatxt1) {
            // 优化   不管用户有没有输入“ = ”，都能正常计算
            if (this.form.formulatxt1[0] !== "=") {
              this.form.formulatxt1 = "=" + this.form.formulatxt1;
            }
            const formatters = "decimal%" + this.form.decimals;
            const myTbodyConfig = {
              weight: {
                cell: {
                  value: 101, // 提高权重
                  displayClass: {
                    normal: 100,
                    dbclick: 100
                  }
                }
              },
              container: {
                cell: {
                  value: this.form.formulatxt1, // {sr}公式中{sc}分别代表所在行
                  formatter: formatters
                }
              }
            };
            container.tbodyConfig = myTbodyConfig;
          }
        }
      } else if (this.form.acquisitionMode === "0001") {
        if (this.form.characterType === "浮点型") {
          if (this.form.decimalDigit) {
            const str = "decimal%" + this.form.decimalDigit;
            checkType.push(str);
            this.typeChecking(checkType, container);
          } else {
            checkType.push("decimal");
            this.typeChecking(checkType, container);
          }
        } else if (this.form.characterType === "百分数") {
          const formatters = "percent%" + this.form.percentageDigit;
          container.tbodyConfig = {
            container: {
              cell: {
                formatter: formatters
              }
            }
          };
          this.tmpTable.render();
        } else {
          checkType.push("integer");
          this.typeChecking(checkType, container);
        }
      }
    } else if (this.form.type === "0002") {
      this.typeChecking(checkType, container, false);
    }
    container.cell.setProperty("value", this.form.name);
    // 新版的提示信息
    // container.tipContainer = {
    //   show: true,
    //   value: this.form.info
    // };
    // container.cell.setProperty("title", this.form.info);
    if (this.form.info !== "") {
      container.tipContainer.show = true;
      container.tipContainer.value = this.form.info;
    } else {
      container.tipContainer.show = false;
    }
    container.userData = userData;
    this.tmpTable.render();
    this.$message.success("字段属性已确定");
  }
  // 让表头下的单元格受表头控制
  isRenderByThead() {
    const colObj = this.tmpTHead.getColObj(this.tmpTHead.position);
    Object.keys(colObj).forEach((element: any, index: number) => {
      if(index > 1) {
        colObj[element].renderByThead = true;
      }
    });
  }
  // 变更字段属性点击确定按钮清空联动数据
  clearanceLinkageData() {
    this.tmpTable.userData.data = new Array();
    this.tmpTable.userData.tableHearderList = new Array();
    this.tmpTable.userData.isLinkage = false;
    this.tmpTHead.userData.linkageSet = null;
    this.tmpTHead.cell.select.optionList = new Array();
    this.tmpTHead.cell.select.selectOption = new Object();
  }
  // 判断重置后的表头是否是公式关系中的表头
  checkResetFormula(head: any) {
    // 受表头影响
    const getCols = this.tmpTHead.getColObj(this.tmpTHead.position);
    for (const i in getCols) {
      if (getCols[i].hasOwnProperty('renderByThead')) {
        getCols[i].renderByThead = true;
      }
    }
    if (!this.tmpTable.userData.hasOwnProperty("List")) {
      return;
    }
    // 存在公式关系时
    let arr = this.tmpTable.userData.List[0].pos;
    if (typeof arr === "string") {
      arr = JSON.parse(arr);
    }
    for (let i = 0; i < arr.length; i++) {
      if (
        JSON.stringify(head) === JSON.stringify(arr[i]) &&
        (this.form.type !== "0001" ||
          (this.form.type === "0001" && this.form.linkageSet !== "否"))
      ) {
        delete this.tmpTable.userData.List;
      }
    }
  }
  // 单元格校验
  cellCheck(num: any, form: any) {
    if (/^[0-9]*$/.test(num)) {
      if (form.formulaSymbol1 && form.formulatxt2) {
        const b = num + form.formulaSymbol1 + form.formulatxt2;
        const c = num + form.formulaSymbol2 + form.formulatxt3;
        if (!eval(b)) {
          this.tmpTHead.cell.value = "";
          this.tmpTHead.cell.content = "";
          this.$alert(
            `单元格值需要：‘${form.formulaSymbol1 + form.formulatxt2}’`,
            "错误提示",
            {
              confirmButtonText: "确定"
            }
          );
        }
      }
      if (form.formulaSymbol2 && form.formulatxt3) {
        const c = num + form.formulaSymbol2 + form.formulatxt3;
        if (!eval(c)) {
          this.tmpTHead.cell.value = "";
          this.tmpTHead.cell.content = "";
          this.$alert(
            `单元格值需要：‘${form.formulaSymbol2 + form.formulatxt3}’`,
            "错误提示",
            {
              confirmButtonText: "确定"
            }
          );
        }
      }
    } else {
      this.tmpTHead.cell.value = "";
      this.tmpTHead.cell.content = "";
      this.$alert(`请输入数字`, "错误提示", {
        confirmButtonText: "确定"
      });
    }
  }
  // 类型校验
  typeChecking(type: any, container: any, isVerification = true) {
    const myTbodyConfig = {
      weight: {
        cell: {
          value: 101,
          verification: 101 // 提高权重
        }
      },
      container: {
        cell: {
          verification: {
            hasVerification: isVerification,
            vTypes: type
          },
          displayClass: {
            normal: {
              displayType: "text"
            },
            dbclick: {
              displayType: "input"
            }
          },
          formatter: ""
        }
      }
    };
    container.tbodyConfig = myTbodyConfig;
    this.tmpTable.render();
  }
  // 联动数据处理
  tabularLinkage(position?: any) {
    const data = this.tableList[parseInt(position.table.substring(1)) - 1]
      .userData.data;
    // 设置当前表区是否有联动
    this.tableList[
      parseInt(position.table.substring(1)) - 1
    ].userData.isLinkage = true;
    // 第一个表头的下拉列表
    const selectLinkageData: any = new Array(); // 获取data里面的一级表头的下拉数据
    data.forEach((element: any) => {
      if (element.type === "select") {
        const tmp = {
          text: element.name,
          value: element.id
        };
        selectLinkageData.push(element);
      }
    });
    // 获取第一级联动相关信息
    const firstLinkageData: any = new Array();
    data.forEach((element: any) => {
      if (element.rid === "") {
        firstLinkageData.push(element);
      }
    });
    const firstHeadMsg = selectLinkageData.find((element: any) => {
      return firstLinkageData[0].pid === element.id;
    });
    const selectListData: any = [{ text: "", value: "" }]; // 往cell里面塞得数据
    data.forEach((element: any) => {
      if (element.pid === firstHeadMsg.id) {
        const tmp = {
          text: element.name,
          value: element.id
        };
        selectListData.push(tmp);
      }
    });
    // this.tableList[1] 要换成具体的哪个表
    const container = this.tableList[
      parseInt(position.table.substring(1)) - 1
    ].getContainer(firstHeadMsg.position);
    this.typeEnumeration(container, selectListData);
    this.tableList[parseInt(position.table.substring(1)) - 1].render();
  }
  // 枚举类型数据处理
  typeEnumeration(container: any, data: any) {
    const myTbodyConfig = {
      weight: {
        // 提高权重
        cell: {
          displayClass: {
            normal: 101,
            dbclick: 101
          }
        }
      },
      container: {
        // style:{backgroundColor: "#b7d4f8"},
        cell: {
          displayClass: {
            normal: {
              displayType: "select",
              select: {
                optionList: data
              }
            },
            dbclick: {
              displayType: "text"
            }
          }
        }
      }
    };
    container.tbodyConfig = myTbodyConfig;
    this.tmpTable.render();
  }
  // 联动
  changeLinkage(msg: any) {
    // console.log("changeLinkage", msg);
    const headTopData = this.tmpTHead.getTopIndexContainer(
      this.tmpTHead.position
    ).$theadContainer;
    if (headTopData.userData.linkageSet === "是") {
      const myLinkageData: any = {
        data: this.tmpTable.userData.data, // 全部联动数据
        selectData: this.tmpTable.userData.tableHearderList, // 全部type=slelct的联动数据
        valueData: [], // 全部type=value的联动数据
        nowHeadData: {}, // 当前表头信息
        nowValueId: this.tmpTHead.cell.select.selectOption.value
          ? this.tmpTHead.cell.select.selectOption.value
          : "", // 当前选中数据的id
        nowValueData: {}, // 当前选中值的数据
        nextHeadData: [], // 下一级联动的所有表头信息
        nextHeadId: [], // 下一级联动的表头id
        nextOtherHeadId: [], // 下一级关联表头除选中表头的其他表头id
        nextOtherHeadData: [], // 下一级关联表头除选中表头的其他表头数据
        nextAllListData: [], // 下一级联动的所有列表数据
        nextAllIdHeadId: [], // 下一级联动的所有表头id
        tempPosition: {}
      };
      // console.log("全部select",this.tmpTable.userData.tableHearderList)
      if (myLinkageData.nowValueId != "") {
        myLinkageData.nowValueData = myLinkageData.data.find((element: any) => {
          return element.id === myLinkageData.nowValueId;
        });
        // console.log("当前选中值的数据", myLinkageData.nowValueData);
        myLinkageData.nowHeadData = myLinkageData.selectData.find(
          (element: any) => {
            return element.id === myLinkageData.nowValueData.pid;
          }
        );
        // console.log("当前表头信息", myLinkageData.nowHeadData);
        myLinkageData.data.forEach((element: any) => {
          if (element.type === "value") {
            myLinkageData.valueData.push(element);
            if (element.rid === myLinkageData.nowValueId) {
              myLinkageData.nextAllListData.push(element);
              myLinkageData.nextAllIdHeadId.push(element.pid);
            }
          }
        });
        // 下一级联动的所有表头id（去重）
        myLinkageData.nextHeadId = myLinkageData.nextAllIdHeadId.filter(
          (keyword: any, index: any) => {
            return myLinkageData.nextAllIdHeadId.lastIndexOf(keyword) === index;
          }
        );
        // console.log("下一级联动的表头id", myLinkageData.nextHeadId);
        myLinkageData.nextOtherHeadId = JSON.parse(
          JSON.stringify(myLinkageData.nowHeadData.linkeageId)
        );
        myLinkageData.nextHeadId.forEach((element: any) => {
          myLinkageData.nextOtherHeadId.splice(
            myLinkageData.nextOtherHeadId.indexOf(element),
            1
          );
        });
        // console.log("下一级关联表头除选中表头的其他表头id", myLinkageData.nextOtherHeadId);
        if (myLinkageData.nextHeadId.length > 0) {
          myLinkageData.selectData.forEach((element: any) => {
            myLinkageData.nextHeadId.forEach((ele: any) => {
              if (element.id === ele) {
                myLinkageData.nextHeadData.push(element);
              }
            });
          });
        }
        // console.log("下一级联动的表头数据", myLinkageData.nextHeadData);
        // 其他表头数据清空
        if (myLinkageData.nextOtherHeadId.length > 0) {
          this.getNextLinkageNull(
            myLinkageData.nextOtherHeadId,
            myLinkageData.selectData
          );
        }
        // console.log(
        //   "下一级联动的其他的表头数据",
        //   myLinkageData.nextOtherHeadData
        // );
        // 下一级数据联动
        if (myLinkageData.nextHeadData.length > 0) {
          myLinkageData.nextHeadData.forEach((a: any) => {
            const listData: any = [{ text: "", value: "" }];
            myLinkageData.tempPosition = {
              colNum: a.position.colNum,
              colStr: a.position.colStr,
              rowNum: this.tmpTHead.position.rowNum,
              rowStr: this.tmpTHead.position.rowStr,
              table: this.tmpTHead.position.table
            };
            // console.log("下一个联动位置", myLinkageData.tempPosition);
            const container = this.tmpTable.getContainer(a.position);
            // console.log("下一集联动表头的下一级联动表头",a.linkeageId)
            myLinkageData.nextAllListData.forEach((b: any) => {
              if (a.id === b.pid) {
                const tempEle = {
                  text: b.name,
                  value: b.id
                };
                // console.log(tempEle);
                listData.push(tempEle);
              }
            });
            // console.log("select数据", listData);
            this.typeEnumeration(container, listData);
            // *********** 往下一个联动单元格塞数据 start ****************
            const nextContainer = this.tmpTable.getContainer(
              myLinkageData.tempPosition
            );
            nextContainer.cell.setCellData({
              displayClass: {
                normal: {
                  displayType: "select",
                  select: { optionList: listData }
                }
              }
            });
            nextContainer.renderByThead = false;
            this.tmpTable.render();
            // console.log("nextContainer.cell", nextContainer.cell);
            // *********** 往下一个联动单元格塞数据 end ****************
            this.getNextLinkageNull(a.linkeageId, myLinkageData.selectData);
          });
        }
      } else {
        // 空值时，清空下一级数据
        let nextCell: any = {};
        const headTopDataStr = JSON.stringify(headTopData.position);
        myLinkageData.selectData.forEach((a: any) => {
          if (headTopDataStr == JSON.stringify(a.position)) {
            nextCell = a;
          }
        });
        // console.log("nextCell.linkeageId", nextCell.linkeageId);
        this.getNextLinkageNull(nextCell.linkeageId, myLinkageData.selectData);
      }
    }
  }
  // 联动数据清空方法
  getNextLinkageNull(nowData: any, allData: any) {
    if (nowData.length > 0) {
      nowData.forEach((b: any) => {
        allData.find((a: any) => {
          if (a.id == b) {
            // console.log("联动数据清空方法---a",a)
            const position = {
              colNum: a.position.colNum,
              colStr: a.position.colStr,
              rowNum: this.tmpTHead.position.rowNum,
              rowStr: this.tmpTHead.position.rowStr,
              table: this.tmpTHead.position.table
            };
            // console.log("联动数据清空方法---position",position)
            const container = this.tmpTable.getContainer(position);
            container.cell.setProperty("value", "");
            // container.cell.setProperty("title", "");
            container.cell.setCellData({
              displayClass: {
                normal: {
                  displayType: "select",
                  select: { optionList: new Array(), selectOption: null }
                }
              }
            });
            container.renderByThead = false;
            // console.log("联动数据清空方法---container",container)
            if (a.linkeageId.length > 0) {
              this.getNextLinkageNull(a.linkeageId, allData);
            }
            return;
          }
        });
      });
    }
  }
  // 重置按钮
  handleReset() {
    // console.log("重置");
    this.form.name = "";
    this.form.info = "";
    this.form.fillIn = "";
    this.form.type = "";
    this.form.characterType = "";
    this.form.acquisitionMode = "";
    this.form.logicalAcquisitionType = "";
    this.form.dateFormat = "";
    this.form.decimalDigit = "";
    this.form.formulatxt1 = "";
    this.form.formulatxt2 = "";
    this.form.formulatxt3 = "";
    this.form.formulaSymbol1 = "";
    this.form.formulaSymbol2 = "";
    this.form.formulaMode = "";
    this.form.linkageSet = "";
    this.form.linkageSetArr = [];
    this.NonlinkageValue = "";
    this.form.decimals = "";
    this.form.percentageDigit = "";
    // this.form.options1 = []
  }
  // 点击表头触发事件
  headClick(msg: any) {
    this.handleReset();
    const userData = this.tmpTHead.userData;
    Object.keys(userData).forEach(Element => {
      this.form[Element] = userData[Element];
    });
    this.form.name = this.tmpTHead.cell.content;
    if (this.form.linkageSetArr.length > 0) {
      this.NonlinkageValue = this.form.linkageSetArr.join(" ");
    }
    this.show = true;
  }
  // 模板选择脚本信息
  getTemplate(data: any) {
    this.tableList = new Array();
    this.tableNum = 0;
    this.editTemplateInitialization(data.templateScript);
  }
  // 编辑模板进入后渲染模板初始化
  editTemplateInitialization(data?: any) {
    // const tmpscript = JSON.parse(this.getLocalStorage.templateScript);
    // 所有脚本数据
    const tmpscript = JSON.parse(data);
    // 模板脚本数据
    const tmpSaveJson =
      tmpscript instanceof Array ? tmpscript : tmpscript.serializedTemp;
    // console.log("tmpscript", tmpscript);
    // console.log("tmpSaveJson", tmpSaveJson);
    tmpSaveJson.forEach((table: BaseTable) => {
      const eiditTableJSON = JSON.parse(JSON.stringify(table));
      const tmpTable: BaseTable = new BaseTable(eiditTableJSON.id, {
        tableGroupId: "haier",
        isTopLeftShow: true,
        canResizeWidth: true,
        hasLeftFixedTable: false
      });
      tmpTable.deserialize(eiditTableJSON);
      tmpTable.tableSubject.subscribe(this.onTableChange, this);
      this.tableList.push(tmpTable);
      this.linkageFormula.push(this.nullArray.slice(0));
      this.formulaRow.push(this.nullArray.slice(0));
      this.areaTable.push(tmpTable.position.table);
      tmpTable.topLeftValue = tmpTable.position.table;
    });
    this.tableNum = Number(
      this.tableList[this.tableList.length - 1].id.slice(1)
    );
    // 表头表尾显示
    Object.keys(tmpscript.footTemp).forEach((a: any) => {
      this.tabFootJson[a] = tmpscript.footTemp[a];
    });
    Object.keys(tmpscript.headTemp).forEach((a: any) => {
      this.tabHeadJson[a] = tmpscript.headTemp[a];
    });
  }
  // 模板修改后的序列化与反序列化
  renderTemp(serializedTemp: any) {
    this.saveList = new Array();
    // 表格信息处理
    this.tableList.forEach((table: BaseTable) => {
      const tmpSaveJson: any = table.serialize();
      tmpSaveJson.tableName = this.input;
      {
        for (const key in tmpSaveJson) {
          if (tmpSaveJson.hasOwnProperty(key)) {
            JSON.stringify(tmpSaveJson[key]);
          }
        }
        serializedTemp.push(tmpSaveJson);
        const readonlyTableJSON = JSON.parse(JSON.stringify(tmpSaveJson));
        const readonlyTable: BaseTable = new BaseTable(readonlyTableJSON.id, {
          tableGroupId: "haier-readonly"
        });
        readonlyTable.deserialize(readonlyTableJSON);
        // readonlyTable.tableSubject.subscribe(this.onTableChange, this);
        readonlyTable.setDefaultConfig({
          table: {
            canResizeWidth: false,
            isShowColIndex: false,
            isShowRowIndex: false,
            hasLeftFixedTable: false
          },
          topThead: {
            readonly: true,
            draggable: false
          },
          leftThead: {
            readonly: true,
            draggable: false
          }
        });
        readonlyTable.tableSubject.subscribe(this.onTableChange, this);
        this.saveList.push(readonlyTable);
      }
      /* for (const key in tmpSaveJson) {
          if (tmpSaveJson.hasOwnProperty(key)) {
            JSON.stringify(tmpSaveJson[key]);
          }
        }
        serializedTemp.push(tmpSaveJson);
        tmpSaveJson = JSON.parse(JSON.stringify(tmpSaveJson));
        const tables: BaseTable = new BaseTable("表" + index, {
          tableGroupId: "yuhaier"
        });
        tables.deserialize(tmpSaveJson);
        tables.tableSubject.subscribe(this.onTableChange, this);
        tables.setDefaultConfig({
          table:{
            isShowColIndex: false,
            canResizeWidth: false,
            isShowRowIndex: false,
            isTopLeftShow: false
          },
          topThead: {
            readonly: true,
            draggable: false
          },
          leftThead: {
            readonly: true,
            draggable: false
          },
          baseTbody: {
            readonly: true
          }
        });
        this.saveList.push(tables);*/
    });
  }
  // 按钮接口（保存=001，提交=002，修改=003）
  interfaceBtn(state: any) {
    const serializedTemp: any = new Array();
    this.renderTemp(serializedTemp);
    // console.log(serializedTemp);
    // (this.$refs.childrenOne as any).tableHeadeJson();
    // (this.$refs.childrenTwo as any).tableFootJson();
    if (this.input && this.saveList.length > 0 && this.mySwitch) {
      this.tableloading = true;
      const myScript: any = {
        headTemp: this.tabHeadJson,
        footTemp: this.tabFootJson,
        tableVersion,
        serializedTemp
      };
      // (window as any).sessionStorage.setItem("thediffirent", JSON.stringify(myScript));
      // console.log(myScript)
      const params = {
        templateState: "0001",
        templateName: this.input,
        categoryId: this.getLocalStorage.templateClassId,
        templateScript: JSON.stringify(myScript),
        templateId: "",
        templateVersionId: "",
        userCode: this.judgeUrls !== "002" ? this.getLocalStorage.userCode : ""
      };
      // console.log(params)
      if (state === "002") {
        params.templateState = "0002";
        params.templateId = this.getLocalStorage.templateId;
        params.templateVersionId = this.getLocalStorage.templateVersionId;
      }
      if (state === "003") {
        params.templateState = "0001";
        params.templateId = this.getLocalStorage.templateId;
        params.templateVersionId = this.getLocalStorage.templateVersionId;
      }
      // console.log(params);
      interfaceSave(params, val => {
        if (state === "001") {
          this.getLocalStorage.page = 2;
          this.getLocalStorage.templateVersionId =
            val.resultData.templateVersionId;
          this.getLocalStorage.templateId = val.resultData.templateId;
          this.isSubmit = false;
          this.$message.success("模板保存成功");
        } else if (state === "002") {
          this.isSubmit = true;
          this.$message.success("模板提交成功");
        } else if (state === "003") {
          this.isSubmit = false;
          this.$message.success("模板修改成功");
        }
        this.tableloading = false;
      });
    } else if (this.saveList.length < 1) {
      this.$message.error("请添加表区");
    } else if (!this.input) {
      this.$message.error("请填写模板名称");
    } else if (!this.mySwitch) {
      this.$message.error("请显示模板信息");
    }
  }
  // 预览按钮
  isPreview() {
    this.tableloading = true;
    this.saveList = new Array();
    const serializedTemp: any = new Array();
    this.renderTemp(serializedTemp);
    this.tableloading = false;
    this.previewTableDialog = true;
    this.explainAble = true;
  }
  closePreview() {
    this.previewTableDialog = false;
    this.explainAble = false;
  }
  // 删除单元格
  theadDelete() {
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    // 删合并单元格类型会连孩子节点一起删除，删普通th不删除孩子节点
    let delesss = false;
    if (this.deleTarget.childrenShow === false) {
      delesss = true;
    }
    const topThead = {
      type: this.deleTarget.type,
      targetContainerPosition: this.deleTarget.theadPosition,
      withChildren: delesss
    };
    table.theadDelete(topThead);
    table.render();
    this.destroyTmptable(this.tmpTable);
  }
  // 添加列单元格
  addCol() {
    this.tmpTable.addOneCol();
    this.tmpTable.render();
  }
  // 合计显示
  addSumdialogShow(type?: string) {
    // debugger
    this.acrossDialog = 1;
    this.controlMenus = false;
    if (this.tmpTable.tableHeadTop.length == 0) {
      alert("列计算请用公式计算");
      return;
    }
    this.addSumdialogForm = {
      chooseThead: [],
      theadWidth: "",
      options: [],
      theadName: "",
      addSumData: [],
      // type: type
      type: "left"
    };
    if (type == "left") {
      const headList = this.tmpTable.theadTopEntity.leafIndexList;
      this.addSumdialogForm.tableId = this.tmpTable.id - 1;
      headList.forEach((element: any, index: any) => {
        console.log(headList[index],'33333', element);
        if (headList[index].userData.type == "0003" || headList[index].userData.type == "数值类型") {
          const temp1 = {
            content: headList[index].cell.content,
            position: headList[index].position
          };
          this.addSumdialogForm.addSumData.push(temp1);
          const temp2 = {
            label: headList[index].cell.content,
            value: headList[index].cell.content
          };
          this.addSumdialogForm.options.push(temp2);
        }
      });
    }
    this.addSumdialog = true;
  }
  // 合计确定
  addSum() {
    this.addSumdialogForm.addSumData.forEach((ele: any) => {
      this.addSumdialogForm.chooseThead.forEach((element: any) => {
        if (element == ele.content) {
          const container = this.tmpTable.getContainer(ele.position);
          container.canSum = true;
        }
      });
    });
    const acrossTable = this.tmpTable.position.table;
    if (
      this.acrossCollection.length === 0 ||
      acrossTable !==
        this.acrossCollection[this.acrossCollection.length - 1].table
    ) {
      const theContainer = {
        table: this.tmpTable.position.table,
        colNum: this.tmpTHead.position.colNum,
        colStr: this.tmpTHead.position.colStr,
        rowNum: 0,
        rowStr: 0
      };
      this.acrossCollection.push(theContainer);
    }
    if (this.tmpTable.tableHeadLeft.length == 0) {
      const tmpData = {
        id: 0,
        cell: {
          value: ""
        }
      };
      this.tmpTable.theadAdd({
        type: "left",
        sourceContainerData: tmpData,
        targetParentPosition: []
      });
      this.tmpTable.addSum(
        {
          cell: {
            value: this.addSumdialogForm.theadName
              ? this.addSumdialogForm.theadName
              : "合计"
          }
        },
        {
          targetParentPosition: [],
          type: "left"
        }
      );
      if (this.acrossTotal === false) {
        this.acrossCollection[this.acrossCollection.length - 1].colNum += 1;
        this.acrossCollection[
          this.acrossCollection.length - 1
        ].colStr = this.tmpTable.tableBody[0][
          this.acrossCollection[this.acrossCollection.length - 1].colNum
        ].position.colStr;
      }
      this.acrossTotal = true;
    } else {
      this.tmpTable.addSum(
        {
          cell: {
            value: this.addSumdialogForm.theadName
              ? this.addSumdialogForm.theadName
              : "合计"
          }
        },
        {
          targetParentPosition: [],
          type: "left"
        }
      );
    }
    // console.log(this.acrossCollection, 999);
    this.tmpTable.render();
    this.addSumdialog = false;
  }
  // 跨表区合计显示
  addCrossShow() {
    this.acrossDialog = 2;
    this.controlMenus = false;
    this.addSumdialogForm = {
      chooseThead: [],
      theadWidth: "",
      options: [],
      theadName: "",
      addSumData: [],
      type: "left"
    };
    this.acrossCollection.forEach((element: any, index: any) => {
      const temp2 = {
        label: "table" + this.acrossCollection[index].table,
        value: this.acrossCollection[index].table
      };
      this.addSumdialogForm.options.push(temp2);
    });
    this.addSumdialog = true;
  }
  // 跨表区合计确定
  addCrossSum() {
    let theFormula = "=";
    for (let i = 0; i < this.addSumdialogForm.chooseThead.length; i++) {
      const tables: BaseTable = this.tableList[i];
      const thead: ParamTheadAdd = {
        type: "left",
        sourceContainerData: {
          cell: {
            value: this.addSumdialogForm.theadName
          }
        } as any,
        targetParentPosition: []
      };
      tables.theadAdd(thead);
      tables.render();
      const container = tables.getContainer({
        colNum: this.acrossCollection[i].colNum,
        colStr: this.acrossCollection[i].colStr,
        rowNum: this.tableList[i].tableBody.length,
        rowStr: this.tableList[i].tableBody.length + 1,
        table: this.acrossCollection[i].table
      });
      container.renderByThead = false;
      const chuans = {
        colNum: this.acrossCollection[i].colNum,
        colStr: this.acrossCollection[i].colStr,
        rowNum: this.tableList[i].tableBody.length - 1,
        rowStr: this.tableList[i].tableBody.length,
        table: this.acrossCollection[i].table
      };
      const positionIndex =
        parseInt(this.acrossCollection[i].table.substring(1)) - 1;
      theFormula +=
        "table" +
        positionIndex +
        "!" +
        this.acrossCollection[i].colStr +
        this.findIndex(chuans, tables).rowStr +
        "+";
      container.cell.value = theFormula.substring(0, theFormula.length - 1);
      tables.render();
      // console.log(container, 2222);
    }
    this.addSumdialog = false;
  }
  // 跨表区找位置
  findIndex(obj: any, tables: any) {
    const container = tables.getContainer(obj);
    if (container.cell.value.substring(1, 5) === "table") {
      const chuan = {
        colNum: obj.colNum,
        colStr: obj.colStr,
        rowNum: obj.rowNum - 1,
        rowStr: obj.rowStr - 1,
        table: obj.table
      };
      this.findIndex(chuan, tables);
    }
    // console.log(obj);
    return obj;
  }
  // 菜单
  addUnit() {
    // 添加行
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    table.addOneRow();
    // 添加某行时，对该表区公式关系的优化处理
    const area = this.areaTable.indexOf(this.deleTarget.position.table);
    if (
      this.tableList[area].userData.hasOwnProperty("List") &&
      this.formulaRow[area].length !== 0
    ) {
      this.formulaRow[area].push(
        this.tmpTable.tableBody[this.tmpTable.tableBody.length - 1][0].position
          .rowStr
      );
      // if (this.deleTarget.position.table !== this.tmpTHead.position.table) {
      //   this.linkageFormula[area].push(this.arrayOneRow.slice(0, this.arrayOneRow.length));
      // } else {
      const insert =
        this.deleTarget.position.rowStr -
        this.tmpTable.tableBody[0][0].position.rowStr;
      this.linkageFormula[area].splice(
        insert,
        0,
        this.arrayOneRow.slice(0, this.arrayOneRow.length)
      );
      // }
    }
  }
  deleUnit(data: any) {
    // 删除行和列
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    table.delOneRowCol(data);
    table.render();
    this.destroyTmptable(this.tmpTable);
    // 删除某行时，对该表区公式关系的优化处理
    const area = this.areaTable.indexOf(this.deleTarget.position.table);
    if (
      data === "row" &&
      this.tableList[area].userData.hasOwnProperty("List") &&
      this.formulaRow[area].length !== 0
    ) {
      this.formulaRow[area].pop();
      const insert =
        this.deleTarget.position.rowStr -
        this.tmpTable.tableBody[0][0].position.rowStr;
      this.linkageFormula[area].splice(insert, 1);
    }
  }
  addPar() {
    // 添加父级
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    table.addParent({
      cell: {
        value: "新建单元格"
      }
    });
  }
  merge() {
    // debugger
    // 合并单元格
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    const parentValue = this.deleTarget.cell.content;
    const hide = {
      cell: {
        value: parentValue
      },
      childrenShow: false
    };
    table.addParent(hide);
  }
  addColss(data: any, positonParam: any) {
    // 添加列
    this.controlMenus = false;
    const table: BaseTable = this.tmpTable;
    table.addOneCol(data, positonParam);
  }
  hideMenu($event: any) {
    // 隐藏菜单
    this.controlMenus = false;
  }
  controlWidth(val: any) {
    // 设置列宽或行高
    this.controlMenus = false;
    this.controldialogWH = true;
    this.controlWH = val;
    // 显示单元格初始的行高/列宽
    if (val === 2) {
      this.Heightwidth = this.deleTarget.style.height.split("px")[0];
    } else {
      this.widthHeight = this.deleTarget.style.width.split("px")[0];
    }
  }
  controlWidHeight(val: any, limit: any) {
    // 列宽或行高的弹窗
    this.controldialogWH = false;
    // 范围限制
    if (+val > limit || +val < 1) {
      this.$message.error("不在范围1~500内！");
      return;
    }
    // 设置整列的宽
    if (this.controlWH === 1) {
      this.deleTarget.setWidthOrHeight("width", +val);
    } else {
      // 设置整行的高
      this.deleTarget.setWidthOrHeight("height", +val);
    }
  }
  // 销毁表区，保持表区table顺序一致
  destroyTmptable(table: any) {
    const tables: BaseTable = table;
    if (table.tableHeadTop.length === 0 && table.tableHeadLeft.length === 0) {
      const deleteIndex = parseInt(table.position.table.substring(1)) - 1;
      this.tableList.splice(deleteIndex, 1);
      this.areaTable.splice(deleteIndex, 1);
      this.formulaRow.splice(deleteIndex, 1);
      this.linkageFormula.splice(deleteIndex, 1);
      tables.onDestroy();
      this.tableList.forEach((element: any) => {
        element.topLeftValue = element.position.table;
        // element.render();
      });
    }
  }
  // 失焦校验，false会清空value值
  blurCheck(container: any) {
    // 校验小数 自动补齐位数的功能
    container.verification.vTypes.forEach((element: any) => {
      if (/^decimal%\d+$/.test(element)) {
        const digits = +element.split('%')[1];
        if (/^\d$/.test(container.content)) {
          container.value += ".";
          this.addZero(container, digits);
        } else if (/^\d\.\d+$/.test(container.content)) {
          const decimal = digits - container.content.split('.')[1].length;
          if (decimal>0) {
            this.addZero(container, decimal);
          }
        }
      }
    });
    // 校验清空功能
    if (!container.verification.state) {
      container.content = '';
      container.value = '';
      if (container.verification.vTypes.indexOf('notNull')===-1) {
        container.verification.state = true;
      }
    }
  }
  // 补零
  addZero(val: any, index: any) {
    for (let i = 0; i < index; i++) {
      val.value += '0';
    }
    val.content = val.value;
  }
  // 非联动公式关系判断
  formula(objects: any) {
    this.tmpTable = objects.$parent.$rootTable;
    const pos = objects.$parent.position;
    const poss = {
      colNum: pos.colNum,
      colStr: pos.colStr,
      rowNum: 0,
      rowStr: 1,
      table: pos.table
    };
    // 判断该表区是否存在公式联动关系
    if (
      this.tmpTable.userData.hasOwnProperty("List") &&
      this.judgeHead(
        poss,
        this.tmpTable.userData.List[0].pos,
        this.tmpTable.tableHeadTop.length
      )
    ) {
      // 选中表区的index
      const chooseTheArea = this.areaTable.indexOf(pos.table);
      if (this.formulaRow[chooseTheArea].length === 0) {
        this.totalRowFormula(chooseTheArea);
      }
      const weizhi = this.formulaRow[chooseTheArea].indexOf(pos.rowStr);
      if (weizhi !== -1) {
        this.judgeFormula(
          this.chooseRowFormula(
            this.parentHead.id,
            objects.select.selectOption.value,
            weizhi,
            this.headTotal.indexOf(this.parentHead.position.colNum),
            chooseTheArea
          )
        );
      }
    }
  }
  // 判断对象是否在数组对象中
  judgeHead(str: any, arr: any, lang: any) {
    if (typeof arr === "string") {
      arr = JSON.parse(arr);
    }
    this.formulaRelation = arr;
    this.headTotal = [];
    arr.forEach((element: any) => {
      this.headTotal.push(element.colNum);
    });
    this.headTotal = this.headTotal.sort((a: any, b: any) => {
      return a - b;
    });
    for (let j = 0; j < lang; j++) {
      str.rowNum = j;
      str.rowStr = j + 1;
      for (let i = 0; i < arr.length; i++) {
        const poss = {
          colNum: arr[i].colNum,
          colStr: arr[i].colStr,
          rowNum: arr[i].rowNum,
          rowStr: arr[i].rowStr,
          table: arr[i].table
        };
        if (JSON.stringify(poss) === JSON.stringify(str)) {
          this.parentHead = this.tmpTable.getContainer(poss);
          return true;
        }
      }
    }
    return false;
  }
  // 存在公式关系单元格所在行集合
  totalRowFormula(index: any) {
    this.formulaRow[index] = [];
    this.linkageFormula[index] = [];
    this.arrayOneRow = new Array();
    for (let m = 0; m < this.headTotal.length; m++) {
      this.arrayOneRow.push("");
    }
    for (let i = 0; i < this.tmpTable.tableBody.length; i++) {
      this.formulaRow[index].push(
        this.tmpTable.tableBody[i][0].position.rowStr
      );
      this.linkageFormula[index].push(
        this.arrayOneRow.slice(0, this.arrayOneRow.length)
      );
    }
    // 初始渲染时 加入脚本中的公式关系下拉选项值
    if (this.headTotal.length > 1) {
      this.tmpTable.tableBody.forEach((element: any, indexss: any) => {
        this.headTotal.forEach((ele: any, indexs: any) => {
          const headCol =
            ele - this.tmpTable.tableHeadTop[0][0].position.colNum;
          if (element[headCol].cell.content !== "") {
            this.linkageFormula[index][indexss][indexs] =
              this.tmpTable.getContainer(this.formulaRelation[indexs]).id +
              "|" +
              this.chooseSelect(
                element[headCol].cell.content,
                element[headCol].cell.select.optionList
              );
          }
        });
      });
    }
    return this.formulaRow;
  }
  // 判断联动关系是否一致，一致才触发公式渲染
  judgeFormula(str: any) {
    let pand = false;
    for (let i = 0; i < this.tmpTable.userData.List[0].r.length; i++) {
      if (pand) {
        break;
      }
      for (
        let j = 0;
        j < this.tmpTable.userData.List[0].r[i].head.length;
        j++
      ) {
        const lalala = this.tmpTable.userData.List[0].r[i].head[j];
        const target = this.tmpTable.getContainer({
          colNum: lalala.position.colNum,
          colStr: lalala.position.colStr,
          rowNum: this.formulaRow[str.areas][str.ids] - 1,
          rowStr: this.formulaRow[str.areas][str.ids],
          table: lalala.position.table
        });
        // console.log(str, '判断联动关系是否一致', this.tmpTable.userData.List[0].r[i].g);
        if (str.vals === this.tmpTable.userData.List[0].r[i].g) {
          pand = true;
          target.renderByThead = false;
          target.cell.verification.hasVerification = true;
          target.cell.verification.vTypes = [];
          if (lalala.val !== "") {
            const ti = this.formulaRow[str.areas][str.ids] + "";
            let gong = lalala.val.replace(/{sr}/g, ti);
            // 优化   不管用户有没有输入“ = ”，都能正常计算
            if (gong[0] !== "=") {
              gong = "=" + gong;
            }
            target.cell.value = gong;
            target.cell.displayClass.dbclick.displayType = "text";
            this.tmpTable.render();
          } else if (lalala.type === "002") {
            target.cell.displayClass.dbclick.displayType = "text";
            target.cell.value = "\\";
            target.cell.content = "\\";
          } else if (lalala.type === "003") {
            target.cell.verification.vTypes = ["notNull"];
            target.cell.value = "必填";
            target.cell.content = "必填";
          } else if (lalala.type === "001") {
            target.cell.value = "选填";
            target.cell.content = "选填";
          }
        } else {
          pand = false;
          target.renderByThead = true;
          target.cell.value = "";
          target.cell.content = "";
          target.cell.verification.vTypes = [];
          target.cell.displayClass.dbclick.displayType = "input";
          target.cell.style.backgroundColor = "transparent";
        }
      }
    }
  }
  // 传值公式处理
  chooseRowFormula(str: any, strs: any, index: any, headIndex: any, area: any) {
    this.linkageFormula[area][index][headIndex] = str + "|" + strs;
    const chuans = {
      vals: this.linkageFormula[area][index].join(),
      ids: index,
      areas: area
    };
    console.log(
      this.linkageFormula,
      "公式集合",
      this.headTotal,
      "表头集合",
      this.formulaRow,
      "行数集合",
      area
    );
    return chuans;
  }
  // 初始公式下拉框选中值的id
  chooseSelect(val: any, arr: any) {
    for (let m = 1; m < arr.length; m++) {
      if (val === arr[m].text) {
        return arr[m].value;
      }
    }
  }
  // 设置联动字段编辑提醒
  formLinkageSet() {
    if (this.form.linkageSet == "是") {
      this.$message({
        message: "请前往表单属性，编辑联动字段",
        type: "warning"
      });
    }
  }
  // // 表头组件
  getHeadJson(data: any) {
    this.tabHeadJson = data;
  }
  // getFootJson(data: any) {
  //   this.tabFootJson = data;
  //   // console.log(data.explain, '这是表尾信息')
  // }
  // 获取当前日期
  getCurrentDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const newDate = date.getDate();
    this.tabFootJson.date =
      date.getFullYear() +
      "-" +
      this.timeAdd0(month + "") +
      "-" +
      this.timeAdd0(newDate + "");
  }
  // 日期补零
  timeAdd0(str) {
    if (str.length <= 1) {
      str = "0" + str;
    }
    return str;
  }
  // 关闭预览弹窗的回调
  closeDialogs() {
    this.explainAble = false;
  }
  // 标尺
  myRuler() {
    (this.$refs.leftruler as any).style.height =
      (this.$refs.mytable as any).offsetHeight - 30 + "px";
    (this.$refs.topruler as any).style.width =
      (this.$refs.mytable as any).offsetWidth - 30 + "px";
    this.rulerInfo.topLength = Math.floor(
      ((this.$refs.mytable as any).offsetWidth - 20) / 10
    );
    this.rulerInfo.leftLength = Math.floor(
      ((this.$refs.mytable as any).offsetHeight - 20) / 10
    );
    this.$nextTick(() => {
      for (let i = 0; i < (this.$refs.leftruler as any).children.length; i++) {
        if (i % 5 == 0) {
          (this.$refs.leftruler as any).children[i].style.width = "6px";
          if (i % 10 == 0) {
            (this.$refs.leftruler as any).children[i].style.width = "9px";
            (this.$refs.leftruler as any).children[i].innerHTML = `<i>${i *
              10}</i>`;
          }
        }
      }
      for (let i = 0; i < (this.$refs.topruler as any).children.length; i++) {
        if (i % 5 == 0) {
          (this.$refs.topruler as any).children[i].style.height = "6px";
          if (i % 10 == 0) {
            (this.$refs.topruler as any).children[i].style.height = "9px";
            (this.$refs.topruler as any).children[i].innerHTML = `<i>${i *
              10}</i>`;
          }
        }
      }
    });
  }
}
</script>

<style lang='scss'>
@import "@/style/newlybuild.scss";
@import "@/style/elementchange.scss";
// 修改插件的提示logo的大小
.newlybuild .my-table svg {
  width: 13px !important;
}
.tabFoot {
  width: 90%;
  margin: auto;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-family: "Microsoft YaHei";
}
.tabFoot .el-input.is-disabled .el-input__inner {
  background: none;
  border-color: #000;
}
.tabFoot .el-input.is-disabled .el-input__inner {
  color: #606266;
}
.tabFoot .el-form-item__content {
  white-space: nowrap;
  margin-left: 100px;
}
.tabFoot .el-form-item__label {
  font-size: 12px;
}
.Opinion {
  width: 70%;
}
.Opinion .el-input__inner {
  border: 0;
}
.reportMan {
  width: 40%;
}
.reportMan .el-input__inner {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #000;
}
.name {
  width: 40%;
}
.Opinion span {
  float: left;
}
.Opinion .input1 {
  float: left;
}
.explain {
  width: 80%;
  font-size: 8px;
}
.explainInput {
  padding-top: 20px;
}
.explainInput .el-textarea__inner {
  height: 210px;
  line-height: 27px;
  font-size: 16px;
  border-color: #fff;
}

.explain .el-input__inner {
  border: 0;
}
</style>
<style>
.el-textarea.is-disabled .el-textarea__inner {
  color: #000;
  background-color: #fff;
  border-color: #fff;
}
</style>
