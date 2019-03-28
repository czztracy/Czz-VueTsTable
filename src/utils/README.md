联动弹窗确定之后 会返回两个数据

<1> 选中的表头 --> this.TableHeaderSelectValue

返回值
position --> 位置
id --> 自己 id
name --> 表头名称
type --> select 表头类型
disabled --> Boolean 能否选择

<2> 总数据 --> this.EnumerationData

返回值
id --> 自己 id
pid --> 父级 id
rid --> 关联 id
type --> select 代表 表头 为父级 value 为枚举字段值 为子级
name --> 字段名称或表头名称

其中 type 为 value 类型时  
有关联的字段
前一个字段的 id = 关联字段的 rid id 可以对多个 rid
如
物料描述 select 品牌 select

物料 1 value id —————— 品牌 1 value rid = 物料 1 的 id 品牌 2 value rid = 物料 1 的 id
物料 2 value

其中 物料描述下的枚举值物料 1 与品牌下的枚举值品牌 1,品牌 2 有关联。
