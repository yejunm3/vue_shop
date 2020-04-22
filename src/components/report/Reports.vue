<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 1000px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  async mounted() {
    const { data: res } = await this.$axios.get('reports/type/1')
    console.log(res)
    if (res.meta.status !== 200) return this.$message.error('获取数据失败')
    res.data.xAxis[0].boundaryGap = false
    // 
    var myChart = this.$echarts.init(document.getElementById('main'))
    var option = {
        title: {
            text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          }
        },
        grid: {
          left: '0',
          right: '5%',
          bottom: '0',
          containLabel: true // 区别在于是否以坐标轴作为基准
        },
        legend: res.data.legend,
        xAxis: res.data.xAxis,
        yAxis: res.data.yAxis,
        series: res.data.series
    }
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>
