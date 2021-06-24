<template>
    <div class="bmap" id="container">
        <!-- 1.准备画布容器 -->
        <!-- <div ref="main" style="width: 1300px;height:900px;"></div> -->
    </div>
</template>
<script>
export default {
    name: 'BmapDemo',
    components: {},
    props: {},
    data () {
        return {

        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {
        var map = new window.BMap.Map('container');
        var point = new window.BMap.Point(116.404, 39.915)
        map.centerAndZoom(point, 15)
    },
    methods: {}

}
</script>
<style lang="less" scoped>
    .bmap {
        width: 800px;
        height: 600px;
        border: 1px solid #000;
    }
</style>