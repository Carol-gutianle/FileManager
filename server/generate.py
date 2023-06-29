import os
from s3 import S3
import json


def generate(path: str):
    s3 = S3()
    core = json.dumps(s3.walk(path))
    js_code = '''
$(function () {{
    $('#jstree').jstree({{
        'plugins': ['themes', 'html_data', 'checkbox'],
        'core': {{
            'data': [{core}]
        }}
    }});
    $('#jstree').on("select_node.jstree", function (e, data) {{
        var children = data.instance.get_node(data.node).children;
        for(var i=0; i<children.length; i++) {{
            var subnode = data.instance.get_node(children[i]);
            var num = parseInt(subnode.text);
            if((num+1) % 3000 === 0){{
            data.instance.deselect_node(subnode.id);
            }} else {{
                var child = data.instance.get_node(subnode).children;
                for(var j=0; j<child.length; j++) {{
                    var grandchild = data.instance.get_node(child[j]);
                    if(grandchild.text.startsWith('optimizer')) {{
                        data.instance.deselect_node(grandchild.id);
                    }} else {{
                        data.instance.select_node(grandchild.id);
                    }}
                }}
            }}
        }}
    }});
}});
    '''.format(core=core)
    # 保存 JavaScript 代码到文件
    with open('../ui/tree.js', 'w') as f:
        f.write(js_code)
    print('JavaScript 代码已保存到文件 tree.js')