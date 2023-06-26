$(function () {
    // 渲染树
    $('#jstree').jstree({
        'plugins': ['themes', 'html_data', 'checkbox'],
        'core' : {
            'data' : [
                {
                    "text" : "Node 1",
                    "children" : [
                        {"text" : "Child 1"},
                    ]
                },
                {
                    "text" : "Node 2",
                    "children" : [
                        {"text" : "Child 2"},
                    ]
                },
                {
                    "text" : "Node 3",
                    "children" : [
                        {"text" : "Child 3"},
                    ]
                }
            ]
        }
    });
    // 选择节点
    $('#jstree').on("select_node.jstree", function (e, data) {
        console.log(data.node.id);
    });
});